const express = require('express');

const clienteController =
    require('../controllers/clienteController');

const router = express.Router();


router.get(
    '/listar',
    clienteController.listarClientes
);

router.get(
    '/:id',
    clienteController.obterCliente
);

router.post(
    '/',
    clienteController.criarCliente
);

router.put(
    '/:id',
    clienteController.atualizarCliente
);

router.delete(
    '/:id',
    clienteController.deletarCliente
);


module.exports = router;