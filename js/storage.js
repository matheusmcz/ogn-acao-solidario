/**
 * js/storage.js — Persistência (Web Storage). Isolado da UI de formulário.
 */
export const STORAGE_KEY = "ong_cadastros";

export function loadCadastros() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Falha ao ler localStorage:", error);
    return [];
  }
}

export function saveCadastro(record) {
  const current = loadCadastros();
  current.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  return current;
}
