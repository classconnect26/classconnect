document.querySelector('form').addEventListener('submit', async (evento) => {
        evento.preventDefault();
        
        const escola = document.getElementById('escola').value;
        const cnpj = document.getElementById('cnpj').value;
        const senha = document.getElementById('senha').value;
        const csenha = document.getElementById('csenha').value;

        if (senha.length < 6 || csenha.length < 6) {
            alert("Senha deve ter pelo menos 6 caracteres!");
            return;
        }

        if (senha !== csenha) {
            alert("Senha e confirmação de senha não coincidem!");
            return;
        }

        if (cnpj.length !== 14) {
            alert("CNPJ deve ter 14 dígitos!");
            return;
        }

        const dados ={
            nome: escola,
            cnpj: cnpj,
            senha: senha
        };

        try {
            const resposta = await fetch('http://localhost:3000/cadastrar-escola', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dados)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert(`Sucesso! Bem vindo ao ClassConnect, ${resultado.nome}.\nAgora, faça o login para acessar a plataforma.`);
                document.querySelector('form').reset();
                window.location.href = "login_escola.html";
            } else {
                alert(`Erro ao cadastrar: ${resultado.erro}`);
            }

        } catch (erro) {
            console.error("Erro na requisição:", erro);
            alert("Não foi possível conectar ao servidor backend. O seu server.js está ligado?");
        }
});