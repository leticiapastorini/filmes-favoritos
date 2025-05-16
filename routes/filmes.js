const express = require('express');
const router = express.Router();
const pool = require('../db');

// 🔒 Verifica se o usuário é admin no banco
async function verificarAdmin(usuarioId) {
  const result = await pool.query('SELECT is_admin FROM usuarios WHERE id = $1', [usuarioId]);
  return result.rows[0]?.is_admin === true;
}

// Cadastrar filme
router.post('/', async (req, res) => {
  const { titulo, descricao, imagem_url, genero, classificacao, streaming, usuarioId } = req.body;

  const isAdmin = await verificarAdmin(usuarioId);
  if (!isAdmin) {
    return res.status(403).json({ erro: 'Apenas administradores podem adicionar filmes' });
  }

  try {
    await pool.query(
      'INSERT INTO filmes (titulo, descricao, imagem_url, genero, classificacao, streaming) VALUES ($1, $2, $3, $4, $5, $6)',
      [titulo, descricao, imagem_url, genero, classificacao, streaming]
    );
    res.status(201).json({ mensagem: 'Filme cadastrado!' });
  } catch (err) {
    console.error('Erro ao salvar filme:', err);
    res.status(500).json({ erro: 'Erro ao salvar o filme' });
  }
});

// Listar filmes
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM filmes ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar filmes:', err);
    res.status(500).json({ erro: 'Erro ao buscar filmes' });
  }
});

// Deletar filme
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { usuarioId } = req.body;

  const isAdmin = await verificarAdmin(usuarioId);
  if (!isAdmin) {
    return res.status(403).json({ erro: 'Apenas administradores podem remover filmes' });
  }

  try {
    await pool.query('DELETE FROM filmes WHERE id = $1', [id]);
    res.json({ mensagem: 'Filme deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar filme:', err);
    res.status(500).json({ erro: 'Erro ao deletar o filme' });
  }
});

module.exports = router;
