const professorId = Number(localStorage.getItem('professorId'));

if (professorId === 0){
    window.location.href = 'login_professor.html';
}

async function exibirTurmas() {
    try{
        const resposta = await fetch('/api/tarefas-enviadas',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({professorId: professorId})
        });

        const resultado = await resposta.json();

        const lista = document.getElementById('lista');

        resultado.tarefas.forEach(tarefa => {

            const div = document.createElement('div');
            div.classList.add('tarefa');

            div.innerHTML = `
            <h2>${tarefa.titulo}</h2>
            <p>${tarefa.descricao}</p>
            `;

            const destinos = resultado.destino.filter(destino => destino.fk_tarefa_id_tarefa === tarefa.id_tarefa);

            const nomesTurmas = destinos.map(destino => {
                const turma = resultado.turmas.find(turma => turma.id_turma === destino.fk_turma_id_turma);
                return turma.nome;
            });

            const p = document.createElement('p');
            p.textContent = `Turma: ${nomesTurmas}`;

            div.appendChild(p);
            lista.appendChild(div);
        });

    }catch(error){
        console.error(error);
    }
}

exibirTurmas();