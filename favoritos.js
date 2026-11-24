const gradeFavoritos = document.getElementById("gradeFavoritos");
const produtosFavoritos = window.PETAMIGO_PRODUTOS;

function renderizarFavoritos() {
  const favoritos = lerLista("pa_favoritos");
  const itens = produtosFavoritos.filter(produto => favoritos.includes(produto.id));

  if (itens.length === 0) {
    gradeFavoritos.innerHTML = '<div class="vazio-loja"><p>Você ainda não marcou nenhum produto como favorito.</p><a class="botao" href="pagina-inicial.html#produtos">Explorar produtos</a></div>';
    return;
  }

  gradeFavoritos.innerHTML = itens.map(produto => `
    <article class="card">
      <button class="card__fav" data-acao="desfavoritar" data-id="${produto.id}" aria-label="Remover ${produto.nome} dos favoritos">♥</button>
      <div class="card__foto" aria-hidden="true">${produto.emoji}</div>
      <div class="card__info">
        <h2 class="card__nome">${produto.nome}</h2>
        <div class="card__linha">
          <p class="card__preco">${produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
          <button class="btn-mais" data-acao="comprar" data-id="${produto.id}" aria-label="Adicionar ${produto.nome} ao carrinho"></button>
        </div>
      </div>
    </article>`).join("");
}

gradeFavoritos.addEventListener("click", evento => {
  const botao = evento.target.closest("button[data-acao]");
  if (!botao) return;

  const id = Number(botao.dataset.id);
  if (botao.dataset.acao === "desfavoritar") {
    gravarLista("pa_favoritos", lerLista("pa_favoritos").filter(item => item !== id));
    mostrarAviso("Removido dos favoritos");
  } else {
    const carrinho = lerLista("pa_carrinho");
    carrinho.push(id);
    gravarLista("pa_carrinho", carrinho);
    mostrarAviso("Produto adicionado ao carrinho");
  }

  atualizarContadores();
  renderizarFavoritos();
});

renderizarFavoritos();
