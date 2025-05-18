
# 🎬 Catálogo de Filmes

Um sistema completo de gerenciamento de filmes com cadastro, listagem, filtro por gênero, visualização de detalhes e controle administrativo, desenvolvido com **Node.js**, **Express**, **PostgreSQL**, **HTML/CSS** e **JavaScript**.

---

## 🚀 Tecnologias Utilizadas

- **Frontend (JavaScript):**
  - HTML5
  - CSS3
  - JavaScript Vanilla (`public/js/catalogo.js`, `login.js`, etc.)

- **Backend (Node.js):**
  - Node.js (`server.js`)
  - Express.js (`api/filmes.js`, rotas REST)
  - PostgreSQL via `pg` (`db.js`)

- **Banco de Dados**
  - PostgreSQL (estrutura de tabelas `usuarios` e `filmes`)

---

## 📦 Funcionalidades

### 🎥 Público geral
- Visualização de cards com imagem e detalhes do filme
- Filtro por gênero
- Barra de busca por título
- Marcação de filmes "assistidos" com barra vermelha
- Tela de login com "lembre-se de mim"
- Cadastro de usuário

### 🔐 Área Administrativa
- Cadastro de novos filmes
- Edição e exclusão de filmes
- Acesso restrito apenas para usuários com `is_admin = true`

---

## 🧠 Lógica de Acesso

- Ao logar, o sistema salva no `localStorage`:
  - `usuarioId`
  - `usuarioNome`
  - `isAdmin`
- Usuários **admin** veem o botão "Adicionar Filme" no menu.
- Os filmes assistidos são marcados localmente no `localStorage`.

---

## 🗃 Estrutura de Pastas

```
project/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── catalogo.js
│   ├── imagens/
│   │   └── perfil-default.png
│   ├── catalogo.html
│   ├── login.html
│   └── cadastro.html
├── api/
│   └── filmes.js
├── db.js
├── server.js
└── package.json
```

---

## 🛠 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/catalogo-filmes.git
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o banco PostgreSQL:

- Crie o banco e tabelas com o SQL de estrutura
- Atualize as credenciais no `db.js`

4. Inicie o servidor:

```bash
node server.js
```

5. Acesse no navegador:

```
http://localhost:3000/login
```

---

## ✅ Requisitos do Banco (exemplo)

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT,
  email TEXT UNIQUE,
  senha TEXT,
  is_admin BOOLEAN DEFAULT false
);

CREATE TABLE filmes (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  genero TEXT,
  classificacao TEXT,
  streaming TEXT
);
```

---

## 📌 Observações

- O botão ❌ em cada filme aparece apenas para administradores.
- A barra vermelha ao final do card representa filmes marcados como assistidos.
- A tela de login armazena o usuário com opção de "Lembre-se de mim".

---

## 👨‍💻 Desenvolvido para projeto acadêmico
