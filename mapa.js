// ===================================================
// mapa.js: exibe o mapa e busca pet shops próximos
// usando serviços gratuitos (Leaflet, Esri/OSM e Overpass).
// ===================================================

const CENTRO_INICIAL = [-7.9922, -34.8396];
<<<<<<< HEAD

const botaoLocalizar = document.getElementById("btnLocalizar");
=======
const PETSHOP_ADICIONADO = {
  nome: "Petz",
  categoria: "Pet shop",
  endereco: "R. Carmelita Muniz de Araújo, 225 - Casa Caiada, Olinda - PE, 53130-645",
  lat: -7.9935977,
  lng: -34.8396522
};

const botaoLocalizar = document.getElementById("btnLocalizar");
const botaoEscolherLocal = document.getElementById("btnEscolherLocal");
>>>>>>> 417e5e7de224eaa4ae83d76c838dd9e65c4637a1
const seletorRaio = document.getElementById("raio");
const statusEl = document.getElementById("status");
const listaEl = document.getElementById("lista");

// ---- inicialização do mapa ----
const mapa = L.map("mapa").setView(CENTRO_INICIAL, 15);

const camadaEsri = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 18,
    attribution: "Tiles &copy; Esri"
  }
);

const camadaOsm = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }
);

camadaEsri.addTo(mapa);
L.control.layers({ "Mapa de ruas (Esri)": camadaEsri, "OpenStreetMap": camadaOsm }).addTo(mapa);

// Ícone de patinha para pet shops encontrados no mapa (.icone-petshop no mapa.css)
const iconePetshop = L.divIcon({
  className: "",
  html: '<div class="icone-petshop">🐾</div>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17]
});

<<<<<<< HEAD
const camadaPetshops = L.layerGroup().addTo(mapa);
let marcadorUsuario = null;
let circuloPrecisao = null;
let posicaoAtual = CENTRO_INICIAL;
let avisoPrecisao = "";
=======
const iconeLocalEscolhido = L.divIcon({
  className: "",
  html: '<div class="icone-local-escolhido">📌</div>',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17]
});

const camadaPetshops = L.layerGroup().addTo(mapa);
let marcadorUsuario = null;
let marcadorLocalEscolhido = null;
let circuloPrecisao = null;
let posicaoAtual = CENTRO_INICIAL;
let avisoPrecisao = "";
let modoEscolhaLocal = false;
let buscaManualAtiva = false;
let idSolicitacaoLocalizacao = 0;
>>>>>>> 417e5e7de224eaa4ae83d76c838dd9e65c4637a1

// ---- funções auxiliares ----
function atualizarStatus(mensagem, ehErro) {
  statusEl.textContent = mensagem;
  statusEl.className = "mensagem-status" + (ehErro ? " mensagem-status-erro" : "");
}

function escaparHtml(texto) {
  const elemento = document.createElement("div");
  elemento.textContent = texto;
  return elemento.innerHTML;
}

function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const rad = grau => (grau * Math.PI) / 180;
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function definirCategoria(tags) {
  const nome = (tags.name || "").toLowerCase();
<<<<<<< HEAD
  if (tags.amenity === "veterinary" || nome.includes("veterin")) return "Veterinário";
=======
  const especialidade = [
    tags.healthcare,
    tags["healthcare:speciality"],
    tags["healthcare:specialty"]
  ].filter(Boolean).join(" ").toLowerCase();
  if (
    tags.amenity === "veterinary" ||
    /veterinary|veterinarian|vet/.test(especialidade) ||
    /veterin|veterinary/.test(nome)
  ) return "Clínica veterinária";
>>>>>>> 417e5e7de224eaa4ae83d76c838dd9e65c4637a1
  if (tags.shop === "pet_grooming" || nome.includes("banho") || nome.includes("tosa")) return "Banho e tosa";
  return "Pet shop";
}

// ---- consulta à Overpass API ----
const SERVIDORES_OVERPASS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter"
];

async function consultarOverpass(consulta) {
  let ultimoErro;
  for (const url of SERVIDORES_OVERPASS) {
    const controlador = new AbortController();
<<<<<<< HEAD
    const temporizador = setTimeout(() => controlador.abort(), 15000);
=======
    const temporizador = setTimeout(() => controlador.abort(), 30000);
>>>>>>> 417e5e7de224eaa4ae83d76c838dd9e65c4637a1
    try {
      const resposta = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "data=" + encodeURIComponent(consulta),
        signal: controlador.signal
      });
      if (!resposta.ok) {
        throw new Error("Servidor retornou " + resposta.status);
      }
      return await resposta.json();
    } catch (erro) {
      ultimoErro = erro;
    } finally {
      clearTimeout(temporizador);
    }
  }
  throw ultimoErro;
}

async function buscarPetshops(lat, lng) {
  const raioMetros = Number(seletorRaio.value) || 3000;

<<<<<<< HEAD
  const consulta = `[out:json][timeout:15];
=======
  const consulta = `[out:json][timeout:25];
>>>>>>> 417e5e7de224eaa4ae83d76c838dd9e65c4637a1
    (
      nwr["shop"="pet"](around:${raioMetros},${lat},${lng});
      nwr["shop"="pet_grooming"](around:${raioMetros},${lat},${lng});
      nwr["amenity"="veterinary"](around:${raioMetros},${lat},${lng});
<<<<<<< HEAD
    );
    out center 50;`;

  atualizarStatus("Buscando pet shops próximos...");
  listaEl.innerHTML = "";
  camadaPetshops.clearLayers();
=======
      nwr["healthcare"~"veterinary|veterinarian|vet",i](around:${raioMetros},${lat},${lng});
      nwr["healthcare:speciality"~"veterinary|veterinarian|vet",i](around:${raioMetros},${lat},${lng});
      nwr["healthcare:specialty"~"veterinary|veterinarian|vet",i](around:${raioMetros},${lat},${lng});
      nwr["name"~"veterin|veterinary",i](around:${raioMetros},${lat},${lng});
    );
    out center;`;

  listaEl.innerHTML = "";
  camadaPetshops.clearLayers();
  const distanciaPetz = calcularDistanciaKm(lat, lng, PETSHOP_ADICIONADO.lat, PETSHOP_ADICIONADO.lng);
  if (distanciaPetz <= raioMetros / 1000) {
    renderizarResultados([{ ...PETSHOP_ADICIONADO, km: distanciaPetz }]);
    atualizarStatus("Buscando locais próximos. A Petz já está marcada no mapa." + avisoPrecisao);
  } else {
    atualizarStatus("Buscando pet shops próximos...");
  }
>>>>>>> 417e5e7de224eaa4ae83d76c838dd9e65c4637a1

  try {
    const dados = await consultarOverpass(consulta);
    const lugares = (dados.elements || [])
      .map(item => {
        const plat = item.lat ?? (item.center && item.center.lat);
        const plon = item.lon ?? (item.center && item.center.lon);
        if (!plat || !plon) return null;
        return {
          nome: (item.tags && item.tags.name) || "Pet shop (sem nome no mapa)",
          categoria: definirCategoria(item.tags || {}),
          lat: Number(plat),
          lng: Number(plon),
          km: calcularDistanciaKm(lat, lng, Number(plat), Number(plon))
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.km - b.km);

<<<<<<< HEAD
    renderizarResultados(lugares);
  } catch (erro) {
    console.error("Erro ao consultar Overpass:", erro);
    atualizarStatus(
      "O serviço de busca está ocupado ou sem conexão no momento. Tente novamente em instantes.",
      true
    );
=======
    if (distanciaPetz <= raioMetros / 1000) {
      const jaEncontrada = lugares.some(lugar =>
        lugar.nome.toLowerCase() === PETSHOP_ADICIONADO.nome.toLowerCase() &&
        calcularDistanciaKm(lugar.lat, lugar.lng, PETSHOP_ADICIONADO.lat, PETSHOP_ADICIONADO.lng) <= 0.15
      );
      if (!jaEncontrada) {
        lugares.push({ ...PETSHOP_ADICIONADO, km: distanciaPetz });
        lugares.sort((a, b) => a.km - b.km);
      }
    }

    renderizarResultados(lugares);
  } catch (erro) {
    console.error("Erro ao consultar Overpass:", erro);
    if (distanciaPetz <= raioMetros / 1000) {
      renderizarResultados([{ ...PETSHOP_ADICIONADO, km: distanciaPetz }]);
      atualizarStatus(
        "A busca externa está indisponível. Exibindo a Petz cadastrada neste mapa." + avisoPrecisao,
        true
      );
    } else {
      atualizarStatus("O serviço de busca está ocupado ou sem conexão no momento. Tente novamente em instantes.", true);
    }
>>>>>>> 417e5e7de224eaa4ae83d76c838dd9e65c4637a1
  }
}

function renderizarResultados(lugares) {
  camadaPetshops.clearLayers();
  listaEl.innerHTML = "";

  if (lugares.length === 0) {
    atualizarStatus(
<<<<<<< HEAD
      "Nenhum pet shop encontrado nesse raio. Aumente a distância ou clique no mapa." + avisoPrecisao
=======
      "Nenhum pet shop encontrado nesse raio. Aumente a distância ou escolha outro local no mapa." + avisoPrecisao
>>>>>>> 417e5e7de224eaa4ae83d76c838dd9e65c4637a1
    );
    return;
  }

  atualizarStatus(
    lugares.length + " local(is) encontrado(s) perto da localização." + avisoPrecisao
  );

  lugares.forEach(lugar => {
    const marcador = L.marker([lugar.lat, lugar.lng], { icon: iconePetshop })
      .addTo(camadaPetshops)
      .bindPopup(
        "<strong>" + escaparHtml(lugar.nome) + "</strong><br>" +
        escaparHtml(lugar.categoria) + "<br>" +
<<<<<<< HEAD
=======
        (lugar.endereco ? escaparHtml(lugar.endereco) + "<br>" : "") +
>>>>>>> 417e5e7de224eaa4ae83d76c838dd9e65c4637a1
        lugar.km.toFixed(1).replace(".", ",") + " km"
      );

    const rotaMaps = "https://www.google.com/maps/dir/?api=1&destination=" + lugar.lat + "," + lugar.lng;

    listaEl.insertAdjacentHTML("beforeend", `
      <article class="cartao-lugar">
        <strong class="nome-lugar">${escaparHtml(lugar.nome)}</strong>
        <span class="etiqueta-tipo">${escaparHtml(lugar.categoria)}</span>
<<<<<<< HEAD
=======
        ${lugar.endereco ? `<span class="endereco-lugar">${escaparHtml(lugar.endereco)}</span>` : ""}
>>>>>>> 417e5e7de224eaa4ae83d76c838dd9e65c4637a1
        <span class="distancia-lugar">${lugar.km.toFixed(1).replace(".", ",")} km</span>
        <a class="link-como-chegar" href="${rotaMaps}" target="_blank" rel="noopener">Como chegar</a>
      </article>
    `);

    const cartao = listaEl.lastElementChild;
    cartao.addEventListener("click", evento => {
      if (evento.target.tagName === "A") return;
      mapa.setView([lugar.lat, lugar.lng], 16);
      marcador.openPopup();
    });
  });
}

// ---- posição do usuário e eventos ----
<<<<<<< HEAD
function definirLocalizacao(lat, lng, zoom, precisao) {
  posicaoAtual = [lat, lng];
  mapa.setView(posicaoAtual, zoom || mapa.getZoom() || 15);

  if (marcadorUsuario) marcadorUsuario.remove();
  if (circuloPrecisao) circuloPrecisao.remove();

  marcadorUsuario = L.circleMarker(posicaoAtual, {
    radius: 9,
    color: "#ffffff",
    weight: 3,
    fillColor: "#0f5257",
    fillOpacity: 1
  })
    .addTo(mapa)
    .bindPopup("Você está aqui");

  avisoPrecisao = "";
  if (precisao && precisao > 1000) {
    circuloPrecisao = L.circle(posicaoAtual, {
=======
function selecionarPontoDeBusca(lat, lng, zoom, aviso) {
  posicaoAtual = [lat, lng];
  mapa.setView(posicaoAtual, zoom || mapa.getZoom() || 15);
  avisoPrecisao = aviso || "";
  buscarPetshops(lat, lng);
}

function atualizarMarcadorUsuario(lat, lng, precisao) {
  const posicao = [lat, lng];
  if (marcadorUsuario) {
    marcadorUsuario.setLatLng(posicao);
  } else {
    marcadorUsuario = L.circleMarker(posicao, {
      radius: 9,
      color: "#ffffff",
      weight: 3,
      fillColor: "#0f5257",
      fillOpacity: 1
    })
      .addTo(mapa)
      .bindPopup("Sua localização atual");
  }

  if (circuloPrecisao) circuloPrecisao.remove();

  if (precisao && precisao > 1000) {
    circuloPrecisao = L.circle(posicao, {
>>>>>>> 417e5e7de224eaa4ae83d76c838dd9e65c4637a1
      radius: precisao,
      color: "#0f5257",
      weight: 1,
      fillOpacity: 0.08
    }).addTo(mapa);
<<<<<<< HEAD
    avisoPrecisao =
      " Localização aproximada (~" +
      Math.round(precisao / 1000) +
      " km). Se precisar, clique no mapa para ajustar.";
  }

  buscarPetshops(lat, lng);
}

function obterLocalizacao() {
  if (!navigator.geolocation) {
    atualizarStatus("Seu navegador não suporta geolocalização. Clique no mapa para escolher o local.", true);
    definirLocalizacao(CENTRO_INICIAL[0], CENTRO_INICIAL[1], 15);
=======
  }
}

function obterLocalizacao() {
  const idSolicitacao = ++idSolicitacaoLocalizacao;
  buscaManualAtiva = false;
  modoEscolhaLocal = false;
  botaoEscolherLocal.setAttribute("aria-pressed", "false");
  if (marcadorLocalEscolhido) {
    marcadorLocalEscolhido.remove();
    marcadorLocalEscolhido = null;
  }

  if (!navigator.geolocation) {
    selecionarPontoDeBusca(
      CENTRO_INICIAL[0],
      CENTRO_INICIAL[1],
      15,
      " Seu navegador não suporta geolocalização; a busca usa o ponto inicial. Escolha um local no mapa para pesquisar em outra área."
    );
>>>>>>> 417e5e7de224eaa4ae83d76c838dd9e65c4637a1
    return;
  }

  atualizarStatus("Obtendo sua localização...");
  navigator.geolocation.getCurrentPosition(
    posicao => {
<<<<<<< HEAD
      definirLocalizacao(
        posicao.coords.latitude,
        posicao.coords.longitude,
        15,
        posicao.coords.accuracy
      );
    },
    () => {
      atualizarStatus(
        "Não foi possível obter sua localização. Clique no mapa no ponto desejado.",
        true
      );
      definirLocalizacao(CENTRO_INICIAL[0], CENTRO_INICIAL[1], 15);
=======
      if (idSolicitacao !== idSolicitacaoLocalizacao) return;
      const { latitude, longitude, accuracy } = posicao.coords;
      atualizarMarcadorUsuario(latitude, longitude, accuracy);

      if (buscaManualAtiva) return;

      const aviso = accuracy > 1000
        ? " Localização aproximada (~" + Math.round(accuracy / 1000) + " km)."
        : "";
      selecionarPontoDeBusca(latitude, longitude, 15, aviso);
    },
    () => {
      if (idSolicitacao !== idSolicitacaoLocalizacao || buscaManualAtiva) return;
      selecionarPontoDeBusca(
        CENTRO_INICIAL[0],
        CENTRO_INICIAL[1],
        15,
        " Não foi possível obter sua localização; a busca usa o ponto inicial. Escolha um local no mapa para pesquisar em outra área."
      );
>>>>>>> 417e5e7de224eaa4ae83d76c838dd9e65c4637a1
    },
    { timeout: 15000, enableHighAccuracy: true }
  );
}

mapa.on("click", evento => {
<<<<<<< HEAD
  definirLocalizacao(evento.latlng.lat, evento.latlng.lng, mapa.getZoom());
=======
  if (!modoEscolhaLocal) return;

  modoEscolhaLocal = false;
  buscaManualAtiva = true;
  botaoEscolherLocal.setAttribute("aria-pressed", "false");

  if (marcadorLocalEscolhido) marcadorLocalEscolhido.remove();
  marcadorLocalEscolhido = L.marker(evento.latlng, { icon: iconeLocalEscolhido })
    .addTo(mapa)
    .bindPopup("Local escolhido para a busca");

  selecionarPontoDeBusca(
    evento.latlng.lat,
    evento.latlng.lng,
    mapa.getZoom(),
    " Busca usando o local escolhido no mapa."
  );
>>>>>>> 417e5e7de224eaa4ae83d76c838dd9e65c4637a1
});

if (botaoLocalizar) {
  botaoLocalizar.addEventListener("click", obterLocalizacao);
}

<<<<<<< HEAD
=======
botaoEscolherLocal.addEventListener("click", () => {
  modoEscolhaLocal = !modoEscolhaLocal;
  botaoEscolherLocal.setAttribute("aria-pressed", String(modoEscolhaLocal));
  if (modoEscolhaLocal) {
    atualizarStatus("Clique no mapa para escolher o ponto da busca.");
  } else {
    atualizarStatus("Seleção de local cancelada. A busca atual foi mantida.");
  }
});

>>>>>>> 417e5e7de224eaa4ae83d76c838dd9e65c4637a1
if (seletorRaio) {
  seletorRaio.addEventListener("change", () => {
    buscarPetshops(posicaoAtual[0], posicaoAtual[1]);
  });
}

obterLocalizacao();