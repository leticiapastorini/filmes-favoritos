document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const form = e.target;
    const data = {
      email: form.email.value,
      senha: form.senha.value,
    };
  
    try {
      const res = await fetch('/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      const result = await res.json();
      console.log('[Login]', result);
  
      if (res.ok) {
        // ✅ Salvar no localStorage
        localStorage.setItem('usuarioId', result.id);
        localStorage.setItem('usuarioNome', result.nome);
        localStorage.setItem('isAdmin', result.is_admin); // ← usado para exibir botão no catálogo
  
        alert(result.mensagem || 'Login realizado!');
        window.location.href = '/catalogo'; // redireciona após login
      } else {
        document.getElementById('mensagem').innerText = result.erro || 'Erro no login';
        
        setTimeout(() => {
            document.getElementById('mensagem').innerText = '';
          }, 4000);
    }
  
    } catch (err) {
      console.error('Erro na requisição de login:', err);
      alert('Erro de conexão com o servidor');
    }
  });
  