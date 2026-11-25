require('dotenv').config();
const { pool, query } = require('../database');
const { gerarHash } = require('../utils/password');

async function executar() {
    const nome = process.env.ADMIN_NAME || 'Administrador GameStore';
    const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const senha = process.env.ADMIN_INITIAL_PASSWORD || '';

    if (!email || senha.length < 8) {
        throw new Error('Defina ADMIN_EMAIL e ADMIN_INITIAL_PASSWORD (mínimo de 8 caracteres) no .env.');
    }

    const existente = await query(
        'SELECT id_usuario FROM usuarios WHERE LOWER(email_usuario) = $1',
        [email]
    );

    if (existente.rows.length) {
        console.log('A conta administrativa informada já existe. Nenhuma alteração realizada.');
        return;
    }

    const hash = await gerarHash(senha);
    await query(
        `INSERT INTO usuarios
            (nome_usuario, email_usuario, senha_usuario, tipo_usuario, id_cliente)
         VALUES ($1, $2, $3, 'admin', NULL)`,
        [nome, email, hash]
    );
    console.log('Conta administrativa criada com sucesso.');
}

executar()
    .catch(erro => {
        console.error('Erro ao criar administrador:', erro.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
