// server.js
const express = require('express');
const app = express();
const usuariosRoutes = require('./routes/usuarios');
const path = require('path');
const filmesRoutes = require('./routes/filmes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/filmes', filmesRoutes); // se já adicionou

app.use('/api/usuarios', usuariosRoutes);

app.get('/cadastro', (_, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cadastro.html'));
});

app.get('/login', (_, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/catalogo', (_, res) => {
    res.sendFile(path.join(__dirname, 'views', 'catalogo.html'));
  });
  
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
