const selectEscola = document.getElementById("escola");
const inputTurma = document.getElementById("turma");
inputTurma.disabled = true;

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


selectEscola.addEventListener("change", () => {
    if (selectEscola.value !== "") {
       inputTurma.disabled = false;
    }else{
        inputTurma.disabled = true;
    }
});

document.querySelector('form').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    function validarEmail(email) {
        const teste = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return teste.test(email);
    }

    if (!validarEmail(document.getElementById('email').value)) {
        alert("Email inválido!");
        return;
    }

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const turma = inputTurma.value;
    const id_escola = selectEscola.value;

    if (senha.length < 6) {
        alert("Senha deve ter pelo menos 6 caracteres!");
        return;
    }

    if (senha !== document.getElementById('csenha').value) {
        alert("Senha e confirmar senha não coincidem!");
        return;
    }

    const dados = {
        nome: nome,
        email: email,
        senha: senha,
        turma: turma,
        id_escola: id_escola
    };

    try {
        const resposta = await fetch('http://localhost:3000/cadastrar-aluno', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dados)
        })

        const resultado = await resposta.json();

        if (resposta.ok) {
                alert(`Sucesso! Bem vindo ao ClassConnect, ${resultado.nome}.\nAgora, faça o login para acessar a plataforma.`);
                document.querySelector('form').reset();
                window.location.href = "login_aluno.html";
            } else {
                alert(`Erro: ${resultado.erro}`);
            }
    }catch (erro) {
        console.error("Erro na requisição:", erro);
        alert("Não foi possível conectar ao servidor backend. O seu server.js está ligado?");
    }
})