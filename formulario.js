// ===== formulario.js: validação do formulário e agendamento =====
// Heurística: prevenção de erros + mensagens de erro claras ao lado de cada campo.

const form = document.getElementById("formAgendamento");
const campos = ["servico", "tutor", "animal", "raca", "peso", "telefone", "data", "horario"];

// data de hoje no formato AAAA-MM-DD (para bloquear datas passadas)
const hoje = new Date().toLocaleDateString("sv-SE");
document.getElementById("data").min = hoje;   // o calendário já nem deixa escolher dias passados

// Se veio de um card (formulario.html?servico=hotel), já deixa o serviço escolhido
const servicoUrl = new URLSearchParams(location.search).get("servico");
if (servicoUrl) document.getElementById("servico").value = servicoUrl;

// ---- REGRAS: cada uma devolve a mensagem de erro ("" = tudo certo) ----
const regras = {
  servico: v => v ? "" : "Escolha o serviço.",
  tutor:   v => v.trim().length >= 3 ? "" : "Informe o nome do tutor (mínimo 3 letras).",
  animal:  v => v.trim() ? "" : "Informe o nome do animal.",
  raca:    v => v.trim() ? "" : "Informe a raça do animal.",
  peso: v => {
    const n = Number(String(v).replace(",", "."));
    return v !== "" && n >= 0.1 && n <= 100 ? "" : "Informe o peso em kg, entre 0,1 e 100.";
  },
  telefone: v => {
    const digitos = v.replace(/\D/g, "");            // tira parênteses, espaços e traço
    if (digitos.length === 0) return "Informe o telefone para contato.";
    return digitos.length === 10 || digitos.length === 11
      ? "" : "Telefone incompleto. Digite o DDD e os 9 números.";
  },
  data: v => !v ? "Escolha a data." : (v < hoje ? "A data não pode ser anterior a hoje." : ""),
  horario: v => !v ? "Escolha o horário." : (v >= "08:00" && v <= "18:00" ? "" : "Escolha um horário entre 08:00 e 18:00.")
};

// mostra (ou limpa) a mensagem de erro de um campo
function mostrarErro(campo, mensagem) {
  const input = document.getElementById(campo);
  document.getElementById("erro-" + campo).textContent = mensagem;
  input.classList.toggle("invalido", mensagem !== "");
  input.setAttribute("aria-invalid", mensagem !== "" ? "true" : "false");
}

// valida um campo; devolve true se estiver certo
function validarCampo(campo) {
  const mensagem = regras[campo](document.getElementById(campo).value);
  mostrarErro(campo, mensagem);
  return mensagem === "";
}

// ---- MÁSCARA do telefone: formata sozinho como (81) 91234-5678 e não deixa passar de 11 números ----
document.getElementById("telefone").addEventListener("input", (e) => {
  const d = e.target.value.replace(/\D/g, "").slice(0, 11);   // só números, no máximo 11
  const corte = d.length === 11 ? 7 : 6;                      // celular (11) ou fixo (10)
  let t = d;
  if (d.length > 6)      t = "(" + d.slice(0, 2) + ") " + d.slice(2, corte) + "-" + d.slice(corte);
  else if (d.length > 2) t = "(" + d.slice(0, 2) + ") " + d.slice(2);
  else if (d.length > 0) t = "(" + d;
  e.target.value = t;
});

// valida ao sair do campo e limpa o erro enquanto a pessoa corrige
campos.forEach(campo => {
  const input = document.getElementById(campo);
  input.addEventListener("blur", () => validarCampo(campo));
  input.addEventListener("input", () => { if (input.classList.contains("invalido")) validarCampo(campo); });
});

// ---- ENVIO ----
form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  let primeiroComErro = null;
  campos.forEach(campo => {
    if (!validarCampo(campo) && !primeiroComErro) primeiroComErro = campo;
  });
  if (primeiroComErro) {
    document.getElementById(primeiroComErro).focus();
    mostrarAviso("Corrija os campos destacados.", "erro");
    return;
  }

  const dados = {};
  campos.forEach(campo => { dados[campo] = document.getElementById(campo).value.trim(); });

  // Sem servidor: guarda o agendamento no navegador (localStorage) e vai para a tela de sucesso
  const salvos = lerLista("pa_agendamentos");
  salvos.push({ ...dados, criadoEm: new Date().toISOString() });
  gravarLista("pa_agendamentos", salvos);
  location.href = "agendado-com-sucesso.html";
});