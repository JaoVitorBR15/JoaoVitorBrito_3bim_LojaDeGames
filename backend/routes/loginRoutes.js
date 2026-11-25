const express = require('express');
const loginController = require('../controllers/loginController');
const autenticar = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginController.login);
router.post('/cadastro', loginController.cadastrar);
router.get('/sessao', autenticar, loginController.verificarSessao);
router.post('/logout', loginController.logout);

module.exports = router;
