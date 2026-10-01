const express = require('express');
const multer = require('multer');
const path = require('path');

const jogoController = require('../controllers/jogoController');

const router = express.Router();


/* =====================================================
   CONFIGURAÇÃO DO UPLOAD
===================================================== */

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(
            null,
            path.join(__dirname, '../../imagens')
        );
    },

    filename: function (req, file, cb) {

        const extensao =
            path.extname(file.originalname);

        const nomeArquivo =
            `jogo_${req.params.id}${extensao}`;

        cb(null, nomeArquivo);
    }

});

const upload = multer({
    storage: storage
});


/* =====================================================
   CRUD
===================================================== */

router.get(
    '/listar',
    jogoController.listarJogos
);

router.get(
    '/:id',
    jogoController.obterJogo
);

router.post(
    '/',
    jogoController.criarJogo
);

router.put(
    '/:id',
    jogoController.atualizarJogo
);

router.delete(
    '/:id',
    jogoController.deletarJogo
);


/* =====================================================
   PLATAFORMAS
===================================================== */

router.get(
    '/:id/plataformas',
    jogoController.listarPlataformasDoJogo
);

router.put(
    '/:id/plataformas',
    jogoController.associarPlataformas
);


/* =====================================================
   DETALHES
===================================================== */

router.post(
    '/:id/detalhes',
    jogoController.salvarDetalhes
);


/* =====================================================
   UPLOAD DA CAPA
===================================================== */

router.post(
    '/:id/imagem',
    upload.single('imagem'),
    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    erro: 'Nenhuma imagem foi enviada.'
                });
            }

            const nomeImagem = req.file.filename;

            const resultado = await require('../database').query(`
                UPDATE jogos
                SET imagem = $1
                WHERE id_jogo = $2
                RETURNING *
            `, [
                nomeImagem,
                req.params.id
            ]);

            if (resultado.rows.length === 0) {

                return res.status(404).json({
                    erro: 'Jogo não encontrado.'
                });
            }

            res.json({
                mensagem: 'Imagem enviada com sucesso!',
                imagem: nomeImagem,
                jogo: resultado.rows[0]
            });

        } catch (erro) {

            console.error(erro);

            res.status(500).json({
                erro: 'Erro ao enviar imagem.'
            });
        }
    }
);


module.exports = router;