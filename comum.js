// ===================================================
// comum.js: tudo que se repete em TODAS as páginas.
// Cabeçalho, menu, rodapé, aviso e chatbot são montados aqui,
// então todas as telas ficam iguais (heurística: consistência e padrões).
// ===================================================

// ---- ENDEREÇO DO SERVIDOR (Flask): se a página já veio dele, usa o mesmo; senão, usa o endereço padrão ----
const API = location.port === "5000" ? "" : "http://127.0.0.1:5000";

// ---- guardar dados no navegador (carrinho e favoritos continuam ao trocar de página) ----
function lerLista(chave) {
  try { return JSON.parse(localStorage.getItem(chave)) || []; } catch (e) { return []; }
}
function gravarLista(chave, lista) {
  try { localStorage.setItem(chave, JSON.stringify(lista)); } catch (e) { /* sem storage: segue sem guardar */ }
}

// ---- monta o layout fixo da página ----
function montarLayout() {
  // cabeçalho + menu lateral no começo do <body>
  document.body.insertAdjacentHTML("afterbegin", `
    <header class="topo">
      <button class="icone" id="btnMenu" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu">☰</button>
      <a class="logo" href="pagina-inicial.html">🐾 PetAmigo</a>
      <div class="topo__acoes">
        <a class="icone" href="favoritos.html" aria-label="Favoritos" style="text-decoration:none;">♡ <span class="badge" id="contFavoritos">0</span></a>
        <a class="icone" href="carrinho.html" aria-label="Carrinho" style="text-decoration:none;">🛒 <span class="badge" id="contCarrinho">0</span></a>
        <a class="icone" href="perfil.html" aria-label="Meu perfil" style="text-decoration:none;">👤</a>
      </div>
    </header>
    <div class="fundo-escuro" id="fundoEscuro"></div>
    <nav class="menu" id="menu" aria-label="Menu principal">
      <div class="menu__topo"><strong>Menu</strong><button class="icone" id="btnFechar" aria-label="Fechar menu">✕</button></div>
      <a href="pagina-inicial.html">🏠 Início</a>
      <a href="pagina-inicial.html#produtos">🛍️ Produtos</a>
      <a href="favoritos.html">♡ Favoritos</a>
      <a href="carrinho.html">🛒 Carrinho</a>
      <a href="perfil.html">👤 Meu perfil</a>
      <a href="agendamentos.html">📅 Agendamentos</a>
      <a href="formulario.html?servico=banho-tosa">✂️ Banho e tosa</a>
      <a href="formulario.html?servico=veterinario">🩺 Veterinário</a>
      <a href="formulario.html?servico=hotel">🏨 Hotelzinho</a>
      <a href="mapa.html">🗺️ Pet shops perto de mim</a>
      <a href="#rodape">📍 Contato</a>
    </nav>`);

  // rodapé + aviso + chat no fim do <body>
  document.body.insertAdjacentHTML("beforeend", `
    <footer class="rodape" id="rodape"><p>🐾 PetAmigo Petshop, seg a sex 8h às 19h e sáb 8h às 16h</p></footer>
    <div class="aviso" id="aviso" role="status" aria-live="polite"></div>
    <button class="chat-botao" id="chatBotao" aria-label="Abrir chat com a Bia">💬</button>
    <section class="chat" id="chat" hidden aria-label="Chat de atendimento do PetAmigo">
      <header class="chat__topo">
        <span aria-hidden="true">🐾</span>
        <div><h2 class="chat__titulo">PetAmigo Petshop</h2><p class="chat__status">Bia, assistente virtual, online</p></div>
        <button class="icone chat__fechar" id="chatFechar" aria-label="Fechar chat">✕</button>
      </header>
      <div class="mensagens" id="mensagens" aria-live="polite"></div>
      <div class="atalhos" id="atalhos">
        <button type="button">Banho e tosa</button><button type="button">Horários</button>
        <button type="button">Vacinas</button><button type="button">Ração</button>
      </div>
      <form class="formulario-chat" id="formularioChat">
        <input type="text" id="campo" placeholder="Digite sua mensagem..." autocomplete="off" aria-label="Mensagem">
        <button type="submit">Enviar</button>
      </form>
    </section>`);
}
montarLayout();

// ---- AVISO: mensagem rápida que mostra o que o sistema fez (heurística: visibilidade do estado do sistema) ----
let temporizadorAviso;
function mostrarAviso(texto, tipo) {
  const aviso = document.getElementById("aviso");
  aviso.textContent = texto;
  aviso.className = "aviso " + (tipo === "erro" ? "aviso--erro " : "") + "visivel";
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => aviso.classList.remove("visivel"), 2500);
}

// ---- números do carrinho e dos favoritos no cabeçalho ----
function atualizarContadores() {
  document.getElementById("contCarrinho").textContent = lerLista("pa_carrinho").length;
  document.getElementById("contFavoritos").textContent = lerLista("pa_favoritos").length;
}
atualizarContadores();

// ---- MENU HAMBÚRGUER ----
const menu = document.getElementById("menu");
const fundoEscuro = document.getElementById("fundoEscuro");
const btnMenu = document.getElementById("btnMenu");
function abrirMenu() {
  menu.classList.add("aberto"); fundoEscuro.classList.add("aberto");
  btnMenu.setAttribute("aria-expanded", "true");
}
function fecharMenu() {
  menu.classList.remove("aberto"); fundoEscuro.classList.remove("aberto");
  btnMenu.setAttribute("aria-expanded", "false");
}
btnMenu.addEventListener("click", abrirMenu);
document.getElementById("btnFechar").addEventListener("click", fecharMenu);
fundoEscuro.addEventListener("click", fecharMenu);
menu.addEventListener("click", (e) => { if (e.target.tagName === "A") fecharMenu(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharMenu(); });

// ---- CHATBOT: a interface fica aqui; as respostas vêm do Flask ----
const chat = document.getElementById("chat");
const listaMensagens = document.getElementById("mensagens");
const campo = document.getElementById("campo");

function adicionarMensagem(texto, autor) {
  const bolha = document.createElement("div");
  bolha.className = "msg msg--" + autor;
  bolha.textContent = texto;
  listaMensagens.appendChild(bolha);
  listaMensagens.scrollTop = listaMensagens.scrollHeight;
  return bolha;
}

async function responder(pergunta) {
  const digitando = adicionarMensagem("", "bot");
  digitando.innerHTML = '<div class="digitando"><span></span><span></span><span></span></div>';
  let texto;
  try {
    const pedido = await fetch(API + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensagem: pergunta })
    });
    texto = (await pedido.json()).resposta;
  } catch (erro) {
    texto = "Não consegui falar com o servidor. Verifique se o Flask está rodando.";
  }
  await new Promise(resolve => setTimeout(resolve, 800));
  digitando.remove();
  adicionarMensagem(texto, "bot");
}

function enviar(texto) {
  const limpo = texto.trim();
  if (limpo === "") return;
  adicionarMensagem(limpo, "usuario");
  responder(limpo);
}

function alternarChat(abrir) {
  chat.hidden = !abrir;
  if (abrir) {
    if (listaMensagens.children.length === 0) {
      adicionarMensagem("Oi! Eu sou a Bia, assistente do PetAmigo Petshop. Como posso ajudar você e seu pet hoje?", "bot");
    }
    campo.focus();
  }
}
document.getElementById("chatBotao").addEventListener("click", () => alternarChat(chat.hidden));
document.getElementById("chatFechar").addEventListener("click", () => alternarChat(false));
document.getElementById("formularioChat").addEventListener("submit", (e) => {
  e.preventDefault();
  enviar(campo.value);
  campo.value = "";
  campo.focus();
});
document.getElementById("atalhos").addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") enviar(e.target.textContent);
});