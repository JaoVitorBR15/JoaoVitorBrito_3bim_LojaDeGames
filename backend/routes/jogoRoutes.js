const express = require('express');
const multer = require('multer');
const path = require('path');
const jogoController = require('../controllers/jogoController');
const autenticar = require('../middlewares/authMiddleware');
const exigirAdmin = require('../middlewares/adminMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../imagens')),
    filename: (req, file, cb) => {
        const extensao = path.extname(file.originalname).toLowerCase();
        cb(null, `jogo_${req.params.id}${extensao}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
            return cb(new Error('Envie uma imagem JPG, PNG ou WEBP.'));
        }
        cb(null, true);
    }
});

router.get('/listar', jogoController.listarJogos);
router.get('/:id', jogoController.obterJogo);
router.get('/:id/plataformas', jogoController.listarPlataformasDoJogo);

/* Apenas administradores podem modificar o catálogo. */
router.post('/', autenticar, exigirAdmin, jogoController.criarJogo);
router.put('/:id', autenticar, exigirAdmin, jogoController.atualizarJogo);
router.delete('/:id', autenticar, exigirAdmin, jogoController.deletarJogo);
router.put('/:id/plataformas', autenticar, exigirAdmin, jogoController.associarPlataformas);
router.post('/:id/detalhes', autenticar, exigirAdmin, jogoController.salvarDetalhes);

router.post('/:id/imagem', autenticar, exigirAdmin, upload.single('imagem'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ erro: 'Nenhuma imagem foi enviada.' });

        const resultado = await require('../database').query(
            'UPDATE jogos SET imagem = $1 WHERE id_jogo = $2 RETURNING *',
            [req.file.filename, req.params.id]
        );

        if (!resultado.rows.length) {
            return res.status(404).json({ erro: 'Jogo não encontrado.' });
        }

        res.json({
            mensagem: 'Imagem enviada com sucesso!',
            imagem: req.file.filename,
            jogo: resultado.rows[0]
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao enviar imagem.' });
    }
});

module.exports = router;
