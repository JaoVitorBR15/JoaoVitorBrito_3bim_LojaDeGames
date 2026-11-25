const express = require('express');
const clienteController = require('../controllers/clienteController');
const autenticar = require('../middlewares/authMiddleware');
const exigirAdmin = require('../middlewares/adminMiddleware');

const router = express.Router();

/* A listagem e consulta de clientes ficam restritas ao painel administrativo. */
router.get('/listar', autenticar, exigirAdmin, clienteController.listarClientes);
router.get('/:id', autenticar, exigirAdmin, clienteController.obterCliente);
router.post('/', autenticar, exigirAdmin, clienteController.criarCliente);
router.put('/:id', autenticar, exigirAdmin, clienteController.atualizarCliente);
router.delete('/:id', autenticar, exigirAdmin, clienteController.deletarCliente);

module.exports = router;
