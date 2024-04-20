const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql')
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Criando conexão com o banco de dados
const rdsconnect = mysql.createConnection({
  host: 'database-teste3.c088xfpm7nqh.us-east-1.rds.amazonaws.com',
  user: 'usuário',
  password: 'senha',
  database: 'MeuBancoDeDados'
});

rdsconnect.connect(err => {
  if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
  } else {
      console.log('Conexão bem-sucedida ao banco de dados');
  }
});

// Rota para lidar com o formulário
app.post('/caminho/do/script_backend', (req, res) => {
  const usuario = req.body.usuario;
  const senha = req.body.senha;

  // Exemplo de consulta ao banco de dados para validar a existência do usuario e senha
  const query = `SELECT * FROM Login WHERE usuario = ? AND senha = ?`;
  rdsconnect.query(query, [usuario, senha], (err, results) => {
      if (err) {
          console.error('Erro ao executar a consulta:', err);
          res.status(500).send('Erro interno do servidor');
        } else {
          if (results.length > 0) {
            // Dados encontrados, envie os dados do usuário como parte da resposta JSON
            const dadosUsuario = {
              usuario: results[0].usuario,
              idade: results[0].idade,
              altura: results[0].altura,
              peso: results[0].peso
            };
    
            res.json({ sucesso: true, mensagem: 'Login bem-sucedido', dadosUsuario });
          } else {
            // Dados não encontrados, envie uma resposta adequada
            res.json({ sucesso: false, mensagem: 'Usuário e senha não encontrados no banco de dados.' });
          }
        }
      });
    });

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});