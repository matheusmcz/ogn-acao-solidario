/**
 * js/form.js — Validação, eventos de formulário e UI de histórico.
 * Persistência fica em storage.js (SRP).
 */
import { loadCadastros, saveCadastro } from "./storage.js";
import { formatDateTime } from "./dates.js";

function showToast() {
  const toast = document.getElementById("toast-success");
  if (!toast) return;
  toast.classList.remove("hidden");
  window.setTimeout(function () {
    toast.classList.add("hidden");
  }, 4000);
}

function getFeedbackEl(field) {
  const describedBy = field.getAttribute("aria-describedby");
  if (describedBy) return document.getElementById(describedBy);
  return field.parentElement
    ? field.parentElement.querySelector(".field-feedback")
    : null;
}

function messageForField(field) {
  if (field.validity.valueMissing) return "Este campo é obrigatório.";
  if (field.validity.typeMismatch)
    return "Formato inválido. Verifique o valor informado.";
  if (field.validity.patternMismatch)
    return field.title || "O valor não corresponde ao formato esperado.";
  if (field.validity.tooLong) return "O texto excede o limite permitido.";
  return "Valor inválido.";
}

function clearFieldState(field) {
  field.classList.remove("is-invalid", "is-valid");
  field.removeAttribute("aria-invalid");
  const feedback = getFeedbackEl(field);
  if (feedback) feedback.classList.remove("is-visible");
}

function markFieldValidity(field, { showMessage } = { showMessage: true }) {
  if (
    !field.willValidate ||
    field.disabled ||
    field.type === "submit" ||
    field.type === "reset"
  ) {
    return true;
  }

  const valid = field.checkValidity();
  field.classList.toggle("is-invalid", !valid);
  field.classList.toggle("is-valid", valid && field.value !== "");
  field.setAttribute("aria-invalid", valid ? "false" : "true");

  const feedback = getFeedbackEl(field);
  if (feedback) {
    if (!valid && showMessage) {
      feedback.textContent = messageForField(field);
      feedback.classList.add("is-visible");
    } else {
      feedback.classList.remove("is-visible");
    }
  }

  return valid;
}

function validateForm(form) {
  let firstInvalid = null;
  Array.from(form.elements).forEach(function (field) {
    if (!field.willValidate) return;
    const ok = markFieldValidity(field, { showMessage: true });
    if (!ok && !firstInvalid) firstInvalid = field;
  });
  return firstInvalid;
}

function collectFormData(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  data.interesse = Array.from(
    form.querySelectorAll('input[name="interesse"]:checked')
  ).map(function (el) {
    return el.value;
  });
  data.enviadoEm = new Date().toISOString();
  return data;
}

export function restoreHistoricoUI() {
  const container = document.getElementById("lista-cadastros-salvos");
  if (!container) return;

  const registros = loadCadastros();
  container.innerHTML = "";

  if (registros.length === 0) {
    container.innerHTML =
      '<p class="historico-vazio">Nenhum cadastro salvo ainda neste navegador.</p>';
    return;
  }

  const list = document.createElement("ul");
  list.className = "historico-items";

  registros
    .slice()
    .reverse()
    .forEach(function (item, index) {
      const li = document.createElement("li");
      li.className = "historico-item card-item";
      const dataFmt = formatDateTime(item.enviadoEm);
      const interesses = Array.isArray(item.interesse)
        ? item.interesse.join(", ") || "não informado"
        : "não informado";

      li.innerHTML =
        '<div class="badge-group">' +
        '<span class="badge badge-info">#' +
        (registros.length - index) +
        "</span>" +
        '<span class="badge badge-neutral">' +
        dataFmt +
        "</span>" +
        "</div>" +
        "<p><strong>" +
        (item.nome || "Sem nome") +
        "</strong> — " +
        (item.email || "sem e-mail") +
        "</p>" +
        "<p>Cidade: " +
        (item.cidade || "—") +
        "/" +
        (item.estado || "—") +
        " | Interesse: " +
        interesses +
        "</p>";

      list.appendChild(li);
    });

  container.appendChild(list);
}

function ensureErrorAlert(form) {
  let alert = document.getElementById("form-error-alert");
  if (!alert) {
    alert = document.createElement("div");
    alert.id = "form-error-alert";
    alert.className = "alert alert-danger";
    alert.setAttribute("role", "alert");
    alert.innerHTML =
      '<span class="badge badge-danger">Erro</span> ' +
      "Existem campos inválidos ou vazios. Corrija-os antes de enviar.";
    form.parentElement.insertBefore(alert, form);
  }
  alert.classList.remove("hidden");
  return alert;
}

function hideErrorAlert() {
  const alert = document.getElementById("form-error-alert");
  if (alert) alert.classList.add("hidden");
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const firstInvalid = validateForm(form);

  if (firstInvalid) {
    ensureErrorAlert(form);
    firstInvalid.focus();
    return;
  }

  hideErrorAlert();
  saveCadastro(collectFormData(form));
  form.reset();
  Array.from(form.elements).forEach(clearFieldState);
  restoreHistoricoUI();
  showToast();
}

function handleInput(event) {
  const field = event.target;
  if (!field.matches("input, textarea, select")) return;
  markFieldValidity(field, { showMessage: true });
}

function handleBlur(event) {
  const field = event.target;
  if (!field.matches("input, textarea, select")) return;
  markFieldValidity(field, { showMessage: true });
}

function handleReset(event) {
  const form = event.currentTarget;
  window.setTimeout(function () {
    Array.from(form.elements).forEach(clearFieldState);
    hideErrorAlert();
    const toast = document.getElementById("toast-success");
    if (toast) toast.classList.add("hidden");
  }, 0);
}

export function mountCadastro() {
  const form = document.querySelector(".form-responsive");
  if (!form) return;

  if (form.dataset.bound !== "true") {
    form.dataset.bound = "true";
    form.setAttribute("novalidate", "novalidate");
    form.querySelectorAll("[required]").forEach(function (field) {
      field.setAttribute("aria-required", "true");
    });
    form.addEventListener("submit", handleSubmit);
    form.addEventListener("input", handleInput);
    form.addEventListener("blur", handleBlur, true);
    form.addEventListener("reset", handleReset);
  }

  restoreHistoricoUI();
}
