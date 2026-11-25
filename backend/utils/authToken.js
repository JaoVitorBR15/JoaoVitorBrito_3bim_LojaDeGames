const crypto = require('crypto');

function assinar(valor) {
    return crypto
        .createHmac('sha256', process.env.COOKIE_SECRET)
        .update(valor)
        .digest('hex');
}

function criarToken(idUsuario) {
    const expiracao = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
    const conteudo = `${idUsuario}.${expiracao}`;
    return `${conteudo}.${assinar(conteudo)}`;
}

function verificarToken(token) {
    if (!token || !process.env.COOKIE_SECRET) return null;

    const partes = token.split('.');
    if (partes.length !== 3) return null;

    const [idUsuario, expiracaoTexto, assinatura] = partes;
    const conteudo = `${idUsuario}.${expiracaoTexto}`;
    const assinaturaEsperada = assinar(conteudo);

    const a = Buffer.from(assinatura);
    const b = Buffer.from(assinaturaEsperada);

    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

    const expiracao = Number(expiracaoTexto);
    if (!Number.isInteger(expiracao) || expiracao < Math.floor(Date.now() / 1000)) {
        return null;
    }

    const id = Number(idUsuario);
    return Number.isInteger(id) && id > 0 ? id : null;
}

module.exports = { criarToken, verificarToken };
