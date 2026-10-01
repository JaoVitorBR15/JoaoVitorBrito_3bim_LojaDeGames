const API = 'http://localhost:3001';

const formSection = document.getElementById('formSection');
const form = document.getElementById('form');
const mensagem = document.getElementById('mensagem');

let plataformas = [];
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
        const resposta = await fetch(`${API}/plataforma/listar`);
        if (!resposta.ok) throw new Error();

        plataformas = await resposta.json();
        renderizar();

    } catch (erro) {
        mensagemExibir('Erro ao carregar plataformas.', 'error');
    }
}

function renderizar() {
    const lista = document.getElementById('lista');
    lista.innerHTML = '';

    plataformas.forEach(p => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${p.id_plataforma}</td>
            <td>${escapeHtml(p.nome)}</td>
            <td>${escapeHtml(p.fabricante)}</td>
            <td class="actions">
                <button onclick="editar(${p.id_plataforma})">Editar</button>
                <button onclick="excluir(${p.id_plataforma})">Excluir</button>
            </td>
        `;

        lista.appendChild(tr);
    });
}

function abrirNovo() {
    modoEdicao = false;
    form.reset();
    document.getElementById('id').value = '';
    document.getElementById('formTitulo').textContent = 'Nova plataforma';
    formSection.classList.remove('hidden');
}

async function editar(id) {
    try {
        const resposta = await fetch(`${API}/plataforma/${id}`);
        if (!resposta.ok) throw new Error();

        const p = await resposta.json();

        modoEdicao = true;

        document.getElementById('id').value = p.id_plataforma;
        document.getElementById('nome').value = p.nome;
        document.getElementById('fabricante').value = p.fabricante;

        document.getElementById('formTitulo').textContent =
            'Editar plataforma';

        formSection.classList.remove('hidden');

    } catch {
        mensagemExibir('Erro ao carregar plataforma.', 'error');
    }
}

async function excluir(id) {
    const p = plataformas.find(item => item.id_plataforma === id);

    if (!confirm(`Excluir "${p.nome}"?`)) return;

    try {
        const resposta = await fetch(`${API}/plataforma/${id}`, {
            method: 'DELETE'
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro);
        }

        mensagemExibir('Plataforma excluída com sucesso!');
        carregar();

    } catch (erro) {
        mensagemExibir(
            erro.message || 'Não foi possível excluir.',
            'error'
        );
    }
}

form.addEventListener('submit', async event => {
    event.preventDefault();

    const id = document.getElementById('id').value;

    const dados = {
        nome: document.getElementById('nome').value,
        fabricante: document.getElementById('fabricante').value
    };

    try {
        const resposta = await fetch(
            modoEdicao
                ? `${API}/plataforma/${id}`
                : `${API}/plataforma`,
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
                ? 'Plataforma atualizada!'
                : 'Plataforma cadastrada!'
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

document.getElementById('btnNovo').addEventListener('click', abrirNovo);
document.getElementById('btnFechar').addEventListener('click', () =>
    formSection.classList.add('hidden')
);
document.getElementById('btnCancelar').addEventListener('click', () =>
    formSection.classList.add('hidden')
);
document.getElementById('btnAtualizar').addEventListener('click', carregar);

function escapeHtml(valor) {
    return String(valor ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

carregar();
