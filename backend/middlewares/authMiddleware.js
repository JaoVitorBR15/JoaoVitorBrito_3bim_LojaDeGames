const { query } = require('../database');
const { verificarToken } = require('../utils/authToken');

function lerCookie(req, nome) {
    const cookies = (req.headers.cookie || '').split(';');

    for (const cookie of cookies) {
        const separador = cookie.indexOf('=');
        if (separador === -1) continue;

        const chave = cookie.slice(0, separador).trim();
        if (chave === nome) {
            return decodeURIComponent(cookie.slice(separador + 1).trim());
        }
    }

    return null;
}

async function autenticar(req, res, next) {
    try {
        const token = lerCookie(req, 'gamestore_token');
        const idUsuario = verificarToken(token);

        if (!idUsuario) {
            return res.status(401).json({ erro: 'Faça login para continuar.' });
        }

        const resultado = await query(
            `SELECT id_usuario, nome_usuario, email_usuario, tipo_usuario, id_cliente
             FROM usuarios WHERE id_usuario = $1`,
            [idUsuario]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({ erro: 'Sessão inválida. Faça login novamente.' });
        }

        req.usuario = resultado.rows[0];
        next();
    } catch (erro) {
        console.error('Erro na autenticação:', erro);
        res.status(500).json({ erro: 'Não foi possível validar a sessão.' });
    }
}

module.exports = autenticar;
