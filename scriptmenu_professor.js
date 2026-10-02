const professorId = localStorage.getItem('professorId');

if (professorId === null) {
    window.location.href = 'login_professor.html';
}

async function MostrarNome() {
    try {
        const resposta = await fetch('/api/professor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: professorId })
        });
        const professor = await resposta.json();

        document.getElementById('ola').textContent = `Olá, ${professor.nome}`;

    } catch (error) {
        console.error("Erro ao buscar dados do professor:", error);
    }
}
MostrarNome();

function conf_saida_popup() {
    document.getElementById('confirm_saida').style.display = 'flex';
}

function sair() {
    localStorage.clear();
    window.location.href = 'index.html';
}

function fecharPopup() {
    document.getElementById('confirm_saida').style.display = 'none';
}

let ajudacontrole = 0;
let minhacontacontrole = 0

function sidebar(){
    if(document.getElementById('sidebar').style.width !== '20vw'){
        document.getElementById('sidebar').style.width = '20vw';
        document.getElementById('sidebar').style.contentVisibility = 'visible';
    }
    else{
        document.getElementById('sidebar').style.contentVisibility = 'hidden';
        document.getElementById('sidebar').style.width = '5vw';
        document.getElementById('ajudapopup').style.display = 'none';
        document.getElementById('minha_contapopup').style.display = 'none';
        ajudacontrole = 0;
        minhacontacontrole = 0;
    }
}

function redenviartarefa(){
    window.location.href = 'enviar_tarefa.html'
}

function redtarefasenviadas(){
    window.location.href = 'tarefas_enviadas.html'
}

async function exibirTurmas() {
    const turmasdiv = document.getElementById('turmas');
    if(turmasdiv.style.height !== 'fit-content'){
        turmasdiv.style.minWidth = '20vw';
        turmasdiv.style.height = 'fit-content';
        turmasdiv.style.minHeight = '15vh'
        turmasdiv.style.padding = '1vw'
        turmasdiv.style.fontWeight = 'normal';
    try{

        const resposta = await fetch('/api/turmas-professor', {

            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: professorId})

        })

        const turmas = await resposta.json();

        if(!resposta.ok){
            turmasdiv.innerHTML = turmas.erro;
            return;
        }

        const lista = turmas.map(turmas => turmas.nome);

            turmasdiv.innerHTML = lista.join('<br>');

    }catch(error){
        console.log(error);
    }
    }
    else{
        turmasdiv.style.width = '20vw';
        turmasdiv.style.height = '15vh';
        turmasdiv.style.fontWeight = 'bold';
        turmasdiv.style.padding = 'auto';
        turmasdiv.style.paddingLeft = '0.5vw'

        turmasdiv.innerHTML = 'Turmas';
    }
}

function expandir_ajuda(){
    
    document.getElementById('minha_contapopup').style.display = 'none';
    minhacontacontrole = 0;

    if(ajudacontrole === 1){
        document.getElementById('ajudapopup').style.display = 'none';
        ajudacontrole = 0;
    }
    else{
        document.getElementById('ajudapopup').style.display = 'flex';
        ajudacontrole = 1;
    }
}

async function exibir_minhaconta(){
    document.getElementById('ajudapopup').style.display = 'none';
    ajudacontrole = 0;

    if(minhacontacontrole === 0){

        minhacontacontrole = 1;
        document.getElementById('minha_contapopup').style.display = 'flex';

        try{
            const resposta = await fetch('/api/professor', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: localStorage.getItem('professorId')})
            })

            const resultado = await resposta.json();

            document.getElementById('usuario').textContent = resultado.nome;
            document.getElementById('email_usuario').textContent = resultado.email;

        }catch(error){

        }
    }
    else{
        minhacontacontrole = 0
        document.getElementById('minha_contapopup').style.display = 'none';
    }
}
