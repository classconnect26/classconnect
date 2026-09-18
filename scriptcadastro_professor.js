const selectEscola = document.getElementById("escola");

async function carregarEscolas() {
    try {
        const resposta = await fetch('http://localhost:3000/api/escola');
        const escolas = await resposta.json();

        escolas.forEach(escola => {
            const opcao = document.createElement("option");

            opcao.value = escola.id_escola;
            opcao.textContent = escola.nome;

            selectEscola.appendChild(opcao);
        });

    } catch (erro) {
        console.error("Erro ao carregar escolas:", erro);
    }
}
carregarEscolas();

document.querySelector('form').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const nome = document.getElementById('usuario').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const id_escola = selectEscola.value;

    if (senha.length < 6) {
        alert("Senha deve ter pelo menos 6 caracteres!");
        return;
    }

    if (senha !== document.getElementById('csenha').value) {
        alert("Senha e confirmar senha não coincidem!");
        return;
    }

    function validarEmail(email) {
        const teste = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return teste.test(email);
    }

    if (!validarEmail(email)) {
        alert("Email inválido!");
        return;
    }

    const dados = { nome, email, senha, id_escola };

    try {
        const resposta = await fetch('http://localhost:3000/cadastrar-professor', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(dados)
        })

    const resultado = await resposta.json();

    if (resposta.ok) {
        alert(`Sucesso! Bem vindo ao ClassConnect, ${resultado.nome}.\nAgora, faça o login para acessar a plataforma.`);
        window.location.href = "login_professor.html";
    } else {
        alert(`Erro: ${resultado.erro}`);
    }
}catch (erro) {
    console.error("Erro na requisição:", erro);
    alert("Não foi possível conectar ao servidor backend. O seu server.js está ligado?");
}})