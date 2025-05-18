const lista = document.getElementById('listaFilmes');
const usuarioId = localStorage.getItem('usuarioId');
let isAdmin = false;
let filmesTodos = [];
let editandoFilmeId = null;

window.onload = () => {
  isAdmin = localStorage.getItem('isAdmin') === 'true';
  const nome = localStorage.getItem('usuarioNome');
  if (nome) {
    const perfilNome = document.getElementById('perfilNome');
    if (perfilNome) perfilNome.innerText = nome;
  }
  if (isAdmin) {
    const btnAdd = document.getElementById('btnAdicionarFilme');
    if (btnAdd) btnAdd.style.display = 'block';
  }
  carregarFilmes();
};

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
      const url = editandoFilmeId ? `/api/filmes/${editandoFilmeId}` : '/api/filmes';
      const method = editandoFilmeId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      alert(result.mensagem || result.erro || 'Erro desconhecido');
      if (res.ok) {
        form.reset();
        fecharForm();
        editandoFilmeId = null;
        carregarFilmes();
      }
    } catch (error) {
      console.error('Erro ao salvar filme:', error);
      alert('Erro ao salvar o filme');
    }
  });
}

async function carregarFilmes() {
  try {
    const res = await fetch('/api/filmes');
    const filmes = await res.json();
    filmesTodos = filmes;
    renderizarFilmes(filmesTodos);
    gerarBotoesGenero(filmesTodos);
  } catch (error) {
    console.error('Erro ao carregar filmes:', error);
    lista.innerHTML = '<p>Erro ao carregar filmes.</p>';
  }
}

function renderizarFilmes(listaFiltrada) {
  lista.innerHTML = '';
  const assistidos = JSON.parse(localStorage.getItem('assistidos')) || [];

  if (listaFiltrada.length === 0) {
    lista.innerHTML = '<p>Nenhum filme encontrado.</p>';
    return;
  }

  listaFiltrada.forEach(filme => {
    const div = document.createElement('div');
    div.classList.add('card-filme');
    if (assistidos.includes(filme.id)) div.classList.add('assistido');
    div.innerHTML = `
      <div class="imagem-container">
        <img src="${filme.imagem_url}" alt="${filme.titulo}">
        ${assistidos.includes(filme.id) ? '<div class="barra-progresso"></div>' : ''}
      </div>
      ${isAdmin ? `<button onclick="mostrarOpcoes(${filme.id}, event)">❌</button>` : ''}
    `;
    div.addEventListener('click', () => exibirDetalhes(filme));
    lista.appendChild(div);
  });
}

function exibirDetalhes(filme) {
  let assistidos = JSON.parse(localStorage.getItem('assistidos')) || [];
  if (!assistidos.includes(filme.id)) {
    assistidos.push(filme.id);
    localStorage.setItem('assistidos', JSON.stringify(assistidos));
  }

  const backdrop = document.createElement('div');
  backdrop.id = 'backdrop';
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <button class="fechar" title="Fechar">&times;</button>
    <img src="${filme.imagem_url}" alt="${filme.titulo}">
    <h2>${filme.titulo}</h2>
    <p><strong>Descrição:</strong> ${filme.descricao}</p>
    <p><strong>Gênero:</strong> ${filme.genero}</p>
    <p><strong>Classificação:</strong> ${filme.classificacao}</p>
    <p><strong>Onde assistir:</strong> ${filme.streaming}</p>
  `;
  modal.querySelector('.fechar').onclick = () => fecharModal();
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  function fecharModal() {
    if (document.body.contains(backdrop)) {
      document.body.removeChild(backdrop);
      document.removeEventListener('keydown', fecharComEsc);
      backdrop.removeEventListener('click', fecharFora);
      carregarFilmes(); // Re-renderiza após fechar
    }
  }

  function fecharComEsc(e) {
    if (e.key === 'Escape') fecharModal();
  }

  function fecharFora(e) {
    if (e.target === backdrop) fecharModal();
  }

  document.addEventListener('keydown', fecharComEsc);
  backdrop.addEventListener('click', fecharFora);
}

function abrirForm() {
  const backdrop = document.getElementById('formBackdrop');
  backdrop.style.display = 'flex';
  backdrop.onclick = (e) => {
    if (e.target === backdrop) fecharForm();
  };
  document.addEventListener('keydown', escFechaForm);
}

function fecharForm() {
  const backdrop = document.getElementById('formBackdrop');
  backdrop.style.display = 'none';
  backdrop.onclick = null;
  document.removeEventListener('keydown', escFechaForm);
}

function escFechaForm(e) {
  if (e.key === 'Escape') fecharForm();
}

function preencherFormulario(filme) {
  const form = document.getElementById('formFilme');
  form.titulo.value = filme.titulo;
  form.descricao.value = filme.descricao;
  form.imagem_url.value = filme.imagem_url;
  form.genero.value = filme.genero;
  form.classificacao.value = filme.classificacao;
  form.streaming.value = filme.streaming;
  editandoFilmeId = filme.id;
}

function mostrarOpcoes(id, event) {
  if (event) event.stopPropagation();
  const filme = filmesTodos.find(f => f.id === id);
  if (!filme) return;

  const antigo = document.getElementById('backdrop-opcoes');
  if (antigo) document.body.removeChild(antigo);

  const backdrop = document.createElement('div');
  backdrop.id = 'backdrop-opcoes';

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <button class="fechar-modal" onclick="document.body.removeChild(document.getElementById('backdrop-opcoes'))">×</button>
    <h2>O que deseja fazer?</h2>
    <p><strong>${filme.titulo}</strong></p>
    <div style="display: flex; gap: 10px; margin-top: 20px;">
      <button class="btn-confirmar" id="editarBtn">✏️ Editar</button>
      <button class="btn-confirmar" id="deletarBtn">🗑️ Deletar</button>
    </div>
  `;

  modal.querySelector('#editarBtn').onclick = () => {
    document.body.removeChild(backdrop);
    preencherFormulario(filme);
    abrirForm();
  };

  modal.querySelector('#deletarBtn').onclick = () => {
    document.body.removeChild(backdrop);
    deletarFilme(filme.id);
  };

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
  document.addEventListener('keydown', function escListener(e) {
    if (e.key === 'Escape') {
      document.body.removeChild(backdrop);
      document.removeEventListener('keydown', escListener);
    }
  });
}

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

function gerarBotoesGenero(filmes) {
  const container = document.getElementById('filtrosGenero');
  if (!container) return;

  const generosUnicos = [...new Set(filmes.map(f => f.genero).filter(Boolean))];
  container.innerHTML = '';

  const botaoTodos = document.createElement('button');
  botaoTodos.innerText = 'Todos';
  botaoTodos.onclick = () => renderizarFilmes(filmesTodos);
  container.appendChild(botaoTodos);

  generosUnicos.forEach(genero => {
    const btn = document.createElement('button');
    btn.innerText = genero;
    btn.onclick = () => {
      const filtrados = filmesTodos.filter(f => f.genero === genero);
      renderizarFilmes(filtrados);
    };
    container.appendChild(btn);
  });
}

function togglePerfilMenu() {
  const menu = document.getElementById('perfilMenu');
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
}
