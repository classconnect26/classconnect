const escolaId = Number(localStorage.getItem('escolaId'));

if(escolaId === 0){
    window.location.href = 'login_escola.html'
}

async function exibirTurmas() {
    try{
        const resposta = await fetch('http://localhost:3000/api/turmas-escola', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({escolaId})
        });

        const turmas = await resposta.json();

        turmas.forEach(turma => {
            
            const opcao = document.createElement('option');
            opcao.value = turma.id_turma;
            opcao.textContent = turma.nome;

            document.getElementById('Turma').appendChild(opcao);

        });

    }catch(error){}
}
exibirTurmas();

document.querySelector('form').addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const turmaId = document.getElementById('Turma').value;
    const professor = document.getElementById('professor').value;
    const disciplina = document.getElementById('disciplina').value

    try{
        const dados = {
            turmaId: turmaId,
            professor: professor,
            disciplina: disciplina
        }

        const resposta = await fetch('http://localhost:3000/designar-professor', {

            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dados)

        })

        const resultado = await resposta.json();

        if(!resposta.ok){
            alert(resultado.erro);
            return;
        }

        alert(resultado.mensagem);

    }catch(error){}

})