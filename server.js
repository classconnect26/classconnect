const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

app.use(cors()); 
app.use(express.json());

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

app.get('/api/escola', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT id_escola, nome FROM escola ORDER BY nome');
        res.json(resultado.rows);
    } catch (error) {
        console.error("Erro ao buscar escolas:", error);
        res.status(500).json({ erro: "Erro ao buscar escolas." });
    }
})


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

        const resposta = await pool.query('INSERT INTO professor (nome, email, senha) VALUES ($1, $2, $3) RETURNING nome', [nome, email, senha]);
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

        return res.sendStatus(200);
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

        return res.status(200).json({ mensagem: "Login realizado com sucesso!", nome: professor.nome });
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        return res.status(500).json({ erro: "Erro ao realizar login." });
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
