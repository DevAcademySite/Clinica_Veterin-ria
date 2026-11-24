const produtosCarrinho = window.PETAMIGO_PRODUTOS;
const listaCarrinho = document.getElementById("itensCarrinho");
const resumoCarrinho = document.getElementById("resumoCarrinho");

function contarItens(carrinho) {
  return carrinho.reduce((quantidades, id) => {
    quantidades[id] = (quantidades[id] || 0) + 1;
    return quantidades;
  }, {});
}

function renderizarCarrinho() {
  const carrinho = lerLista("pa_carrinho");
  const quantidades = contarItens(carrinho);
  const itens = Object.entries(quantidades)
    .map(([id, quantidade]) => ({
      produto: produtosCarrinho.find(item => item.id === Number(id)),
      quantidade
    }))
    .filter(item => item.produto);

  if (itens.length === 0) {
    listaCarrinho.innerHTML = '<div class="vazio-loja"><p>Seu carrinho está vazio.</p><a class="botao" href="pagina-inicial.html#produtos">Ver produtos</a></div>';
    resumoCarrinho.hidden = true;
    return;
  }

  listaCarrinho.innerHTML = itens.map(({ produto, quantidade }) => `
    <article class="item-loja">
      <div class="item-loja__info">
        <span class="item-loja__icone" aria-hidden="true">${produto.emoji}</span>
        <div><h2 class="item-loja__nome">${produto.nome}</h2><p class="item-loja__preco">${formatarPreco(produto.preco)} cada</p></div>
      </div>
      <div class="item-loja__acoes">
        <div class="controle-qtd" aria-label="Quantidade de ${produto.nome}">
          <button type="button" data-acao="diminuir" data-id="${produto.id}" aria-label="Diminuir quantidade">−</button>
          <span>${quantidade}</span>
          <button type="button" data-acao="aumentar" data-id="${produto.id}" aria-label="Aumentar quantidade">+</button>
        </div>
        <button type="button" class="botao-secundario" data-acao="remover" data-id="${produto.id}">Remover</button>
      </div>
    </article>`).join("");

  const total = itens.reduce((soma, item) => soma + item.produto.preco * item.quantidade, 0);
  document.getElementById("totalCarrinho").textContent = formatarPreco(total);
  resumoCarrinho.hidden = false;
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

listaCarrinho.addEventListener("click", evento => {
  const botao = evento.target.closest("button[data-acao]");
  if (!botao) return;

  const id = Number(botao.dataset.id);
  const carrinho = lerLista("pa_carrinho");

  if (botao.dataset.acao === "aumentar") carrinho.push(id);
  if (botao.dataset.acao === "remover") {
    gravarLista("pa_carrinho", carrinho.filter(item => item !== id));
  } else if (botao.dataset.acao === "diminuir") {
    const indice = carrinho.indexOf(id);
    if (indice !== -1) carrinho.splice(indice, 1);
    gravarLista("pa_carrinho", carrinho);
  } else {
    gravarLista("pa_carrinho", carrinho);
  }

  atualizarContadores();
  renderizarCarrinho();
});

renderizarCarrinho();
