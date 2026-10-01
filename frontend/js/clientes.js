const API = 'http://localhost:3001';

const formSection = document.getElementById('formSection');
const form = document.getElementById('form');
const mensagem = document.getElementById('mensagem');

let clientes = [];
let modoEdicao = false;

function mensagemExibir(texto, tipo = 'success') {
    mensagem.textContent = texto;
    mensagem.className = `message ${tipo}`;

    setTimeout(() => {
        mensagem.className = 'message hidden';
    }, 4000);
}

async function carregar() {
    try {

        const resposta =
            await fetch(`${API}/cliente/listar`);

        if (!resposta.ok) throw new Error();

        clientes = await resposta.json();

        renderizar();

    } catch {
        mensagemExibir(
            'Erro ao carregar clientes.',
            'error'
        );
    }
}

function renderizar() {

    const lista =
        document.getElementById('lista');

    lista.innerHTML = '';

    clientes.forEach(cliente => {

        const tr =
            document.createElement('tr');

        tr.innerHTML = `
            <td>${cliente.id_cliente}</td>
            <td>${escapeHtml(cliente.nome)}</td>
            <td>${escapeHtml(cliente.email)}</td>
            <td>${escapeHtml(cliente.telefone || '-')}</td>
            <td class="actions">
                <button onclick="editar(${cliente.id_cliente})">
                    Editar
                </button>
                <button onclick="excluir(${cliente.id_cliente})">
                    Excluir
                </button>
            </td>
        `;

        lista.appendChild(tr);
    });
}

function abrirNovo() {

    modoEdicao = false;

    form.reset();

    document.getElementById('id').value = '';

    document.getElementById('formTitulo').textContent =
        'Novo cliente';

    formSection.classList.remove('hidden');
}

async function editar(id) {

    try {

        const resposta =
            await fetch(`${API}/cliente/${id}`);

        if (!resposta.ok) throw new Error();

        const cliente =
            await resposta.json();

        modoEdicao = true;

        document.getElementById('id').value =
            cliente.id_cliente;

        document.getElementById('nome').value =
            cliente.nome;

        document.getElementById('email').value =
            cliente.email;

        document.getElementById('telefone').value =
            cliente.telefone || '';

        document.getElementById('formTitulo').textContent =
            'Editar cliente';

        formSection.classList.remove('hidden');

    } catch {

        mensagemExibir(
            'Erro ao carregar cliente.',
            'error'
        );
    }
}

async function excluir(id) {

    const cliente =
        clientes.find(
            item => item.id_cliente === id
        );

    if (!confirm(`Excluir "${cliente.nome}"?`)) {
        return;
    }

    try {

        const resposta =
            await fetch(`${API}/cliente/${id}`, {
                method: 'DELETE'
            });

        const resultado =
            await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro);
        }

        mensagemExibir(
            'Cliente excluído com sucesso!'
        );

        carregar();

    } catch (erro) {

        mensagemExibir(
            erro.message ||
            'Não foi possível excluir.',
            'error'
        );
    }
}

form.addEventListener('submit', async event => {

    event.preventDefault();

    const id =
        document.getElementById('id').value;

    const dados = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value
    };

    try {

        const resposta = await fetch(
            modoEdicao
                ? `${API}/cliente/${id}`
                : `${API}/cliente`,
            {
                method: modoEdicao ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            }
        );

        const resultado =
            await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro);
        }

        mensagemExibir(
            modoEdicao
                ? 'Cliente atualizado!'
                : 'Cliente cadastrado!'
        );

        formSection.classList.add('hidden');

        carregar();

    } catch (erro) {

        mensagemExibir(
            erro.message || 'Erro ao salvar.',
            'error'
        );
    }
});

document.getElementById('btnNovo')
    .addEventListener('click', abrirNovo);

document.getElementById('btnFechar')
    .addEventListener('click', () =>
        formSection.classList.add('hidden')
    );

document.getElementById('btnCancelar')
    .addEventListener('click', () =>
        formSection.classList.add('hidden')
    );

document.getElementById('btnAtualizar')
    .addEventListener('click', carregar);

function escapeHtml(valor) {
    return String(valor ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

carregar();
