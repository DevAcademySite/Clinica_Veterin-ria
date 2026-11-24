// ===================================================
// perfil.js: exibe informações da conta, pedidos,
// favoritos, segurança e opção de sair.
// ===================================================

const resumoPedidosEl = document.getElementById("resumoPedidos");
const resumoFavoritosEl = document.getElementById("resumoFavoritos");
const detalhesPedidosEl = document.getElementById("detalhesPedidos");
const btnVerPedidos = document.getElementById("btnVerPedidos");
const btnLimparDados = document.getElementById("btnLimparDados");
const btnSair = document.getElementById("btnSair");

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function atualizarResumoPerfil() {
  const pedidos = lerLista("pa_pedidos");
  const favoritos = lerLista("pa_favoritos");

  resumoPedidosEl.textContent =
    pedidos.length === 0
      ? "Nenhum pedido registrado ainda"
      : `${pedidos.length} pedido(s) registrado(s)`;

  resumoFavoritosEl.textContent =
    favoritos.length === 0
      ? "Nenhum produto favoritado ainda"
      : `${favoritos.length} produto(s) nos favoritos`;
}

function renderizarPedidos() {
  const pedidos = lerLista("pa_pedidos");
  const catalogo = window.PETAMIGO_PRODUTOS || [];

  if (pedidos.length === 0) {
    detalhesPedidosEl.innerHTML = "<p>Você ainda não fez nenhum pedido.</p>";
  } else {
    detalhesPedidosEl.innerHTML = `
      <h2>Histórico de pedidos</h2>
      <ul>
        ${pedidos
          .map(pedido => {
            const itensTexto = (pedido.itens || [])
              .map(item => {
                const prod = catalogo.find(p => p.id === Number(item.id));
                return `${item.quantidade}× ${prod ? prod.nome : `Produto #${item.id}`}`;
              })
              .join(", ");
            return `<li><strong>#${pedido.id}</strong> — ${itensTexto || "Itens"} — <strong>${formatarMoeda(pedido.total)}</strong> (${pedido.formaPagamento})</li>`;
          })
          .join("")}
      </ul>`;
  }

  detalhesPedidosEl.hidden = false;
}

if (btnVerPedidos) {
  btnVerPedidos.addEventListener("click", renderizarPedidos);
}

if (btnLimparDados) {
  btnLimparDados.addEventListener("click", () => {
    gravarLista("pa_carrinho", []);
    gravarLista("pa_favoritos", []);
    gravarLista("pa_pedidos", []);
    atualizarContadores();
    atualizarResumoPerfil();
    detalhesPedidosEl.hidden = true;
    mostrarAviso("Dados locais limpos com segurança.");
  });
}

if (btnSair) {
  btnSair.addEventListener("click", () => {
    mostrarAviso("Saindo da conta...");
    setTimeout(() => {
      window.location.href = "pagina-inicial.html";
    }, 500);
  });
}

atualizarResumoPerfil();