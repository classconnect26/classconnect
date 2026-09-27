const id = Number(localStorage.getItem('alunoId'))

async function exibiralunos() {
    try{
        const resposta = await fetch('http://localhost:3000/api/colegas', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id})
        })

        const colegas = await resposta.json();

        if (!resposta.ok) {
            console.error(colegas.erro);
            return;
        }

        const lista = colegas.map(colegas => 
            {
                if(colegas.id_aluno === id){
                    return `${colegas.nome} (você)`;
                }

                return colegas.nome;
            }

        )

        document.getElementById('lista').innerHTML = lista.join('<br>');

    }catch (erro){
        console.log(erro)
    }
};

exibiralunos();