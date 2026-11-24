# ===================================================
# app.py - servidor do PetAmigo Petshop (Flask)
# Faz 2 coisas:
#   1) entrega as páginas do site (HTML, CSS e JS) para o navegador
#   2) é o "cérebro" do chatbot: recebe a mensagem e devolve a resposta (/chat)
# ===================================================

import os
from flask import Flask, jsonify, request, send_from_directory, abort

app = Flask(__name__)

# PASTA = pasta onde está este arquivo (onde ficam os arquivos do site)
PASTA = os.path.dirname(os.path.abspath(__file__))

# Só estes tipos de arquivo podem ser baixados pelo navegador (o app.py fica protegido)
EXTENSOES_PERMITIDAS = (".html", ".css", ".js")


# Libera o acesso mesmo se a página for aberta de outro jeito (Live Server, arquivo direto etc.)
@app.after_request
def liberar_acesso(resposta):
    resposta.headers["Access-Control-Allow-Origin"] = "*"
    resposta.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resposta.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return resposta


# ===================================================
# RESPOSTAS DO BOT: palavras-chave e respostas
# ===================================================
RESPOSTAS = [
    {"palavras": ["banho", "tosa"],
     "texto": "Fazemos banho e tosa de segunda a sábado.\nBanho a partir de R$ 40 e tosa a partir de R$ 60. Você pode agendar pelo menu, em Agendamentos."},
    {"palavras": ["horario", "horário", "aberto", "funciona"],
     "texto": "Abrimos de segunda a sexta, das 8h às 19h, e aos sábados, das 8h às 16h."},
    {"palavras": ["vacina", "vermifugo", "vermífugo"],
     "texto": "Aplicamos vacinas V8, V10 e antirrábica. Traga a carteirinha do seu pet para atualizarmos."},
    {"palavras": ["racao", "ração", "comida"],
     "texto": "Temos ração para cães e gatos, filhotes e adultos. Dá uma olhada nos mais vendidos aqui no site ou me diga a espécie e a idade do seu pet."},
    {"palavras": ["mapa", "perto", "onde fica", "localização", "localizacao", "endereço", "endereco"],
     "texto": "Para ver pet shops perto de você, abra o menu ☰ e clique em Pet shops perto de mim."},
    {"palavras": ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite"],
     "texto": "Oi! Eu sou a Bia, do PetAmigo. Posso ajudar com banho e tosa, vacinas, ração e horários."},
]
RESPOSTA_PADRAO = "Não entendi muito bem. Você pode perguntar sobre banho e tosa, horários, vacinas ou ração."


def buscar_resposta(mensagem):
    """Procura qual resposta combina com a mensagem do cliente."""
    texto = mensagem.lower()
    for item in RESPOSTAS:
        for palavra in item["palavras"]:
            if palavra in texto:
                return item["texto"]
    return RESPOSTA_PADRAO


# ===================================================
# ROTAS (os "endereços" do site)
# ===================================================
@app.route("/")
def pagina_inicial():
    return send_from_directory(PASTA, "pagina-inicial.html")


@app.route("/<nome>")
def arquivo(nome):
    # entrega pagina-inicial.html, comum.css, mapa.js etc.
    if nome == "favicon.ico":
        abort(404)                       # o navegador sempre pede o ícone da aba; não temos, e tudo bem
    if not nome.endswith(EXTENSOES_PERMITIDAS) or not os.path.isfile(os.path.join(PASTA, nome)):
        # ajuda a achar o problema: mostra onde o Flask procurou e o que existe lá
        print(f"[AVISO] Não encontrei '{nome}' na pasta: {PASTA}")
        print("        Arquivos que existem nessa pasta:", sorted(os.listdir(PASTA)))
        abort(404)
    return send_from_directory(PASTA, nome)


@app.route("/chat", methods=["POST"])
def chat():
    dados = request.get_json(silent=True) or {}
    return jsonify({"resposta": buscar_resposta(dados.get("mensagem", ""))})


if __name__ == "__main__":
    app.run(debug=True)