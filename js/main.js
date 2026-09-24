/**
 * js/main.js — Bootstrap da SPA: roteamento e orquestração dos módulos.
 */
import { mountProjetos } from "./templates.js";
import { mountCadastro } from "./form.js";
import { initThemeControls } from "./theme.js";

initThemeControls();

const app = document.getElementById("app");
if (!app) {
  throw new Error('Elemento #app não encontrado no shell HTML.');
}

const routes = {
  "/": {
    title: "ONG Ação Solidária - Início",
    template: "pages/inicio.html",
  },
  "/projetos": {
    title: "ONG Ação Solidária - Projetos",
    template: "pages/projetos.html",
  },
  "/cadastro": {
    title: "ONG Ação Solidária - Cadastro",
    template: "pages/cadastro.html",
  },
  "/componentes": {
    title: "ONG Ação Solidária - Componentes de Feedback",
    template: "pages/componentes.html",
  },
};

let pendingScrollId = null;

function normalizePath(hash) {
  const raw = (hash || "#/").replace(/^#/, "") || "/";
  const path = raw.startsWith("/") ? raw : "/" + raw;
  return path.split("?")[0] || "/";
}

function setActiveLink(path) {
  document.querySelectorAll("[data-route]").forEach(function (link) {
    const route = link.getAttribute("data-route");
    const isActive = route === path;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function closeMobileMenu() {
  const checkbox = document.getElementById("menu-checkbox");
  if (checkbox) checkbox.checked = false;
}

async function render(path, scrollId) {
  const route = routes[path] || routes["/"];
  const targetPath = routes[path] ? path : "/";

  try {
    const response = await fetch(route.template);
    if (!response.ok) {
      throw new Error("Falha ao carregar " + route.template);
    }

    app.innerHTML = await response.text();
    document.title = route.title;
    setActiveLink(targetPath);
    closeMobileMenu();
    app.focus({ preventScroll: true });

    if (targetPath === "/projetos") mountProjetos();
    if (targetPath === "/cadastro") mountCadastro();

    const targetScroll = scrollId || pendingScrollId;
    pendingScrollId = null;

    if (targetScroll) {
      const section = document.getElementById(targetScroll);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    app.innerHTML =
      '<div class="alert alert-danger grid-span-12" role="alert">' +
      '<span class="badge badge-danger">Erro</span> ' +
      "Não foi possível carregar esta view. Use um servidor local (ex.: python3 -m http.server)." +
      "</div>";
    console.error(error);
  }
}

function navigateFromHash() {
  render(normalizePath(window.location.hash));
}

document.addEventListener("click", function (event) {
  const link = event.target.closest("a[data-link]");
  if (!link) return;

  const href = link.getAttribute("href") || "";
  if (!href.startsWith("#/")) return;

  event.preventDefault();
  pendingScrollId = link.getAttribute("data-scroll");

  const nextHash = href.split("?")[0];
  if (window.location.hash === nextHash) {
    render(normalizePath(nextHash), pendingScrollId);
    return;
  }

  window.location.hash = nextHash;
});

window.addEventListener("hashchange", navigateFromHash);

const menuCheckbox = document.getElementById("menu-checkbox");
if (menuCheckbox) {
  menuCheckbox.addEventListener("change", function () {
    const expanded = menuCheckbox.checked;
    menuCheckbox.setAttribute("aria-expanded", String(expanded));
    document.body.classList.toggle("menu-open", expanded);
  });
}

if (!window.location.hash || window.location.hash === "#") {
  window.location.hash = "#/";
} else {
  navigateFromHash();
}
