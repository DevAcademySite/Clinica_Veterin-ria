const formPagamento = document.getElementById("formPagamento");
const resumoPagamento = document.getElementById("resumoPagamento");
const resultadoPedido = document.getElementById("resultadoPedido");
const produtosPagamento = window.PETAMIGO_PRODUTOS;

function obterItensDoCarrinho() {
  const quantidades = lerLista("pa_carrinho").reduce((resultado, id) => {
    resultado[id] = (resultado[id] || 0) + 1;
    return resultado;
  }, {});

  return Object.entries(quantidades)
    .map(([id, quantidade]) => ({
      produto: produtosPagamento.find(item => item.id === Number(id)),
      quantidade
    }))
    .filter(item => item.produto);
}

function renderizarResumo() {
  const itens = obterItensDoCarrinho();
  if (itens.length === 0) {
    resumoPagamento.innerHTML = '<div class="vazio-loja"><p>Seu carrinho está vazio. Adicione produtos antes de escolher o pagamento.</p><a class="botao" href="pagina-inicial.html#produtos">Ver produtos</a></div>';
    resumoPagamento.classList.remove("resumo-loja");
    formPagamento.hidden = true;
    return false;
  }

  const total = itens.reduce((soma, item) => soma + item.produto.preco * item.quantidade, 0);
  resumoPagamento.innerHTML = `
    <h2>Resumo do pedido</h2>
    <ul>${itens.map(item => `<li>${item.quantidade} × ${item.produto.nome} — ${(item.produto.preco * item.quantidade).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</li>`).join("")}</ul>
    <div class="resumo-loja__linha"><span>Total</span><span>${total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span></div>`;
  return true;
}

formPagamento.addEventListener("submit", evento => {
  evento.preventDefault();
  if (!formPagamento.reportValidity()) return;

  const itens = obterItensDoCarrinho();
  if (itens.length === 0) {
    renderizarResumo();
    return;
  }

  const formaPagamento = new FormData(formPagamento).get("formaPagamento");
  const pedido = {
    id: Date.now().toString(36).toUpperCase(),
    itens: itens.map(item => ({ id: item.produto.id, quantidade: item.quantidade })),
    total: itens.reduce((soma, item) => soma + item.produto.preco * item.quantidade, 0),
    formaPagamento,
    criadoEm: new Date().toISOString()
  };
  const pedidos = lerLista("pa_pedidos");
  pedidos.push(pedido);
  gravarLista("pa_pedidos", pedidos);
  gravarLista("pa_carrinho", []);
  atualizarContadores();

  formPagamento.hidden = true;
  resumoPagamento.hidden = true;
  resultadoPedido.innerHTML = `
    <section class="sucesso-pedido">
      <h2>Pedido registrado!</h2>
      <p>Número do pedido: <strong>${pedido.id}</strong></p>
      <p>Forma escolhida: ${formaPagamento}</p>
      <p>Este pedido foi salvo apenas neste navegador. Nenhuma cobrança foi feita.</p>
      <a class="botao" href="pagina-inicial.html">Voltar ao início</a>
    </section>`;
});

renderizarResumo();
