const express = require('express');
const plataformaController = require('../controllers/plataformaController');
const autenticar = require('../middlewares/authMiddleware');
const exigirAdmin = require('../middlewares/adminMiddleware');

const router = express.Router();

router.get('/listar', plataformaController.listarPlataformas);
router.get('/:id', plataformaController.obterPlataforma);
router.post('/', autenticar, exigirAdmin, plataformaController.criarPlataforma);
router.put('/:id', autenticar, exigirAdmin, plataformaController.atualizarPlataforma);
router.delete('/:id', autenticar, exigirAdmin, plataformaController.deletarPlataforma);

module.exports = router;
