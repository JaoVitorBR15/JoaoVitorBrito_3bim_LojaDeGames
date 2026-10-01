const { query } = require('../database');


async function listarPlataformas(req, res) {

    try {

        const resultado = await query(`
            SELECT *
            FROM plataformas
            ORDER BY nome
        `);

        res.json(resultado.rows);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao listar plataformas.'
        });
    }
}


async function obterPlataforma(req, res) {

    try {

        const { id } = req.params;

        const resultado = await query(`
            SELECT *
            FROM plataformas
            WHERE id_plataforma = $1
        `, [id]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Plataforma não encontrada.'
            });
        }

        res.json(resultado.rows[0]);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar plataforma.'
        });
    }
}


async function criarPlataforma(req, res) {

    try {

        const {
            nome,
            fabricante
        } = req.body;

        const resultado = await query(`
            INSERT INTO plataformas
            (
                nome,
                fabricante
            )
            VALUES ($1, $2)
            RETURNING *
        `, [
            nome,
            fabricante
        ]);

        res.status(201).json({
            mensagem: 'Plataforma cadastrada com sucesso!',
            plataforma: resultado.rows[0]
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao cadastrar plataforma.'
        });
    }
}


async function atualizarPlataforma(req, res) {

    try {

        const { id } = req.params;

        const {
            nome,
            fabricante
        } = req.body;

        const resultado = await query(`
            UPDATE plataformas
            SET
                nome = $1,
                fabricante = $2
            WHERE id_plataforma = $3
            RETURNING *
        `, [
            nome,
            fabricante,
            id
        ]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Plataforma não encontrada.'
            });
        }

        res.json({
            mensagem: 'Plataforma atualizada com sucesso!',
            plataforma: resultado.rows[0]
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao atualizar plataforma.'
        });
    }
}


async function deletarPlataforma(req, res) {

    try {

        const { id } = req.params;

        const resultado = await query(`
            DELETE FROM plataformas
            WHERE id_plataforma = $1
            RETURNING *
        `, [id]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Plataforma não encontrada.'
            });
        }

        res.json({
            mensagem: 'Plataforma excluída com sucesso!'
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao excluir plataforma.'
        });
    }
}


module.exports = {
    listarPlataformas,
    obterPlataforma,
    criarPlataforma,
    atualizarPlataforma,
    deletarPlataforma
};