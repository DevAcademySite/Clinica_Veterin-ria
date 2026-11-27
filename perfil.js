// ===================================================
// perfil.js: tela simples com botão de Entrar,
// acesso ao Cadastre-se e opção de sair da sessão.
// ===================================================

const statusContaEl = document.getElementById("statusConta");
const btnSairConta = document.getElementById("btnSairConta");

function lerSessao() {
  try {
    return JSON.parse(localStorage.getItem("pa_sessao")) || null;
  } catch (e) {
    return null;
  }
}

function atualizarTelaPerfil() {
  const sessao = lerSessao();
  if (sessao && sessao.logado) {
    statusContaEl.textContent = `Conectado como ${sessao.nome || sessao.email}.`;
    btnSairConta.hidden = false;
  } else {
    statusContaEl.textContent = "Você ainda não entrou em uma conta.";
    btnSairConta.hidden = true;
  }
}

btnSairConta.addEventListener("click", () => {
  try {
    localStorage.removeItem("pa_sessao");
  } catch (e) {
    /* sem storage */
  }
  atualizarTelaPerfil();
  mostrarAviso("Você saiu da conta.");
});

atualizarTelaPerfil();