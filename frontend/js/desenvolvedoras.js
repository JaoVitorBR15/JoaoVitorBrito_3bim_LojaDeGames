const API = 'http://localhost:3001';

const formSection = document.getElementById('formSection');
const form = document.getElementById('form');
const mensagem = document.getElementById('mensagem');

let desenvolvedoras = [];
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
            await fetch(`${API}/desenvolvedora/listar`);

        if (!resposta.ok) throw new Error();

        desenvolvedoras = await resposta.json();
        renderizar();

    } catch {
        mensagemExibir(
            'Erro ao carregar desenvolvedoras.',
            'error'
        );
    }
}

function renderizar() {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';

    desenvolvedoras.forEach(d => {

        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${d.id_desenvolvedora}</td>
            <td>${escapeHtml(d.nome)}</td>
            <td>${escapeHtml(d.pais)}</td>
            <td class="actions">
                <button onclick="editar(${d.id_desenvolvedora})">
                    Editar
                </button>
                <button onclick="excluir(${d.id_desenvolvedora})">
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
        'Nova desenvolvedora';

    formSection.classList.remove('hidden');
}

async function editar(id) {
    try {

        const resposta =
            await fetch(`${API}/desenvolvedora/${id}`);

        if (!resposta.ok) throw new Error();

        const d = await resposta.json();

        modoEdicao = true;

        document.getElementById('id').value =
            d.id_desenvolvedora;

        document.getElementById('nome').value =
            d.nome;

        document.getElementById('pais').value =
            d.pais;

        document.getElementById('formTitulo').textContent =
            'Editar desenvolvedora';

        formSection.classList.remove('hidden');

    } catch {
        mensagemExibir(
            'Erro ao carregar desenvolvedora.',
            'error'
        );
    }
}

async function excluir(id) {

    const d =
        desenvolvedoras.find(
            item => item.id_desenvolvedora === id
        );

    if (!confirm(`Excluir "${d.nome}"?`)) return;

    try {

        const resposta =
            await fetch(`${API}/desenvolvedora/${id}`, {
                method: 'DELETE'
            });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro);
        }

        mensagemExibir(
            'Desenvolvedora excluída com sucesso!'
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
        pais: document.getElementById('pais').value
    };

    try {

        const resposta = await fetch(
            modoEdicao
                ? `${API}/desenvolvedora/${id}`
                : `${API}/desenvolvedora`,
            {
                method: modoEdicao ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro);
        }

        mensagemExibir(
            modoEdicao
                ? 'Desenvolvedora atualizada!'
                : 'Desenvolvedora cadastrada!'
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
