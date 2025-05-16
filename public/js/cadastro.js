document.getElementById('formCadastro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      nome: form.nome.value,
      email: form.email.value,
      senha: form.senha.value,
    };
  
    const res = await fetch('/api/usuarios/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  
    const result = await res.json();
    alert(result.mensagem || result.erro);
    if (res.ok) window.location.href = '/login';
  });
  