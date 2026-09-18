const alunoId = localStorage.getItem('alunoId');

if (alunoId === null) {
    window.location.href = 'login_aluno.html';
}

async function MostrarNome() {
    try {
        const resposta = await fetch('http://localhost:3000/api/aluno', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: alunoId })
        });
        const aluno = await resposta.json();

        document.getElementById('ola').textContent = `Olá, ${aluno.nome}`;

    } catch (error) {
        console.error("Erro ao buscar dados do aluno:", error);
    }
}
MostrarNome();

function conf_saida_popup() {
    document.getElementById('confirm_saida').style.display = 'flex';
}

function sair() {
    localStorage.removeItem('alunoId');
    window.location.href = 'login_aluno.html';
}

function fecharPopup() {
    document.getElementById('confirm_saida').style.display = 'none';
}
