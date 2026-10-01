const express = require('express');

const desenvolvedoraController =
    require('../controllers/desenvolvedoraController');

const router = express.Router();


router.get(
    '/listar',
    desenvolvedoraController.listarDesenvolvedoras
);

router.get(
    '/:id',
    desenvolvedoraController.obterDesenvolvedora
);

router.post(
    '/',
    desenvolvedoraController.criarDesenvolvedora
);

router.put(
    '/:id',
    desenvolvedoraController.atualizarDesenvolvedora
);

router.delete(
    '/:id',
    desenvolvedoraController.deletarDesenvolvedora
);


module.exports = router;