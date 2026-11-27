// ===================================================
// login.js: login simples com e-mail e senha
// e redirecionamento para a página inicial do pet shop.
// ===================================================

const formLogin = document.getElementById("formLogin");
const erroLogin = document.getElementById("erroLogin");

function lerContaSalva() {
  try {
    return JSON.parse(localStorage.getItem("pa_conta")) || null;
  } catch (e) {
    return null;
  }
}

function gravarSessaoAtiva(sessao) {
  try {
    localStorage.setItem("pa_sessao", JSON.stringify(sessao));
  } catch (e) {
    /* sem storage */
  }
}

formLogin.addEventListener("submit", (evento) => {
  evento.preventDefault();
  erroLogin.textContent = "";

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const senha = document.getElementById("loginSenha").value;

  if (!email || !email.includes("@")) {
    erroLogin.textContent = "Informe um e-mail válido.";
    return;
  }

  if (!senha || senha.length < 6) {
    erroLogin.textContent = "Informe sua senha (mínimo de 6 caracteres).";
    return;
  }

  const contaSalva = lerContaSalva();

  if (contaSalva && contaSalva.email === email && contaSalva.senha === senha) {
    gravarSessaoAtiva({
      nome: contaSalva.nome,
      email: contaSalva.email,
      logado: true
    });
    mostrarAviso("Login realizado com sucesso!");
    setTimeout(() => {
      window.location.href = "pagina-inicial.html";
    }, 350);
    return;
  }

  // Permite acesso demonstrativo mesmo sem conta cadastrada prévia
  gravarSessaoAtiva({
    nome: contaSalva && contaSalva.email === email ? contaSalva.nome : email.split("@")[0],
    email,
    logado: true
  });
  mostrarAviso("Entrando no PetAmigo Petshop...");
  setTimeout(() => {
    window.location.href = "pagina-inicial.html";
  }, 350);
});