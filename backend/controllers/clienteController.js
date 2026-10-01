const { query } = require('../database');


async function listarClientes(req, res) {

    try {

        const resultado = await query(`
            SELECT *
            FROM clientes
            ORDER BY nome
        `);

        res.json(resultado.rows);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao listar clientes.'
        });
    }
}


async function obterCliente(req, res) {

    try {

        const { id } = req.params;

        const resultado = await query(`
            SELECT *
            FROM clientes
            WHERE id_cliente = $1
        `, [id]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Cliente não encontrado.'
            });
        }

        res.json(resultado.rows[0]);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao buscar cliente.'
        });
    }
}


async function criarCliente(req, res) {

    try {

        const {
            nome,
            email,
            telefone
        } = req.body;

        const resultado = await query(`
            INSERT INTO clientes
            (
                nome,
                email,
                telefone
            )
            VALUES ($1, $2, $3)
            RETURNING *
        `, [
            nome,
            email,
            telefone
        ]);

        res.status(201).json({
            mensagem: 'Cliente cadastrado com sucesso!',
            cliente: resultado.rows[0]
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao cadastrar cliente.'
        });
    }
}


async function atualizarCliente(req, res) {

    try {

        const { id } = req.params;

        const {
            nome,
            email,
            telefone
        } = req.body;

        const resultado = await query(`
            UPDATE clientes
            SET
                nome = $1,
                email = $2,
                telefone = $3
            WHERE id_cliente = $4
            RETURNING *
        `, [
            nome,
            email,
            telefone,
            id
        ]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Cliente não encontrado.'
            });
        }

        res.json({
            mensagem: 'Cliente atualizado com sucesso!',
            cliente: resultado.rows[0]
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao atualizar cliente.'
        });
    }
}


async function deletarCliente(req, res) {

    try {

        const { id } = req.params;

        const resultado = await query(`
            DELETE FROM clientes
            WHERE id_cliente = $1
            RETURNING *
        `, [id]);

        if (resultado.rows.length === 0) {

            return res.status(404).json({
                erro: 'Cliente não encontrado.'
            });
        }

        res.json({
            mensagem: 'Cliente excluído com sucesso!'
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: 'Erro ao excluir cliente.'
        });
    }
}


module.exports = {
    listarClientes,
    obterCliente,
    criarCliente,
    atualizarCliente,
    deletarCliente
};