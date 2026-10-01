const express = require('express');

const plataformaController =
    require('../controllers/plataformaController');

const router = express.Router();


router.get(
    '/listar',
    plataformaController.listarPlataformas
);

router.get(
    '/:id',
    plataformaController.obterPlataforma
);

router.post(
    '/',
    plataformaController.criarPlataforma
);

router.put(
    '/:id',
    plataformaController.atualizarPlataforma
);

router.delete(
    '/:id',
    plataformaController.deletarPlataforma
);


module.exports = router;