# PetAmigo Petshop

Site demonstrativo de pet shop feito com HTML, CSS, JavaScript e Flask. Inclui catálogo de produtos, carrinho, favoritos, fluxo demonstrativo de pagamento, agendamentos, mapa e chatbot.

## Executar localmente

No PowerShell, na pasta do projeto:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install Flask
python app.py
```

## Funcionalidades

- **Catálogo de produtos:** opção de adicionar produtos ao carrinho e aos favoritos com aviso na tela e contadores no topo.
- **Fluxo de compra demonstrativo:** navegação pelos ícones do topo para favoritos e carrinho, ajuste de quantidades, resumo do pedido e escolha demonstrativa de forma de pagamento (Pix, cartão de crédito ou pagamento na retirada). **Não há cobrança real.**
- **Agendamento de serviços:** escolha entre banho e tosa, hotelzinho ou atendimento veterinário, com validação de campos e mensagens de erro claras.
- **Chatbot (Bia):** assistente virtual integrada ao servidor Flask via rota `/chat`, respondendo por palavras-chave e botões de atalho sobre banho e tosa, horários, vacinas, ração e localização.
- **Mapa de estabelecimentos próximos:** usa **Leaflet**, camadas **Esri** e **OpenStreetMap**, geolocalização do navegador, clique no mapa para ajustar o ponto e consulta via **Overpass API** em raios de **3 km, 5 km e 10 km**.
- **Persistência local:** carrinho, favoritos, pedidos demonstrativos e agendamentos salvos no `localStorage` do navegador.

## Arquivos principais

- `app.py`: servidor Flask, entrega das páginas do site e rota `/chat` do chatbot.
- `pagina-inicial.html` e `pagina-inicial.js`: página inicial e vitrine de produtos.
- `carrinho.html`, `carrinho.js`, `favoritos.html`, `pagamento.html`, `pagamento.js`, `catalogo.js` e `loja.css`: fluxo de compra demonstrativo, carrinho, favoritos e pagamento.
- `agendamentos.html` e formulário de agendamento: escolha de serviços e validação dos dados.
- `mapa.html` e `mapa.js`: mapa interativo com Leaflet, Esri/OpenStreetMap e busca de pet shops de 3 km a 10 km.
- `comum.js` e `comum.css`: cabeçalho com links para favoritos, carrinho e perfil, menu hambúrguer, rodapé, avisos e janela do chatbot.

## Observações técnicas

- **Localização e mapa:** em computadores sem GPS, a localização do navegador pode ser aproximada; o usuário pode clicar no mapa para marcar o ponto desejado. A busca de estabelecimentos depende da disponibilidade do servidor público da Overpass API e dos cadastros no OpenStreetMap.
- **Ambiente demonstrativo:** carrinho, favoritos, pedidos e agendamentos são simulados no navegador, sem cobrança real ou banco de dados externo.