const alunoId = Number(localStorage.getItem('alunoId'));

if (alunoId === 0) {
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
    localStorage.clear();
    window.location.href = 'index.html';
}

function fecharPopup() {
    document.getElementById('confirm_saida').style.display = 'none';
}

function sidebar(){
    if(document.getElementById('sidebar').style.width !== '20%'){
        document.getElementById('sidebar').style.width = '20%';
        document.getElementById('sidebar').style.contentVisibility = 'visible';
    }
    else{
        document.getElementById('sidebar').style.contentVisibility = 'hidden';
        document.getElementById('sidebar').style.width = '5%';
    }
}

function expandir_turma(){
    const turma = document.getElementById('turma');
    if (turma.style.height !== 'fit-content'){
        turma.style.minWidth = '20vw';
        turma.style.height = 'fit-content';
        turma.style.minHeight = '15vh'
        turma.style.padding = '1vw'
        turma.style.fontWeight = 'normal';

        async function exibiralunos() {
        try{
            const resposta = await fetch('http://localhost:3000/api/colegas', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: localStorage.getItem('alunoId')})
            })

            const dados = await resposta.json();

            const colegas = dados.colegas;
            const turmadoaluno = dados.turma;

            if (!resposta.ok) {
                console.error(dados.erro);
                return;
            }

            const lista = colegas.map(colegas => 
                {
                    if(colegas.id_aluno === alunoId){
                        return `${colegas.nome} (você)`;
                    }

                    return colegas.nome;
                }

            )

            turma.innerHTML = turmadoaluno + ':<br>' + lista.join('<br>');

        }catch (erro){
            console.log(erro)
        }
    };

    exibiralunos();
}
else{
    turma.style.width = '20vw';
    turma.style.height = '15vh';
    turma.style.fontWeight = 'bold';
    turma.style.padding = 'auto';
    turma.style.paddingLeft = '0.5vw'

    turma.innerHTML = 'Minha<br>turma';
}
}

async function expandir_materias(){
    const materias = document.getElementById('materias');
    if (materias.style.height !== 'fit-content'){
        materias.style.minWidth = '20vw';
        materias.style.height = 'fit-content';
        materias.style.minHeight = '15vh'
        materias.style.padding = '1vw'
        materias.style.fontWeight = 'normal';

        async function exibiralunos() {
        try{
            const resposta = await fetch('http://localhost:3000/api/materias-aluno', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({alunoId: localStorage.getItem('alunoId')})
            })

            const resultado = await resposta.json();

            if(!resposta.ok){
                materias.innerHTML = resultado.erro;
                return;
            }

            const lista = resultado.map(materias => materias.disciplina);

            materias.innerHTML = lista.join('<br>');

        }catch (erro){
            console.log(erro)
        }
    };

    exibiralunos();
}
else{
    materias.style.width = '20vw';
    materias.style.height = '15vh';
    materias.style.fontWeight = 'bold';
    materias.style.padding = 'auto';
    materias.style.paddingLeft = '0.5vw'

    materias.innerHTML = 'Matérias';
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
            const resposta = await fetch('http://localhost:3000/api/aluno', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({id: localStorage.getItem('alunoId')})
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
