const { query } = require('../database');


/* =====================================================
   LISTAR TODOS OS JOGOS
===================================================== */

async function listarJogos(req, res) {

    try {

        const resultado = await query(`
            SELECT
                j.id_jogo,
                j.nome,
                j.data_lancamento,
                j.imagem,
                d.id_desenvolvedora,
                d.nome AS desenvolvedora
            FROM jogos j
            INNER JOIN desenvolvedoras d
                ON j.id_desenvolvedora = d.id_desenvolvedora
            ORDER BY j.nome
        `);

        res.json(resultado.rows);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao listar os jogos.'
        });
    }
}


/* =====================================================
   OBTER UM JOGO
===================================================== */

async function obterJogo(req, res) {

    try {

        const { id } = req.params;

        const resultado = await query(`
            SELECT
                j.id_jogo,
                j.nome,
                j.data_lancamento,
                j.imagem,
                d.id_desenvolvedora,
                d.nome AS desenvolvedora,
                dj.descricao,
                dj.classificacao_indicativa,
                dj.numero_jogadores,
                dj.modo_jogo
            FROM jogos j

            INNER JOIN desenvolvedoras d
                ON j.id_desenvolvedora = d.id_desenvolvedora

            LEFT JOIN detalhes_jogo dj
                ON j.id_jogo = dj.id_jogo

            WHERE j.id_jogo = $1
        `, [id]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Jogo não encontrado.'
            });
        }

        res.json(resultado.rows[0]);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar o jogo.'
        });
    }
}


/* =====================================================
   CRIAR JOGO
===================================================== */

async function criarJogo(req, res) {

    try {

        const {
            nome,
            data_lancamento,
            imagem,
            id_desenvolvedora
        } = req.body;

        if (!nome || !data_lancamento || !id_desenvolvedora) {

            return res.status(400).json({
                erro: 'Nome, data de lançamento e desenvolvedora são obrigatórios.'
            });
        }

        const resultado = await query(`
            INSERT INTO jogos
            (
                nome,
                data_lancamento,
                imagem,
                id_desenvolvedora
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [
            nome,
            data_lancamento,
            imagem || null,
            id_desenvolvedora
        ]);

        res.status(201).json({
            mensagem: 'Jogo cadastrado com sucesso!',
            jogo: resultado.rows[0]
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao cadastrar o jogo.'
        });
    }
}


/* =====================================================
   ALTERAR JOGO
===================================================== */

async function atualizarJogo(req, res) {
    try {
        const { id } = req.params;

        const {
            nome,
            data_lancamento,
            id_desenvolvedora
        } = req.body;

        const resultado = await query(`
            UPDATE jogos
            SET
                nome = $1,
                data_lancamento = $2,
                id_desenvolvedora = $3
            WHERE id_jogo = $4
            RETURNING *
        `, [
            nome,
            data_lancamento,
            id_desenvolvedora,
            id
        ]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: 'Jogo não encontrado.'
            });
        }

        res.json({
            mensagem: 'Jogo atualizado com sucesso!',
            jogo: resultado.rows[0]
        });
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao atualizar o jogo.'
        });
    }
}


/* =====================================================
   EXCLUIR JOGO
===================================================== */

async function deletarJogo(req, res) {

    try {

        const { id } = req.params;

        const resultado = await query(`
            DELETE FROM jogos
            WHERE id_jogo = $1
            RETURNING *
        `, [id]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Jogo não encontrado.'
            });
        }

        res.json({
            mensagem: 'Jogo excluído com sucesso!',
            jogo: resultado.rows[0]
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao excluir o jogo.'
        });
    }
}


/* =====================================================
   LISTAR PLATAFORMAS DE UM JOGO
===================================================== */

async function listarPlataformasDoJogo(req, res) {

    try {

        const { id } = req.params;

        const resultado = await query(`
            SELECT
                p.id_plataforma,
                p.nome,
                p.fabricante
            FROM plataformas p

            INNER JOIN jogo_plataforma jp
                ON p.id_plataforma = jp.id_plataforma

            WHERE jp.id_jogo = $1

            ORDER BY p.nome
        `, [id]);

        res.json(resultado.rows);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao listar as plataformas do jogo.'
        });
    }
}


/* =====================================================
   ASSOCIAR PLATAFORMAS AO JOGO
===================================================== */

async function associarPlataformas(req, res) {

    try {

        const { id } = req.params;

        const { plataformas } = req.body;

        if (!Array.isArray(plataformas)) {

            return res.status(400).json({
                erro: 'Envie um array de IDs de plataformas.'
            });
        }

        await query(
            'DELETE FROM jogo_plataforma WHERE id_jogo = $1',
            [id]
        );

        for (const id_plataforma of plataformas) {

            await query(`
                INSERT INTO jogo_plataforma
                (
                    id_jogo,
                    id_plataforma
                )
                VALUES ($1, $2)
            `, [
                id,
                id_plataforma
            ]);
        }

        res.json({
            mensagem: 'Plataformas atualizadas com sucesso!'
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao atualizar as plataformas do jogo.'
        });
    }
}


/* =====================================================
   CRIAR/ATUALIZAR DETALHES
===================================================== */

async function salvarDetalhes(req, res) {

    try {

        const { id } = req.params;

        const {
            descricao,
            classificacao_indicativa,
            numero_jogadores,
            modo_jogo
        } = req.body;

        const resultado = await query(`
            INSERT INTO detalhes_jogo
            (
                id_jogo,
                descricao,
                classificacao_indicativa,
                numero_jogadores,
                modo_jogo
            )
            VALUES ($1, $2, $3, $4, $5)

            ON CONFLICT (id_jogo)
            DO UPDATE SET
                descricao = EXCLUDED.descricao,
                classificacao_indicativa = EXCLUDED.classificacao_indicativa,
                numero_jogadores = EXCLUDED.numero_jogadores,
                modo_jogo = EXCLUDED.modo_jogo

            RETURNING *
        `, [
            id,
            descricao,
            classificacao_indicativa,
            numero_jogadores,
            modo_jogo
        ]);

        res.json({
            mensagem: 'Detalhes salvos com sucesso!',
            detalhes: resultado.rows[0]
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao salvar os detalhes do jogo.'
        });
    }
}


module.exports = {
    listarJogos,
    obterJogo,
    criarJogo,
    atualizarJogo,
    deletarJogo,
    listarPlataformasDoJogo,
    associarPlataformas,
    salvarDetalhes
};