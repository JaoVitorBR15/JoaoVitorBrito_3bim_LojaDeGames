const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const jogoRoutes = require('./routes/jogoRoutes');
const plataformaRoutes = require('./routes/plataformaRoutes');
const desenvolvedoraRoutes = require('./routes/desenvolvedoraRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

const app = express();

const PORT = 3001;


/* =====================================================
   MIDDLEWARES
===================================================== */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


/* =====================================================
   ARQUIVOS ESTÁTICOS
===================================================== */

app.use(
    '/imagens',
    express.static(path.join(__dirname, '../imagens'))
);


/* =====================================================
   ROTAS
===================================================== */

app.use('/jogo', jogoRoutes);

app.use('/plataforma', plataformaRoutes);

app.use('/desenvolvedora', desenvolvedoraRoutes);

app.use('/cliente', clienteRoutes);


/* =====================================================
   ROTA INICIAL
===================================================== */

app.get('/', (req, res) => {
    res.json({
        mensagem: 'Game Store API funcionando!'
    });
});


/* =====================================================
   INICIAR SERVIDOR
===================================================== */

app.listen(PORT, () => {
    console.log(`Servidor funcionando em http://localhost:${PORT}`);
});