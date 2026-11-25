const crypto = require('crypto');
const { promisify } = require('util');

const scrypt = promisify(crypto.scrypt);

async function gerarHash(senha) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await scrypt(senha, salt, 64);
    return `${salt}:${hash.toString('hex')}`;
}

async function verificarSenha(senha, senhaArmazenada) {
    const partes = String(senhaArmazenada || '').split(':');

    if (partes.length !== 2) return false;

    const [salt, hashOriginal] = partes;
    const hashTentativa = await scrypt(senha, salt, 64);
    const hashBuffer = Buffer.from(hashOriginal, 'hex');

    return hashBuffer.length === hashTentativa.length &&
        crypto.timingSafeEqual(hashBuffer, hashTentativa);
}

module.exports = { gerarHash, verificarSenha };
