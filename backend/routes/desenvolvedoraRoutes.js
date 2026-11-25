const express = require('express');
const desenvolvedoraController = require('../controllers/desenvolvedoraController');
const autenticar = require('../middlewares/authMiddleware');
const exigirAdmin = require('../middlewares/adminMiddleware');

const router = express.Router();

router.get('/listar', desenvolvedoraController.listarDesenvolvedoras);
router.get('/:id', desenvolvedoraController.obterDesenvolvedora);
router.post('/', autenticar, exigirAdmin, desenvolvedoraController.criarDesenvolvedora);
router.put('/:id', autenticar, exigirAdmin, desenvolvedoraController.atualizarDesenvolvedora);
router.delete('/:id', autenticar, exigirAdmin, desenvolvedoraController.deletarDesenvolvedora);

module.exports = router;
