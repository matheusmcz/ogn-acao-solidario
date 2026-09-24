/**
 * js/templates.js — Clonagem de <template> HTML5 e montagem de cards.
 */
import { AppData } from "./data.js";

function createBadge(badgeData) {
  const tpl = document.getElementById("tpl-badge");
  if (!tpl) return null;

  const node = tpl.content.cloneNode(true);
  const el = node.querySelector(".badge");
  el.textContent = badgeData.label;
  el.classList.add("badge-" + badgeData.variant);
  return node;
}

function createProjectCard(item) {
  const tpl = document.getElementById("tpl-card-project");
  if (!tpl) return null;

  const fragment = tpl.content.cloneNode(true);
  const badgeGroup = fragment.querySelector("[data-slot='badges']");
  const body = fragment.querySelector("[data-slot='body']");
  const description = fragment.querySelector("[data-slot='description']");
  const listSlot = fragment.querySelector("[data-slot='list']");
  const cta = fragment.querySelector("[data-slot='cta']");

  (item.badges || []).forEach(function (badge) {
    const badgeNode = createBadge(badge);
    if (badgeNode) badgeGroup.appendChild(badgeNode);
  });

  const title = document.createElement(item.titleTag || "h2");
  title.textContent = item.title;
  body.insertBefore(title, description);

  description.textContent = item.description;

  const list = document.createElement(item.listType === "ol" ? "ol" : "ul");
  (item.items || []).forEach(function (text) {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });
  listSlot.appendChild(list);

  cta.textContent = item.ctaLabel;
  cta.className = item.ctaClass;
  cta.setAttribute("href", item.ctaHref);
  cta.setAttribute("data-link", "");

  return fragment;
}

export function renderProjectList(containerId, dataList) {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(dataList)) return;

  container.innerHTML = "";
  dataList.forEach(function (item) {
    const card = createProjectCard(item);
    if (card) container.appendChild(card);
  });
}

export function mountProjetos() {
  renderProjectList("lista-doacoes", AppData.doacoes);
  renderProjectList("lista-voluntariado", AppData.voluntariado);
}
