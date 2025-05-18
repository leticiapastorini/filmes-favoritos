document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formLogin');
    const lembrar = document.getElementById('lembrar');
    const mensagem = document.getElementById('mensagem');
  
    // ▶️ Se já estiver logado, redireciona automaticamente
    const usuarioLogado = localStorage.getItem('usuarioId');
    if (usuarioLogado) {
      window.location.href = '/catalogo';
      return;
    }
  
    // 📨 Preenche email salvo se "lembrar" estiver ativado
    const emailSalvo = localStorage.getItem('emailLembrado');
    if (emailSalvo) {
      form.email.value = emailSalvo;
      lembrar.checked = true;
    }
  
    // ✅ Ao enviar login
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const data = {
        email: form.email.value,
        senha: form.senha.value
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
          // Armazena info do usuário
          localStorage.setItem('usuarioId', result.id);
          localStorage.setItem('usuarioNome', result.nome);
          localStorage.setItem('isAdmin', result.is_admin);
  
          // Lembra email se marcado
          if (lembrar.checked) {
            localStorage.setItem('emailLembrado', data.email);
          } else {
            localStorage.removeItem('emailLembrado');
          }
  
          alert(result.mensagem || 'Login realizado!');
          window.location.href = '/catalogo';
        } else {
          mensagem.innerText = result.erro || 'Erro no login';
          setTimeout(() => (mensagem.innerText = ''), 4000);
        }
  
      } catch (err) {
        console.error('Erro na requisição de login:', err);
        alert('Erro de conexão com o servidor');
      }
    });
  });
  