const crypto = require('crypto');
const { query, pool } = require('../database');
const { gerarHash, verificarSenha } = require('../utils/password');
const { criarToken } = require('../utils/authToken');

const NOME_COOKIE = 'gamestore_token';
const UM_DIA = 24 * 60 * 60 * 1000;

function opcoesCookie() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: UM_DIA,
        path: '/'
    };
}

async function login(req, res) {
    try {
        const email = String(req.body.email || '').trim().toLowerCase();
        const senha = String(req.body.senha || '');

        if (!email || !senha) {
            return res.status(400).json({ erro: 'Informe e-mail e senha.' });
        }

        const resultado = await query(
            `SELECT id_usuario, nome_usuario, email_usuario, senha_usuario,
                    tipo_usuario, id_cliente
             FROM usuarios WHERE LOWER(email_usuario) = $1`,
            [email]
        );

        if (resultado.rows.length === 0 ||
            !(await verificarSenha(senha, resultado.rows[0].senha_usuario))) {
            return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });
        }

        const usuario = resultado.rows[0];
        res.cookie(NOME_COOKIE, criarToken(usuario.id_usuario), opcoesCookie());

        res.json({
            mensagem: 'Login realizado com sucesso!',
            usuario: {
                id_usuario: usuario.id_usuario,
                nome_usuario: usuario.nome_usuario,
                email_usuario: usuario.email_usuario,
                tipo_usuario: usuario.tipo_usuario,
                id_cliente: usuario.id_cliente
            }
        });
    } catch (erro) {
        console.error('Erro no login:', erro);
        res.status(500).json({ erro: 'Não foi possível realizar o login.' });
    }
}

async function cadastrar(req, res) {
    const nome = String(req.body.nome || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const telefone = String(req.body.telefone || '').trim();
    const senha = String(req.body.senha || '');

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
    }
    if (senha.length < 8) {
        return res.status(400).json({ erro: 'A senha deve possuir pelo menos 8 caracteres.' });
    }
    if (senha.length > 128) {
        return res.status(400).json({ erro: 'A senha deve possuir no máximo 128 caracteres.' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const existente = await client.query(
            'SELECT 1 FROM usuarios WHERE LOWER(email_usuario) = $1',
            [email]
        );
        if (existente.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ erro: 'Este e-mail já possui uma conta.' });
        }

        const cliente = await client.query(
            'INSERT INTO clientes (nome, email, telefone) VALUES ($1, $2, $3) RETURNING id_cliente',
            [nome, email, telefone || null]
        );

        const senhaHash = await gerarHash(senha);
        const usuario = await client.query(
            `INSERT INTO usuarios
                (nome_usuario, email_usuario, senha_usuario, tipo_usuario, id_cliente)
             VALUES ($1, $2, $3, 'cliente', $4)
             RETURNING id_usuario, nome_usuario, email_usuario, tipo_usuario, id_cliente`,
            [nome, email, senhaHash, cliente.rows[0].id_cliente]
        );

        await client.query('COMMIT');
        res.status(201).json({
            mensagem: 'Conta criada com sucesso! Agora você pode entrar.',
            usuario: usuario.rows[0]
        });
    } catch (erro) {
        await client.query('ROLLBACK');
        console.error('Erro no cadastro:', erro);
        res.status(500).json({ erro: 'Não foi possível criar a conta.' });
    } finally {
        client.release();
    }
}

async function verificarSessao(req, res) {
    res.json({ autenticado: true, usuario: req.usuario });
}

function logout(req, res) {
    res.clearCookie(NOME_COOKIE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });
    res.json({ mensagem: 'Logout realizado com sucesso.' });
}

module.exports = { login, cadastrar, verificarSessao, logout };
