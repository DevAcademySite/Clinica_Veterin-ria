// ===================================================
// cadastro.js: salva cadastro básico do cliente e dados
// essenciais para compras e agendamentos no pet shop,
// e leva para a página inicial.
// ===================================================

const formCadastro = document.getElementById("formCadastro");
const erroCadastro = document.getElementById("erroCadastro");

formCadastro.addEventListener("submit", (evento) => {
  evento.preventDefault();
  erroCadastro.textContent = "";

  const nome = document.getElementById("cadNome").value.trim();
  const email = document.getElementById("cadEmail").value.trim().toLowerCase();
  const senha = document.getElementById("cadSenha").value;
  const nascimento = document.getElementById("cadNascimento").value;
  const telefone = document.getElementById("cadTelefone").value.trim();
  const cep = document.getElementById("cadCep").value.trim();
  const endereco = document.getElementById("cadEndereco").value.trim();
  const petNome = document.getElementById("cadPetNome").value.trim();
  const petPorte = document.getElementById("cadPetPorte").value;

  if (!nome || nome.length < 2) {
    erroCadastro.textContent = "Informe seu nome.";
    return;
  }

  if (!email || !email.includes("@")) {
    erroCadastro.textContent = "Informe um e-mail válido.";
    return;
  }

  if (!senha || senha.length < 6) {
    erroCadastro.textContent = "Crie uma senha com pelo menos 6 caracteres.";
    return;
  }

  if (!nascimento) {
    erroCadastro.textContent = "Informe sua data de nascimento.";
    return;
  }

  if (!telefone) {
    erroCadastro.textContent = "Informe um telefone para contato.";
    return;
  }

  if (!cep || !endereco) {
    erroCadastro.textContent = "Informe CEP e endereço para compras e entregas.";
    return;
  }

  const conta = {
    nome,
    email,
    senha,
    nascimento,
    telefone,
    cep,
    endereco,
    petNome,
    petPorte
  };

  try {
    localStorage.setItem("pa_conta", JSON.stringify(conta));
    localStorage.setItem("pa_sessao", JSON.stringify({
      nome,
      email,
      logado: true
    }));
  } catch (e) {
    /* sem storage */
  }

  mostrarAviso("Cadastro concluído! Indo para a página inicial...");
  setTimeout(() => {
    window.location.href = "pagina-inicial.html";
  }, 400);
});