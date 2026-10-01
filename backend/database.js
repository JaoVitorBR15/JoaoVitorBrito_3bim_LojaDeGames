const { Pool } = require('pg');
require('dotenv').config();

const variaveisObrigatorias = [
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME'
];

for (const variavel of variaveisObrigatorias) {
    if (!process.env[variavel]) {
        console.error(`Erro: a variável ${variavel} não foi definida no arquivo .env`);
        process.exit(1);
    }
}

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

pool.on('connect', () => {
    console.log('Conectado ao PostgreSQL.');
});

pool.on('error', (erro) => {
    console.error('Erro inesperado no PostgreSQL:', erro);
});

module.exports = {
    query: (texto, parametros) => pool.query(texto, parametros),
    pool
};