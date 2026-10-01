const { query } = require('../database');


async function listarDesenvolvedoras(req, res) {

    try {

        const resultado = await query(`
            SELECT *
            FROM desenvolvedoras
            ORDER BY nome
        `);

        res.json(resultado.rows);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao listar desenvolvedoras.'
        });
    }
}


async function obterDesenvolvedora(req, res) {

    try {

        const { id } = req.params;

        const resultado = await query(`
            SELECT *
            FROM desenvolvedoras
            WHERE id_desenvolvedora = $1
        `, [id]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Desenvolvedora não encontrada.'
            });
        }

        res.json(resultado.rows[0]);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar desenvolvedora.'
        });
    }
}


async function criarDesenvolvedora(req, res) {

    try {

        const {
            nome,
            pais
        } = req.body;

        const resultado = await query(`
            INSERT INTO desenvolvedoras
            (
                nome,
                pais
            )
            VALUES ($1, $2)
            RETURNING *
        `, [
            nome,
            pais
        ]);

        res.status(201).json({
            mensagem: 'Desenvolvedora cadastrada com sucesso!',
            desenvolvedora: resultado.rows[0]
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao cadastrar desenvolvedora.'
        });
    }
}


async function atualizarDesenvolvedora(req, res) {

    try {

        const { id } = req.params;

        const {
            nome,
            pais
        } = req.body;

        const resultado = await query(`
            UPDATE desenvolvedoras
            SET
                nome = $1,
                pais = $2
            WHERE id_desenvolvedora = $3
            RETURNING *
        `, [
            nome,
            pais,
            id
        ]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Desenvolvedora não encontrada.'
            });
        }

        res.json({
            mensagem: 'Desenvolvedora atualizada com sucesso!',
            desenvolvedora: resultado.rows[0]
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao atualizar desenvolvedora.'
        });
    }
}


async function deletarDesenvolvedora(req, res) {

    try {

        const { id } = req.params;

        const resultado = await query(`
            DELETE FROM desenvolvedoras
            WHERE id_desenvolvedora = $1
            RETURNING *
        `, [id]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Desenvolvedora não encontrada.'
            });
        }

        res.json({
            mensagem: 'Desenvolvedora excluída com sucesso!'
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao excluir desenvolvedora.'
        });
    }
}


module.exports = {
    listarDesenvolvedoras,
    obterDesenvolvedora,
    criarDesenvolvedora,
    atualizarDesenvolvedora,
    deletarDesenvolvedora
};