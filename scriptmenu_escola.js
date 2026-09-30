const escolaId = localStorage.getItem('escolaId');

if (escolaId === null) {
    window.location.href = 'login_escola.html';
}

async function MostrarNome() {
    try {
        const resposta = await fetch('/api/escola', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: escolaId })
        });
        const escola = await resposta.json();

        document.getElementById('ola').textContent = `Olá, ${escola.nome}`;

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

function sidebar(){
    if(document.getElementById('sidebar').style.minHeight !== '30vh'){
        document.getElementById('sidebar').style.minHeight = '30vh';
        document.getElementById('sidebar').style.contentVisibility = 'visible';
    }
    else{
        document.getElementById('sidebar').style.contentVisibility = 'hidden';
        document.getElementById('sidebar').style.minHeight = '10vh';
    }
}

let ajudacontrole = 0;
let minhacontacontrole = 0

function expandir_ajuda(){
    
    document.getElementById('minha_contapopup').style.display = 'none'
    minhacontacontrole = 0;

    if(ajudacontrole === 1){
        document.getElementById('ajudapopup').style.display = 'none'
        ajudacontrole = 0;
    }
    else{
        document.getElementById('ajudapopup').style.display = 'block'
        ajudacontrole = 1;
    }
}

async function exibir_minhaconta(){
    document.getElementById('ajudapopup').style.display = 'none';
    ajudacontrole = 0;

    if(minhacontacontrole === 0){

        minhacontacontrole = 1;
        document.getElementById('minha_contapopup').style.display = 'block'

        try{
            const resposta = await fetch('/api/escola', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: localStorage.getItem('escolaId')})
            })

            const resultado = await resposta.json();

            document.getElementById('usuario').textContent = resultado.nome;
            document.getElementById('email_usuario').textContent = resultado.cnpj;

        }catch(error){

        }
    }
    else{
        minhacontacontrole = 0
        document.getElementById('minha_contapopup').style.display = 'none';
    }
}
