document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('escola').value;
    const senha = document.getElementById('senha').value;

    const dados = { nome, senha };

    try {
        const resposta = await fetch('/login-escola', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            localStorage.clear();
            localStorage.setItem('escolaId', resultado.id)
            alert("Login realizado com sucesso!");
            window.location.href = "menu_escola.html";
        }
        else {
            alert("Erro no login: " + (await resposta.json()).erro);
        }
}catch (error) {
    console.error("Erro ao realizar login:", error);
    alert("Erro ao realizar login.");
}})