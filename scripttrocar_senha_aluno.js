const alunoId = Number(localStorage.getItem('alunoId'));

if (alunoId === 0) {
    window.location.href = 'login_aluno.html';
}

document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const senhaAtual = document.getElementById('senha_atual').value;
    const novaSenha = document.getElementById('nova_senha').value;
    const confirmarSenha = document.getElementById('confirmar_senha').value;

    if (novaSenha !== confirmarSenha) {
        alert('As senhas não coincidem. Por favor, tente novamente.');
        return;
    }

    if (novaSenha.length < 6) {
        alert('A nova senha deve ter pelo menos 6 caracteres.');
        return;
    }

    if (novaSenha === senhaAtual) {
        alert('A nova senha não pode ser igual à senha atual.');
        return;
    }

    const dados = {
        senhaAtual: senhaAtual,
        novaSenha: novaSenha,
        alunoId: alunoId
    };

    try {
        const resposta = await fetch('/trocar-senha-aluno', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if(!resposta.ok) {
            alert(resultado.erro);
            return;
        }

        alert('Senha alterada com sucesso!');
        window.location.href = 'menu_aluno.html';
    } catch (erro) {
        console.error('Erro ao alterar a senha:', erro);
        alert('Ocorreu um erro ao alterar a senha. Por favor, tente novamente mais tarde.');
    }
});