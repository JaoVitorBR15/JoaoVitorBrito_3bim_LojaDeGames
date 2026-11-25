function exigirAdmin(req, res, next) {
    if (!req.usuario || req.usuario.tipo_usuario !== 'admin') {
        return res.status(403).json({ erro: 'Acesso permitido somente para administradores.' });
    }

    next();
}

module.exports = exigirAdmin;
