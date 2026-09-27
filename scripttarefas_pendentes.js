const alunoId = Number(localStorage.getItem('alunoId'));

if (alunoId === 0){
    window.location.href = 'login_aluno.html';
}

async function exibirTarefas(){

    try{

        const resposta = await fetch('http://localhost:3000/api/tarefas-aluno',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({alunoId})
        })

        const tarefas = await resposta.json();

        console.log(tarefas);

        if (!resposta.ok){
            console.error(tarefas.error)
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
                arquivo.href = `http://localhost:3000/${caminho}`;
                arquivo.textContent = `Download: ${tarefa.nome_arquivo}`;
                arquivo.download = tarefa.nome_arquivo;
                div.appendChild(arquivo);
            }

            const botao = document.createElement('button');
            botao.textContent = 'Concluir tarefa';
            botao.classList.add('btn-concluir');
            botao.onclick = () => conf_concluir_popup(tarefa.id_tarefa);
            div.appendChild(botao);

            lista.appendChild(div);

        });

    }catch(error){
        console.error(error);
    }
}
exibirTarefas();

let tarefaSelecionada;

function conf_concluir_popup(tarefaId){
    tarefaSelecionada = tarefaId;
    document.getElementById('confirm_concluir').style.display = 'flex';
}

function fecharPopupConcluir(){
    document.getElementById('confirm_concluir').style.display = 'none';
}

async function concluirTarefa(){
    try{
        const resposta = await fetch('http://localhost:3000/concluir-tarefa',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({alunoId: alunoId, tarefaId: tarefaSelecionada})
        });

        const resultado = await resposta.json();

        if(!resposta.ok){
            console.error(resultado.erro);
            return;
        }

        fecharPopupConcluir();
        location.reload();
    }catch(error){
        console.error(error);
    }
}