const lista = document.getElementById('listaFilmes');
const usuarioId = localStorage.getItem('usuarioId');
let isAdmin = false;
let filmesTodos = [];

// Executa após carregar tudo
window.onload = () => {
  isAdmin = localStorage.getItem('isAdmin') === 'true';

  // Exibe área de admin se for admin
  if (isAdmin) {
    const controles = document.getElementById('adminControles');
    if (controles) controles.style.display = 'block';
  }

  carregarFilmes();
};

// Adicionar filme (apenas admin)
const form = document.getElementById('formFilme');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      titulo: form.titulo.value,
      descricao: form.descricao.value,
      imagem_url: form.imagem_url.value,
      genero: form.genero.value,
      classificacao: form.classificacao.value,
      streaming: form.streaming.value,
      usuarioId: parseInt(usuarioId)
    };

    try {
      const res = await fetch('/api/filmes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      alert(result.mensagem || result.erro || 'Erro desconhecido');
      if (res.ok) {
        form.reset();
        form.style.display = 'none';
        carregarFilmes();
      }
    } catch (error) {
      console.error('Erro ao salvar filme:', error);
      alert('Erro ao salvar o filme');
    }
  });
}

// Carregar filmes
async function carregarFilmes() {
  try {
    const res = await fetch('/api/filmes');
    const filmes = await res.json();

    filmesTodos = filmes;
    renderizarFilmes(filmesTodos);
  } catch (error) {
    console.error('Erro ao carregar filmes:', error);
    lista.innerHTML = '<p>Erro ao carregar filmes.</p>';
  }
}

// Exibir filmes
function renderizarFilmes(listaFiltrada) {
  lista.innerHTML = '';

  if (listaFiltrada.length === 0) {
    lista.innerHTML = '<p>Nenhum filme encontrado.</p>';
    return;
  }

  listaFiltrada.forEach(filme => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${filme.titulo}</h3>
      <img src="${filme.imagem_url}" width="200"><br>
      <p>${filme.descricao}</p>
      <p><strong>Gênero:</strong> ${filme.genero || 'Não informado'}</p>
      <p><strong>Classificação:</strong> ${filme.classificacao || 'N/A'}</p>
      <p><strong>Onde assistir:</strong> ${filme.streaming || 'N/A'}</p>
      ${isAdmin ? `<button onclick="deletarFilme(${filme.id})">❌ Remover</button>` : ''}
      <hr>
    `;
    lista.appendChild(div);
  });
}

// Deletar filme (apenas admin)
async function deletarFilme(id) {
  try {
    const res = await fetch(`/api/filmes/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: parseInt(usuarioId) })
    });

    const result = await res.json();
    alert(result.mensagem || result.erro);
    carregarFilmes();
  } catch (error) {
    console.error('Erro ao deletar filme:', error);
    alert('Erro ao deletar o filme');
  }
}

// Filtro por título
function filtrarFilmes() {
  const termo = document.getElementById('busca').value.toLowerCase();
  const filtrados = filmesTodos.filter(filme =>
    filme.titulo.toLowerCase().includes(termo)
  );
  renderizarFilmes(filtrados);
}
