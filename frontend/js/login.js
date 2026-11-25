const API_URL = 'http://localhost:3001/auth';

const formLogin = document.getElementById('formLogin');
const formCadastro = document.getElementById('formCadastro');
const mensagem = document.getElementById('mensagem');
const painelSessao = document.getElementById('painelSessao');
const dadosUsuario = document.getElementById('dadosUsuario');
const btnSair = document.getElementById('btnSair');

function mostrarMensagem(texto, tipo = 'success') {
    mensagem.textContent = texto;
    mensagem.className = `message ${tipo}`;
}

async function enviarRequisicao(caminho, dados) {
    const resposta = await fetch(`${API_URL}/${caminho}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();
    if (!resposta.ok) throw new Error(resultado.erro || 'Ocorreu um erro.');
    return resultado;
}

formLogin.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(formLogin));

    try {
        const resultado = await enviarRequisicao('login', dados);
        mostrarMensagem(resultado.mensagem);
        formLogin.reset();
        await consultarSessao();
    } catch (erro) {
        mostrarMensagem(erro.message, 'error');
    }
});

formCadastro.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(formCadastro));

    try {
        const resultado = await enviarRequisicao('cadastro', dados);
        mostrarMensagem(resultado.mensagem);
        formCadastro.reset();
    } catch (erro) {
        mostrarMensagem(erro.message, 'error');
    }
});

async function consultarSessao() {
    try {
        const resposta = await fetch(`${API_URL}/sessao`, {
            credentials: 'include'
        });
        if (!resposta.ok) {
            painelSessao.classList.add('hidden');
            return;
        }

        const resultado = await resposta.json();
        const usuario = resultado.usuario;
        dadosUsuario.textContent = `${usuario.nome_usuario} — perfil: ${usuario.tipo_usuario}`;
        painelSessao.classList.remove('hidden');
    } catch (erro) {
        painelSessao.classList.add('hidden');
        console.error('Não foi possível consultar a sessão:', erro);
    }
}

btnSair.addEventListener('click', async () => {
    try {
        const resultado = await enviarRequisicao('logout', {});
        mostrarMensagem(resultado.mensagem);
        painelSessao.classList.add('hidden');
    } catch (erro) {
        mostrarMensagem(erro.message, 'error');
    }
});

consultarSessao();
