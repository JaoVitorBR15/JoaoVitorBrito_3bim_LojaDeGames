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
    const botaoSair = document.getElementById('btnSair');
    if (botaoSair) botaoSair.addEventListener('click', sairDaConta);

    const usuario = await obterSessao();
    const linkEntrar = document.getElementById('linkEntrar');
    if (usuario && linkEntrar) linkEntrar.classList.add('hidden');

    document.querySelectorAll('nav a[href="admin.html"], nav a[href="clientes.html"], nav a[href="jogos.html"], nav a[href="plataformas.html"], nav a[href="desenvolvedoras.html"]').forEach(link => {
        if (!usuario || usuario.tipo_usuario !== 'admin') link.classList.add('hidden');
    });

    if (usuario && usuario.tipo_usuario === 'admin') {
        document.querySelectorAll('nav a[href="minha-conta.html"]').forEach(link => {
            link.href = 'admin.html';
            link.textContent = 'Painel admin';
        });
    }
});
