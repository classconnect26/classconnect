const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');

const upload = multer({dest: 'uploads/'})
const app = express();

app.use(cors()); 
app.use(express.json());
app.use('/uploads', express.static('uploads'))

app.use(express.static(__dirname));

const pool = new Pool({
    user: 'postgres', 
    host: 'localhost',
    database: 'classconnect', 
    password: '1909', 
    port: 5432,
});


app.listen(3000, () => {
    console.log("Servidor backend rodando em http://localhost:3000");
});

app.post('/cadastrar-escola', async (req, res) => {
    const { nome, cnpj, senha } = req.body;

    try {
        const cnpjExistente = await pool.query('SELECT * FROM escola WHERE cnpj = $1', [cnpj]);
        if (cnpjExistente.rows.length > 0) {
            return res.status(400).json({ erro: "CNPJ já cadastrado." });
        }

        const resultado = await pool.query('INSERT INTO escola (nome, cnpj, senha) VALUES ($1, $2, $3) RETURNING nome', [nome, cnpj, senha]);
        
        return res.status(201).json({ 
            nome: resultado.rows[0].nome,
            caca: "popo"
        });
    } catch (error) {
        console.error("Erro no banco:", error);
        return res.status(500).json({ erro: "Erro ao salvar no banco de dados." });
    }
});

app.post('/cadastrar-aluno', async (req, res) => {
    try{
        const  { nome, email, senha, turma, id_escola } = req.body;

        const emailExistente = await pool.query('SELECT * FROM aluno WHERE email = $1', [email]);

        if (emailExistente.rows.length > 0) {
            return res.status(400).json({ erro: "Email já cadastrado." });
        }

        const resultado = await pool.query('SELECT id_turma FROM turma WHERE LOWER(nome) = LOWER($1) AND fk_escola_id_escola = $2', [turma, id_escola]);

        if (resultado.rows.length === 0) {
            return res.status(400).json({ erro: "Turma não encontrada para a escola selecionada." });
        }

        const id_turma = resultado.rows[0].id_turma;
        
        const resultadoAluno = await pool.query('INSERT INTO aluno (nome, email, senha, fk_turma_id_turma) VALUES ($1, $2, $3, $4) RETURNING nome', [nome, email, senha, id_turma]);
        const quantalunoupdate = await pool.query('SELECT COUNT(*) AS quantidade FROM aluno WHERE fk_turma_id_turma = $1', [id_turma])

        const quantidade = quantalunoupdate.rows[0].quantidade;

        await pool.query('UPDATE turma SET quant_alunos = $1 WHERE id_turma = $2', [quantidade, id_turma])

        return res.status(201).json({ 
            mensagem: "Aluno cadastrado com sucesso!" ,
            nome: resultadoAluno.rows[0].nome
        });
        }catch (error) {
            console.error("Erro ao cadastrar aluno:", error);
            return res.status(500).json({ erro: "Erro ao cadastrar aluno." });
        }
})

app.post('/cadastrar-professor', async (req, res) => {
    try{
        const  { nome, email, senha, id_escola } = req.body;

        const emailExistente = await pool.query('SELECT * FROM professor WHERE email = $1', [email]);

        if (emailExistente.rows.length > 0) {
            return res.status(400).json({ erro: "Email já cadastrado." });
        }

        const resposta = await pool.query('INSERT INTO professor (nome, email, senha) VALUES ($1, $2, $3) RETURNING nome, id_professor', [nome, email, senha]);
        await pool.query('INSERT INTO professor_escola_trabalha (fk_professor_id_professor, fk_escola_id_escola) VALUES ($1, $2)', [resposta.rows[0].id_professor, id_escola]);

        return res.status(201).json({
            mensagem: "Professor cadastrado com sucesso!" ,
            nome: resposta.rows[0].nome
        });
        }catch (error) {
            console.error("Erro ao cadastrar professor:", error);
            return res.status(500).json({ erro: "Erro ao cadastrar professor." });
        }
 })

 app.post('/criar-turma', async (req, res) => {
    try{
        const {turma, escolaId} = req.body;

        const checarturma = await pool.query('SELECT * FROM turma WHERE nome = $1', [turma]);

        if(checarturma.rows.length > 0){
            return res.status(400).json({erro: 'Turma já criada no sistema, tente outro nome.'})
        }

        const resposta = await pool.query('INSERT INTO turma (quant_alunos, fk_escola_id_escola, nome) VALUES (0, $1, $2) RETURNING id_turma, nome', [escolaId, turma])

        return res.status(201).json({ mensagem: 'Turma criada!', nome: resposta.rows[0].nome})

    }catch (error){
        console.error('Erro ao criar turma: ', error);
        return res.status(500).json({ erro: 'Erro ao criar turma.' })
    }
 })

 app.post('/login-aluno', async (req, res) => {
    try {
        const { nome, senha } = req.body;

        const resultado = await pool.query('SELECT * FROM aluno WHERE email = $1 OR nome = $1', [nome]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: "Aluno ou email não encontrado." });
        }

        const aluno = resultado.rows[0];

        if (aluno.senha !== senha) {
            return res.status(401).json({ erro: "Senha incorreta." });
        }
        
        return res.status(200).json({ mensagem: "Login realizado com sucesso!", nome: aluno.nome, id: aluno.id_aluno });
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        return res.status(500).json({ erro: "Erro ao realizar login." });
    }
});

app.post('/login-escola', async (req, res) => {
    try {
        const { nome, senha } = req.body;

        const resultado = await pool.query('SELECT * FROM escola WHERE cnpj = $1 OR nome = $1', [nome]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: "Escola ou CNPJ não encontrado." });
        }

        const escola = resultado.rows[0];

        if (escola.senha !== senha) {
            return res.status(401).json({ erro: "Senha incorreta." });
        }

        return res.status(200).json({id: escola.id_escola});

    } catch (error) {
        console.error("Erro ao realizar login:", error);
        return res.status(500).json({ erro: "Erro ao realizar login." });
    }
})

app.post('/login-professor', async (req, res) => {
    try {
        const { nome, senha } = req.body;

        const resultado = await pool.query('SELECT * FROM professor WHERE email = $1 OR nome = $1', [nome]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: "Professor ou email não encontrado." });
        }

        const professor = resultado.rows[0];

        if (professor.senha !== senha) {
            return res.status(401).json({ erro: "Senha incorreta." });
        }

        return res.status(200).json({ mensagem: "Login realizado com sucesso!", nome: professor.nome , id: professor.id_professor});
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        return res.status(500).json({ erro: "Erro ao realizar login." });
    }
})

app.get('/api/escola-cadastro', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM escola ORDER BY nome');
        res.json(resultado.rows);
    } catch (error) {
        console.error("Erro ao buscar escolas:", error);
        res.status(500).json({ erro: "Erro ao buscar escolas." });
    }
})

app.post('/designar-professor', async (req, res) => {

    try{

        const { professor, turmaId, disciplina } = req.body;

        const professorIdcheck = await pool.query('SELECT id_professor FROM professor WHERE nome = $1', [professor])

        if(professorIdcheck.rows.length === 0){
            return res.status(404).json({erro: 'Professor não cadastrado nessa escola.'});
        }

        const professorId = professorIdcheck.rows[0].id_professor;

        const professorcheck = await pool.query('SELECT * FROM professor_turma_leciona WHERE fk_professor_id_professor = $1 AND fk_turma_id_turma = $2', [professorId, turmaId]);
        if(professorcheck.rows.length > 0){
            return res.status(400).json({erro: 'Professor já leciona essa turma.'})
        }

        const resultado = await pool.query('INSERT INTO professor_turma_leciona (fk_professor_id_professor, fk_turma_id_turma, disciplina) VALUES ($1, $2, $3) RETURNING disciplina', [professorId, turmaId, disciplina]);

        res.json({mensagem: `Professor designado lecionando ${resultado.rows[0].disciplina}!`})

    }catch(error){
        console.error(error);
        res.json({erro: `Erro interno do servidor: ${error}`})
    }

})
app.post('/enviar-tarefa', upload.single('arquivo'), async (req, res) => {

    try{
        const {titulo, descricao, turmaId, professorId} = req.body;
        const arquivo = req.file;
        
        const disciplina = await pool.query('SELECT disciplina FROM professor_turma_leciona WHERE fk_professor_id_professor = $1 AND fk_turma_id_turma = $2', [professorId, turmaId])

        let nomearquivo = null;
        let caminhoarquivo = null;

        if (arquivo){
            nomearquivo = arquivo.originalname;
            caminhoarquivo = arquivo.path;
        }

        const resultado = await pool.query('INSERT INTO tarefa (titulo, fk_professor_id_professor, descricao, nome_arquivo, caminho_arquivo, disciplina) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_tarefa', [titulo, professorId, descricao, nomearquivo, caminhoarquivo, disciplina.rows[0].disciplina]);

        await pool.query('INSERT INTO tarefa_turma_destino (fk_tarefa_id_tarefa, fk_turma_id_turma) VALUES ($1, $2)', [resultado.rows[0].id_tarefa, turmaId]);

        res.status(201).json({id: resultado.rows[0].id_tarefa});
    }catch(error){
        console.error(error);
        res.status(500).json({erro: 'Erro ao enviar.'})
    }

})

app.post('/concluir-tarefa', async (req, res) => {
    try{
        const { alunoId, tarefaId } = req.body;

        await pool.query('INSERT INTO aluno_tarefa_concluida (fk_aluno_id_aluno, fk_tarefa_id_tarefa) VALUES ($1, $2)', [alunoId, tarefaId]);

        res.json({ mensagem: 'Tarefa concluída!' });
    }catch(error){
        console.error(error);
        res.status(500).json({ erro: 'Erro ao concluir tarefa.' });
    }
});

app.post('/api/professor', async (req, res) => 
{
    const { id } = req.body;

    try {
        const resultado = await pool.query('SELECT * FROM professor WHERE id_professor = $1', [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: "Professor não encontrado." });
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error("Erro ao buscar dados do professor:", error);
        return res.status(500).json({ erro: "Erro ao buscar dados do professor." });
    }
})

app.post('/api/aluno', async (req, res) => {
    const { id } = req.body;

    try {
        const resultado = await pool.query('SELECT * FROM aluno WHERE id_aluno = $1', [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: "Aluno não encontrado." });
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error("Erro ao buscar dados do aluno:", error);
        return res.status(500).json({ erro: "Erro ao buscar dados do aluno." });
    }
});

app.post('/api/colegas', async (req, res) => {
    const {id} = req.body;

    try {
        const turmaresultado = await pool.query('SELECT fk_turma_id_turma FROM aluno WHERE id_aluno = $1', [id]);
        const turma = await pool.query('SELECT nome FROM turma WHERE id_turma = $1', [turmaresultado.rows[0].fk_turma_id_turma]);

        if(turmaresultado.rows.length === 0){
            return res.status(404).json({erro: 'aluno não encontrado.'});
        }

        const idturma = turmaresultado.rows[0].fk_turma_id_turma;

        const alunosresultado = await pool.query('SELECT nome, id_aluno FROM aluno WHERE fk_turma_id_turma = $1 ORDER BY nome', [idturma]);

        res.json({colegas: alunosresultado.rows, turma: turma.rows[0].nome});
    }catch (error){
        console.error('Erro ao buscar colegas de turma');
        res.status(500).json({erro: 'Erro interno do servidor'});
    }
})

app.post('/api/escola', async (req, res) => 
{
    const { id } = req.body;

    try {
        const resultado = await pool.query('SELECT * FROM escola WHERE id_escola = $1', [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ erro: "Escola não encontrado." });
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error("Erro ao buscar dados do escola:", error);
        return res.status(500).json({ erro: "Erro ao buscar dados do escola." });
    }
})

app.post('/api/turmas-professor', async (req, res) =>
{
    try{
        const { id } = req.body;

        const turmaId = await pool.query('SELECT fk_turma_id_turma FROM professor_turma_leciona WHERE fk_professor_id_professor = $1', [id]);

        if (turmaId.rows.length === 0){
            return res.status(404).json({erro: 'Você não leciona nanhuma turma ainda'});
        }

        const idsTurmas = turmaId.rows.map(turma => turma.fk_turma_id_turma);

        const turmas = await pool.query('SELECT * FROM turma WHERE id_turma = ANY($1)', [idsTurmas]);

        res.json(turmas.rows);

    }catch(error){
        console.error(error);
        return res.status(500).json({erro: 'Erro ao buscar turmas'});
    }
})

app.post('/api/tarefas-aluno', async (req, res) => {

    try{
        const { alunoId } = req.body;
        const turmaId = await pool.query('SELECT fk_turma_id_turma FROM aluno WHERE id_aluno = $1', [alunoId])

        const buscartarefas = await pool.query('SELECT * FROM tarefa_turma_destino WHERE fk_turma_id_turma = $1', [turmaId.rows[0].fk_turma_id_turma])

        if (buscartarefas.rows.length === 0){
            return res.status(404).json({erro: 'Tarefas não encontradas'});
        }

        const idtarefas = buscartarefas.rows.map(tarefa => tarefa.fk_tarefa_id_tarefa)

        const tarefas = await pool.query('SELECT * FROM tarefa WHERE id_tarefa = ANY($1) AND id_tarefa NOT IN (SELECT fk_tarefa_id_tarefa FROM aluno_tarefa_concluida WHERE fk_aluno_id_aluno = $2)', [idtarefas, alunoId])

        res.json(tarefas.rows);
    }catch(error){
        console.error(error);
        res.status(500).json({erro: 'Erro ao buscar tarefas'});
    }

})

app.post('/api/tarefas-concluidas', async (req, res) => {
    try{
        const { alunoId } = req.body;

        const tarefasConcluidas = await pool.query('SELECT fk_tarefa_id_tarefa FROM aluno_tarefa_concluida WHERE fk_aluno_id_aluno = $1', [alunoId]);

        if(tarefasConcluidas.rows.length === 0){
            return res.status(404).json({ erro: 'Nenhuma tarefa concluída.' });
        }

        const idtarefas = tarefasConcluidas.rows.map(tarefa => tarefa.fk_tarefa_id_tarefa);

        const tarefas = await pool.query('SELECT * FROM tarefa WHERE id_tarefa = ANY($1)', [idtarefas]);

        res.json(tarefas.rows);
    }catch(error){
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar tarefas concluídas.' });
    }
});

app.post('/api/turmas-escola', async (req, res) => {

    try{
        const { escolaId } = req.body;

        const turmas = await pool.query('SELECT id_turma, nome FROM turma WHERE fk_escola_id_escola = $1 ORDER BY nome', [escolaId]);

        res.json(turmas.rows);
    }catch(error){
        console.log(error);
    }

})

app.post('/api/tarefas-enviadas', async (req, res) => {

    try{
        const { professorId } = req.body;

        const tarefascheck = await pool.query('SELECT * FROM tarefa WHERE fk_professor_id_professor = $1', [professorId]);

        const tarefas = tarefascheck.rows.map(tarefa => tarefa.id_tarefa);

        const turmascheck = await pool.query('SELECT * FROM tarefa_turma_destino WHERE fk_tarefa_id_tarefa = ANY($1)', [tarefas])

        const turmascheck2 = turmascheck.rows.map(turmas => turmas.fk_turma_id_turma);

        const turmas = await pool.query('SELECT * FROM turma WHERE id_turma = ANY($1)', [turmascheck2]);

        res.json({tarefas: tarefascheck.rows, turmas: turmas.rows, destino: turmascheck.rows})

    }catch(error){
        console.log(error);
    };
    

})

app.post('/api/materias-aluno', async (req, res) => {

    try{

        const { alunoId } = req.body;

        const turma = await pool.query('SELECT * FROM aluno WHERE id_aluno = $1', [alunoId]);

        const disciplina = await pool.query('SELECT disciplina FROM professor_turma_leciona WHERE fk_turma_id_turma = $1', [turma.rows[0].fk_turma_id_turma]);

        if(disciplina.rows.length === 0){
            return res.status(404).json({erro: 'Você ainda não tem nenhuma matéria.'})
        }

        res.json(disciplina.rows);
    }catch(error){
        console.log(error);
    }

})


