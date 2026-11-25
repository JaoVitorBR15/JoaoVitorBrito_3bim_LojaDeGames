const AUTH_API = 'http://localhost:3001/auth';

async function obterSessao() {
    try {
        const resposta = await fetch(`${AUTH_API}/sessao`, { credentials: 'include' });
        if (!resposta.ok) return null;
        const dados = await resposta.json();
        return dados.usuario || null;
    } catch (erro) {
        console.error('Falha ao consultar sessão:', erro);
        return null;
    }
}

async function protegerPagina(perfil, aoAutenticar) {
    const usuario = await obterSessao();
    if (!usuario) {
        window.location.replace('login.html');
        return;
    }
    if (perfil === 'admin' && usuario.tipo_usuario !== 'admin') {
        window.location.replace('minha-conta.html');
        return;
    }
    if (perfil === 'cliente' && usuario.tipo_usuario !== 'cliente') {
        window.location.replace('admin.html');
        return;
    }
    if (typeof aoAutenticar === 'function') aoAutenticar(usuario);
}

function preencherConta(usuario) {
    const nome = document.getElementById('nomeCliente');
    const email = document.getElementById('emailCliente');
    if (nome) nome.textContent = usuario.nome_usuario;
    if (email) email.textContent = usuario.email_usuario;
    const boasVindas = document.getElementById('boasVindas');
    if (boasVindas) boasVindas.textContent = `Olá, ${usuario.nome_usuario}. Você está conectado como administrador.`;
}

async function sairDaConta() {
    try {
        await fetch(`${AUTH_API}/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: '{}'
        });
    } finally {
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const nav = document.querySelector('.header-content nav');
    const usuario = await obterSessao();
    const linkEntrar = document.getElementById('linkEntrar');

    if (usuario) {
        if (linkEntrar) linkEntrar.classList.add('hidden');

        if (nav) {
            const linkLogin = nav.querySelector('a[href="login.html"]');
            if (linkLogin) {
                linkLogin.href = usuario.tipo_usuario === 'admin' ? 'admin.html' : 'minha-conta.html';
                linkLogin.textContent = usuario.tipo_usuario === 'admin' ? 'Painel admin' : 'Minha conta';
            }

            const linkConta = nav.querySelector('a[href="minha-conta.html"]');
            if (usuario.tipo_usuario === 'admin' && linkConta) {
                linkConta.href = 'admin.html';
                linkConta.textContent = 'Painel admin';
            }

            if (!nav.querySelector('[data-auth-logout]')) {
                const botao = document.createElement('button');
                botao.type = 'button';
                botao.className = 'btn btn-secondary';
                botao.textContent = 'Sair';
                botao.dataset.authLogout = 'true';
                botao.addEventListener('click', sairDaConta);
                nav.appendChild(botao);
            }
        }
    }

    document.querySelectorAll('nav a[href="admin.html"], nav a[href="clientes.html"], nav a[href="jogos.html"], nav a[href="plataformas.html"], nav a[href="desenvolvedoras.html"]').forEach(link => {
        if (!usuario || usuario.tipo_usuario !== 'admin') link.classList.add('hidden');
    });
});
