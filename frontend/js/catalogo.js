const API_CATALOGO = 'http://localhost:3001';
let jogosCatalogo = [];

const listaJogos = document.getElementById('listaJogos');
const estadoCatalogo = document.getElementById('estado');
const buscaCatalogo = document.getElementById('busca');

function escaparHtml(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, caractere => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[caractere]);
}

function mostrarEstado(texto, erro = false) {
    estadoCatalogo.textContent = texto;
    estadoCatalogo.className = erro ? 'message error' : 'message';
}

async function carregarCatalogo() {
    mostrarEstado('Carregando catálogo...');
    try {
        const resposta = await fetch(`${API_CATALOGO}/jogo/listar`);
        if (!resposta.ok) throw new Error('Não foi possível consultar o catálogo.');
        jogosCatalogo = await resposta.json();
        renderizarCatalogo();
        estadoCatalogo.classList.add('hidden');
    } catch (erro) {
        mostrarEstado(`${erro.message} Verifique se o servidor está ligado.`, true);
    }
}

function renderizarCatalogo() {
    const termo = buscaCatalogo.value.trim().toLocaleLowerCase('pt-BR');
    const filtrados = jogosCatalogo.filter(jogo =>
        `${jogo.nome} ${jogo.desenvolvedora}`.toLocaleLowerCase('pt-BR').includes(termo)
    );
    listaJogos.innerHTML = '';
    if (!filtrados.length) {
        listaJogos.textContent = 'Nenhum jogo encontrado.';
        return;
    }
    filtrados.forEach(jogo => {
        const card = document.createElement('article');
        card.className = 'game-card';
        const capa = jogo.imagem
            ? `<img src="${API_CATALOGO}/imagens/${encodeURIComponent(jogo.imagem)}" alt="Capa de ${escaparHtml(jogo.nome)}" loading="lazy">`
            : '<span aria-hidden="true">🎮</span>';
        card.innerHTML = `<div class="game-cover">${capa}</div>
            <div class="game-info"><h2>${escaparHtml(jogo.nome)}</h2>
            <p>Desenvolvedora: ${escaparHtml(jogo.desenvolvedora)}</p>
            <p>Lançamento: ${escaparHtml(new Date(jogo.data_lancamento).toLocaleDateString('pt-BR'))}</p>
            <button class="btn btn-secondary" type="button" data-id="${Number(jogo.id_jogo)}">Ver detalhes</button></div>`;
        listaJogos.appendChild(card);
    });
}

listaJogos.addEventListener('click', async evento => {
    const botao = evento.target.closest('button[data-id]');
    if (!botao) return;
    try {
        const resposta = await fetch(`${API_CATALOGO}/jogo/${botao.dataset.id}`);
        const jogo = await resposta.json();
        if (!resposta.ok) throw new Error(jogo.erro || 'Erro ao carregar detalhes.');
        const modal = document.createElement('dialog');
        modal.className = 'detail-dialog';
        modal.innerHTML = `<h2>${escaparHtml(jogo.nome)}</h2>
            <p><strong>Desenvolvedora:</strong> ${escaparHtml(jogo.desenvolvedora)}</p>
            <p><strong>Lançamento:</strong> ${escaparHtml(new Date(jogo.data_lancamento).toLocaleDateString('pt-BR'))}</p>
            <p><strong>Descrição:</strong> ${escaparHtml(jogo.descricao || 'Sem descrição cadastrada.')}</p>
            <p><strong>Classificação:</strong> ${escaparHtml(jogo.classificacao_indicativa || 'Não informada')}</p>
            <p><strong>Jogadores:</strong> ${escaparHtml(jogo.numero_jogadores || 'Não informado')}</p>
            <p><strong>Modo:</strong> ${escaparHtml(jogo.modo_jogo || 'Não informado')}</p>
            <button class="btn btn-primary" type="button">Fechar</button>`;
        document.body.appendChild(modal);
        modal.querySelector('button').addEventListener('click', () => { modal.close(); modal.remove(); });
        modal.addEventListener('click', e => { if (e.target === modal) { modal.close(); modal.remove(); } });
        modal.showModal();
    } catch (erro) {
        mostrarEstado(erro.message, true);
    }
});

buscaCatalogo.addEventListener('input', renderizarCatalogo);
document.getElementById('atualizar').addEventListener('click', carregarCatalogo);
carregarCatalogo();
