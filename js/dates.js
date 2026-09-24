/**
 * js/dates.js — Formatação de datas via Day.js (empacotado pelo Vite).
 */
import dayjs from "dayjs";

export function formatDateTime(iso) {
  if (!iso) return "—";
  try {
    return dayjs(iso).format("DD/MM/YYYY [às] HH:mm");
  } catch (error) {
    return new Date(iso).toLocaleString("pt-BR");
  }
}
