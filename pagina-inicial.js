// ===== pagina-inicial.js: produtos, carrinho e favoritos =====
// (menu, aviso e chat já vêm do comum.js)

const produtos = window.PETAMIGO_PRODUTOS || [
  { id: 1, nome: "Ração Premium Cães Adultos 10kg", preco: 189.90, emoji: "🐕" },
  { id: 2, nome: "Ração Gatos Castrados 3kg",       preco: 79.90,  emoji: "🐈" },
  { id: 3, nome: "Bolinha de Borracha",             preco: 14.90,  emoji: "🎾" },
  { id: 4, nome: "Shampoo Neutro 500ml",            preco: 29.90,  emoji: "🧼" },
  { id: 5, nome: "Petisco Ossinho (pacote)",        preco: 19.90,  emoji: "🦴" },
  { id: 6, nome: "Caminha Macia Média",             preco: 119.90, emoji: "🛏️" }
];

const grade = document.getElementById("grade");

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function desenharProdutos() {
  if (!grade) return;
  const favoritos = lerLista("pa_favoritos");
  grade.innerHTML = produtos.map(p => `
    <article class="card">
      <button class="card__fav" data-acao="favoritar" data-id="${p.id}" aria-label="Favoritar ${p.nome}">${favoritos.includes(p.id) ? "♥" : "♡"}</button>
      <div class="card__foto">${p.foto ? `<img src="${p.foto}" alt="${p.nome}">` : p.emoji}</div>
      <div class="card__info">
        <h3 class="card__nome">${p.nome}</h3>
        <div class="card__linha">
          <p class="card__preco">${formatarPreco(p.preco)}</p>
          <button class="btn-mais" data-acao="comprar" data-id="${p.id}" aria-label="Adicionar ${p.nome} ao carrinho"></button>
        </div>
      </div>
    </article>`).join("");
}

if (grade) {
  // Um ouvinte na grade cuida de todos os botões (+ e coração)
  grade.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button");
    if (!botao) return;
    const id = Number(botao.dataset.id);

    if (botao.dataset.acao === "comprar") {
      const carrinho = lerLista("pa_carrinho");
      carrinho.push(id);
      gravarLista("pa_carrinho", carrinho);
      atualizarContadores();
      mostrarAviso("Produto adicionado ao carrinho");
    }

    if (botao.dataset.acao === "favoritar") {
      let favoritos = lerLista("pa_favoritos");
      if (favoritos.includes(id)) {
        favoritos = favoritos.filter(f => f !== id);
        botao.textContent = "♡";
        mostrarAviso("Removido dos favoritos");
      } else {
        favoritos.push(id);
        botao.textContent = "♥";
        mostrarAviso("Adicionado aos favoritos");
      }
      gravarLista("pa_favoritos", favoritos);
      atualizarContadores();
    }
  });
}

desenharProdutos();