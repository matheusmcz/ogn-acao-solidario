/**
 * js/dates.js — Formatação de datas via Day.js (CDN ESM).
 */
import dayjs from "https://cdn.jsdelivr.net/npm/dayjs@1.11.13/+esm";

export function formatDateTime(iso) {
  if (!iso) return "—";
  try {
    return dayjs(iso).format("DD/MM/YYYY [às] HH:mm");
  } catch (error) {
    return new Date(iso).toLocaleString("pt-BR");
  }
}
