const alunoId = Number(localStorage.getItem('alunoId'));

if(alunoId === 0){
    window.location.href = 'login_aluno.html';
}

async function exibirTarefas(){
    try{
        const resposta = await fetch('/api/tarefas-concluidas',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({alunoId})
        });

        const tarefas = await resposta.json();

        if(!resposta.ok){
            console.error(tarefas.erro);
            return;
        }

        const lista = document.getElementById('lista');

        tarefas.forEach(tarefa => {
            const div = document.createElement('div');
            div.classList.add('tarefa');

            div.innerHTML = `
            <h2>${tarefa.titulo}</h2>
            <p>${tarefa.descricao}<br>Matéria: ${tarefa.disciplina}</p>
            `;

            if(tarefa.nome_arquivo){
                const arquivo = document.createElement('a');
                const caminho = tarefa.caminho_arquivo.replaceAll('\\', '/');
                arquivo.href = `/${caminho}`;
                arquivo.textContent = `Download: ${tarefa.nome_arquivo}`;
                arquivo.download = tarefa.nome_arquivo;
                div.appendChild(arquivo);
            }

            lista.appendChild(div);
        });
    }catch(error){
        console.error(error);
    }
}

exibirTarefas();