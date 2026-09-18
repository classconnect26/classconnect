document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('escola').value;
    const senha = document.getElementById('senha').value;

    const dados = { nome, senha };

    try {
        const resposta = await fetch('http://localhost:3000/login-escola', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(dados)
        });

        if (resposta.ok) {
            alert("Login realizado com sucesso!");
            window.location.href = "passou.html";
        }
        else {
            alert("Erro no login: " + (await resposta.json()).erro);
        }
}catch (error) {
    console.error("Erro ao realizar login:", error);
    alert("Erro ao realizar login.");
}})