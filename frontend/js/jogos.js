const API = 'http://localhost:3001';

const jogosGrid = document.getElementById('jogosGrid');
const loading = document.getElementById('loading');
const formSection = document.getElementById('formSection');
const jogoForm = document.getElementById('jogoForm');
const mensagem = document.getElementById('mensagem');

let jogos = [];
let plataformas = [];
let modoEdicao = false;


/* =====================================================
   MENSAGENS
===================================================== */

function mostrarMensagem(texto, tipo = 'success') {
    mensagem.textContent = texto;
    mensagem.className = `message ${tipo}`;

    setTimeout(() => {
        mensagem.className = 'message hidden';
    }, 4500);
}


/* =====================================================
   CARREGAR DADOS
===================================================== */

async function carregarJogos() {
    loading.classList.remove('hidden');

    try {
        const resposta = await fetch(`${API}/jogo/listar`);

        if (!resposta.ok) {
            throw new Error('Erro ao buscar jogos.');
        }

        jogos = await resposta.json();
        await carregarPlataformasDosJogos();

        renderizarJogos();

    } catch (erro) {
        console.error(erro);
        mostrarMensagem('Não foi possível carregar os jogos.', 'error');
    } finally {
        loading.classList.add('hidden');
    }
}


async function carregarPlataformasDosJogos() {

    for (const jogo of jogos) {

        try {

            const resposta = await fetch(
                `${API}/jogo/${jogo.id_jogo}/plataformas`
            );

            jogo.plataformas = resposta.ok
                ? await resposta.json()
                : [];

        } catch {
            jogo.plataformas = [];
        }
    }
}


async function carregarDesenvolvedoras() {

    const select = document.getElementById('desenvolvedora');

    try {

        const resposta =
            await fetch(`${API}/desenvolvedora/listar`);

        const dados = await resposta.json();

        select.innerHTML =
            '<option value="">Selecione...</option>';

        dados.forEach(desenvolvedora => {

            const option =
                document.createElement('option');

            option.value =
                desenvolvedora.id_desenvolvedora;

            option.textContent =
                desenvolvedora.nome;

            select.appendChild(option);
        });

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            'Erro ao carregar desenvolvedoras.',
            'error'
        );
    }
}


async function carregarPlataformas() {

    const container =
        document.getElementById('plataformasCheckboxes');

    try {

        const resposta =
            await fetch(`${API}/plataforma/listar`);

        plataformas = await resposta.json();

        container.innerHTML = '';

        plataformas.forEach(plataforma => {

            const label =
                document.createElement('label');

            label.className = 'checkbox-item';

            label.innerHTML = `
                <input
                    type="checkbox"
                    value="${plataforma.id_plataforma}"
                    data-plataforma
                >
                <span>${escapeHtml(plataforma.nome)}</span>
            `;

            container.appendChild(label);
        });

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            'Erro ao carregar plataformas.',
            'error'
        );
    }
}


/* =====================================================
   RENDERIZAR JOGOS
===================================================== */

function renderizarJogos() {

    const termo =
        document.getElementById('buscaJogo')
            .value
            .toLowerCase()
            .trim();

    const filtrados = jogos.filter(jogo =>
        jogo.nome.toLowerCase().includes(termo)
    );

    jogosGrid.innerHTML = '';

    if (filtrados.length === 0) {

        jogosGrid.innerHTML = `
            <div class="panel">
                Nenhum jogo encontrado.
            </div>
        `;

        return;
    }

    filtrados.forEach(jogo => {

        const card =
            document.createElement('article');

        card.className = 'game-card';

        const imagem = jogo.imagem
            ? `${API}/imagens/${encodeURIComponent(jogo.imagem)}`
            : '';

        const tags =
            (jogo.plataformas || [])
                .map(p => `
                    <span class="platform-tag">
                        ${escapeHtml(p.nome)}
                    </span>
                `)
                .join('');

        card.innerHTML = `
            <div class="game-cover">
                ${
                    imagem
                    ? `<img
                        src="${imagem}"
                        alt="Capa de ${escapeHtml(jogo.nome)}"
                        onerror="this.parentElement.innerHTML='<span class=\\'placeholder\\'>🎮</span>'"
                      >`
                    : '<span class="placeholder">🎮</span>'
                }
            </div>

            <div class="game-info">

                <h3>${escapeHtml(jogo.nome)}</h3>

                <p>
                    <strong>Desenvolvedora:</strong>
                    ${escapeHtml(jogo.desenvolvedora)}
                </p>

                <p>
                    <strong>Lançamento:</strong>
                    ${formatarData(jogo.data_lancamento)}
                </p>

                <div class="platform-tags">
                    ${tags || '<span class="platform-tag">Sem plataforma</span>'}
                </div>

                <div class="card-actions">
                    <button onclick="editarJogo(${jogo.id_jogo})">
                        Editar
                    </button>

                    <button
                        class="delete"
                        onclick="excluirJogo(${jogo.id_jogo})"
                    >
                        Excluir
                    </button>
                </div>

            </div>
        `;

        jogosGrid.appendChild(card);
    });
}


/* =====================================================
   ABRIR / FECHAR FORMULÁRIO
===================================================== */

function abrirFormulario() {

    modoEdicao = false;

    jogoForm.reset();

    document.getElementById('idJogo').value = '';

    document.getElementById('formTitulo')
        .textContent = 'Novo jogo';

    document.getElementById('coverPreview').innerHTML =
        '<span>🎮</span><small>Prévia da capa</small>';

    document
        .querySelectorAll('[data-plataforma]')
        .forEach(cb => cb.checked = false);

    formSection.classList.remove('hidden');

    window.scrollTo({
        top: formSection.offsetTop - 90,
        behavior: 'smooth'
    });
}


function fecharFormulario() {
    formSection.classList.add('hidden');
}


/* =====================================================
   EDITAR JOGO
===================================================== */

async function editarJogo(id) {

    try {

        const resposta =
            await fetch(`${API}/jogo/${id}`);

        if (!resposta.ok) {
            throw new Error();
        }

        const jogo = await resposta.json();

        modoEdicao = true;

        document.getElementById('idJogo').value =
            jogo.id_jogo;

        document.getElementById('nome').value =
            jogo.nome;

        document.getElementById('dataLancamento').value =
            jogo.data_lancamento.substring(0, 10);

        document.getElementById('desenvolvedora').value =
            jogo.id_desenvolvedora;

        document.getElementById('descricao').value =
            jogo.descricao || '';

        document.getElementById('classificacao').value =
            jogo.classificacao_indicativa || 'Livre';

        document.getElementById('numeroJogadores').value =
            jogo.numero_jogadores || 1;

        document.getElementById('modoJogo').value =
            jogo.modo_jogo || 'Single-player';

        if (jogo.imagem) {

            const url =
                `${API}/imagens/${encodeURIComponent(jogo.imagem)}`;

            document.getElementById('coverPreview').innerHTML =
                `<img src="${url}" alt="Capa atual">`;
        }

        const respostaPlataformas =
            await fetch(`${API}/jogo/${id}/plataformas`);

        const plataformasJogo =
            respostaPlataformas.ok
                ? await respostaPlataformas.json()
                : [];

        const ids =
            plataformasJogo.map(p =>
                String(p.id_plataforma)
            );

        document
            .querySelectorAll('[data-plataforma]')
            .forEach(cb => {
                cb.checked = ids.includes(cb.value);
            });

        document.getElementById('formTitulo')
            .textContent = 'Editar jogo';

        formSection.classList.remove('hidden');

        window.scrollTo({
            top: formSection.offsetTop - 90,
            behavior: 'smooth'
        });

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            'Erro ao carregar os dados do jogo.',
            'error'
        );
    }
}


/* =====================================================
   SALVAR JOGO
===================================================== */

jogoForm.addEventListener('submit', async event => {

    event.preventDefault();

    const id =
        document.getElementById('idJogo').value;

    const dados = {
        nome: document.getElementById('nome').value,
        data_lancamento:
            document.getElementById('dataLancamento').value,
        id_desenvolvedora:
            Number(document.getElementById('desenvolvedora').value)
    };

    try {

        const url = modoEdicao
            ? `${API}/jogo/${id}`
            : `${API}/jogo`;

        const metodo = modoEdicao
            ? 'PUT'
            : 'POST';

        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || 'Erro ao salvar.');
        }

        const idJogo =
            modoEdicao
                ? id
                : resultado.jogo.id_jogo;

        await salvarDetalhes(idJogo);
        await salvarPlataformas(idJogo);

        const arquivo =
            document.getElementById('imagem').files[0];

        if (arquivo) {
            await enviarImagem(idJogo, arquivo);
        }

        mostrarMensagem(
            modoEdicao
                ? 'Jogo atualizado com sucesso!'
                : 'Jogo cadastrado com sucesso!'
        );

        fecharFormulario();
        await carregarJogos();

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            erro.message || 'Erro ao salvar o jogo.',
            'error'
        );
    }
});


/* =====================================================
   SALVAR DETALHES
===================================================== */

async function salvarDetalhes(id) {

    const dados = {
        descricao:
            document.getElementById('descricao').value,

        classificacao_indicativa:
            document.getElementById('classificacao').value,

        numero_jogadores:
            Number(
                document.getElementById('numeroJogadores').value
            ),

        modo_jogo:
            document.getElementById('modoJogo').value
    };

    const resposta =
        await fetch(`${API}/jogo/${id}/detalhes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

    if (!resposta.ok) {
        throw new Error('Erro ao salvar os detalhes.');
    }
}


/* =====================================================
   SALVAR PLATAFORMAS
===================================================== */

async function salvarPlataformas(id) {

    const selecionadas =
        [...document.querySelectorAll('[data-plataforma]:checked')]
            .map(cb => Number(cb.value));

    const resposta =
        await fetch(`${API}/jogo/${id}/plataformas`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                plataformas: selecionadas
            })
        });

    if (!resposta.ok) {
        throw new Error('Erro ao salvar plataformas.');
    }
}


/* =====================================================
   ENVIAR IMAGEM
===================================================== */

async function enviarImagem(id, arquivo) {

    const formData = new FormData();

    formData.append('imagem', arquivo);

    const resposta =
        await fetch(`${API}/jogo/${id}/imagem`, {
            method: 'POST',
            body: formData
        });

    if (!resposta.ok) {
        throw new Error('Erro ao enviar a capa.');
    }
}


/* =====================================================
   EXCLUIR
===================================================== */

async function excluirJogo(id) {

    const jogo =
        jogos.find(j => j.id_jogo === id);

    if (!jogo) {
        return;
    }

    const confirmar =
        confirm(
            `Deseja realmente excluir "${jogo.nome}"?`
        );

    if (!confirmar) {
        return;
    }

    try {

        const resposta =
            await fetch(`${API}/jogo/${id}`, {
                method: 'DELETE'
            });

        const resultado =
            await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro);
        }

        mostrarMensagem(
            'Jogo excluído com sucesso!'
        );

        await carregarJogos();

    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            erro.message || 'Erro ao excluir.',
            'error'
        );
    }
}


/* =====================================================
   PRÉVIA DA IMAGEM
===================================================== */

document
    .getElementById('imagem')
    .addEventListener('change', event => {

        const arquivo = event.target.files[0];

        if (!arquivo) {
            return;
        }

        const url =
            URL.createObjectURL(arquivo);

        document.getElementById('coverPreview').innerHTML =
            `<img src="${url}" alt="Prévia da capa">`;
    });


/* =====================================================
   BUSCA
===================================================== */

document
    .getElementById('buscaJogo')
    .addEventListener('input', renderizarJogos);


/* =====================================================
   EVENTOS
===================================================== */

document
    .getElementById('btnNovoJogo')
    .addEventListener('click', abrirFormulario);

document
    .getElementById('btnFecharForm')
    .addEventListener('click', fecharFormulario);

document
    .getElementById('btnCancelar')
    .addEventListener('click', fecharFormulario);

document
    .getElementById('btnAtualizar')
    .addEventListener('click', carregarJogos);


/* =====================================================
   FUNÇÕES AUXILIARES
===================================================== */

function formatarData(data) {

    if (!data) {
        return '-';
    }

    return new Date(
        `${data.substring(0, 10)}T00:00:00`
    ).toLocaleDateString('pt-BR');
}


function escapeHtml(valor) {

    return String(valor ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

async function iniciar() {

    await carregarDesenvolvedoras();
    await carregarPlataformas();
    await carregarJogos();
}

iniciar();
