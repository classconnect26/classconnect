const id = Number(localStorage.getItem('professorId'));

if (id === 0){
    window.location.href = 'login_professor.html';
}

async function exibirturmas() {
    try{
        const resposta = await fetch('http://localhost:3000/api/turmas-professor',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id})
        })

        const turmas = await resposta.json();

        turmas.forEach(turma => {
            const opcao = document.createElement("option");
            
            opcao.value = turma.id_turma;
            opcao.textContent = turma.nome;

            document.getElementById('turma').appendChild(opcao);
        });

    }catch(error){
        console.log(error);
    }
}
exibirturmas();

document.getElementById('form').addEventListener('submit', async (event) => {

    event.preventDefault();

    const dados = new FormData();

    dados.append('titulo', document.getElementById('recado').value);
    dados.append('descricao', document.getElementById('descricao').value);
    dados.append('turmaId', document.getElementById('turma').value);
    dados.append('professorId', id);

    if(document.getElementById('arquivo').files.length > 0){
        dados.append('arquivo', document.getElementById('arquivo').files[0]);
    }

    try{
        const resposta = await fetch('http://localhost:3000/enviar-tarefa', {
            method: 'POST',
            body: dados
        });

        const resultado = await resposta.json();

        if (!resposta.ok){
            alert (resultado.erro);
            return;
        }

        alert('Tarefa enviada!\nEnvie para mais turmas, se desejar.');
    }catch(error){
        console.error(error);
    }
})

function retornar(){
    window.location.href = 'menu_professor.html'
}