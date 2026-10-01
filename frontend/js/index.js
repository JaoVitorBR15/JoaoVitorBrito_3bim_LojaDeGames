const API = 'http://localhost:3001';

async function verificarServidor() {
    const statusText = document.getElementById('statusText');

    try {
        const resposta = await fetch(`${API}/`);

        if (!resposta.ok) {
            throw new Error();
        }

        statusText.textContent = 'Servidor conectado e API funcionando.';
    } catch (erro) {
        statusText.textContent =
            'Não foi possível conectar ao servidor. Verifique se o Node.js está rodando.';
    }
}

verificarServidor();
