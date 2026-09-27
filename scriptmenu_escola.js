const escolaId = localStorage.getItem('escolaId');

if (escolaId === null) {
    window.location.href = 'login_escola.html';
}

async function MostrarNome() {
    try {
        const resposta = await fetch('http://localhost:3000/api/escola', {
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
    window.location.href = 'login_professor.html';
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
