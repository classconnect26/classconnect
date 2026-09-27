const escolaId = localStorage.getItem('escolaId');

document.querySelector('form').addEventListener('submit', async (event) =>{
    event.preventDefault();

    const turma = document.getElementById('turma').value;

    const dados ={
        turma: turma,
        escolaId: escolaId
    }

    try{
        const resposta = await fetch('http://localhost:3000/criar-turma', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(dados)
        })

        const resultado = await resposta.json();

        if(!resposta.ok){
            alert(resultado.erro);
            return;
        }

        alert(resultado.mensagem);

        document.querySelector('form').reset();
    }catch (error){}
})