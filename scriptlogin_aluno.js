document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    const dados = { nome, senha };

    try {
        const resposta = await fetch('http://localhost:3000/login-aluno', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dados),
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            localStorage.setItem('alunoId', resultado.id);
            console.log("Aluno logado com ID:", localStorage.getItem('alunoId'));
            alert(`Login bem-sucedido! Bem-vindo, ${resultado.nome}.`);
            window.location.href = "menu_aluno.html";
        } else {
            alert(`Erro no login: ${resultado.erro}`);
        }
} catch (error) {
    console.error("Erro ao realizar login:", error);
    alert("Erro ao realizar login.");
}})