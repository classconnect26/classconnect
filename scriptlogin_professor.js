document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    const dados = { nome, senha };

    try {
        const resposta = await fetch('http://localhost:3000/login-professor', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(dados)
        });
        
        const resultado = await resposta.json();
        
        if (resposta.ok) {
            alert(`Login bem-sucedido! Bem-vindo, ${resultado.nome}.`);
            window.location.href = "passou.html";
        } else {
            alert(`Erro no login: ${resultado.erro}`);
        }
    } catch (error) {
        console.error("Erro ao realizar login (script):", error);
        alert("Erro ao realizar login.");
    }
});