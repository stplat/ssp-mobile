import type { Lead } from "../types";

const categories = ["Манипулятор", "Автокран", "Эвакуатор", "Самосвал", "Экскаватор"];
const locations = ["Москва, САО", "Москва, ЮЗАО", "Химки", "Мытищи", "Люберцы"];

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function fakeIsoNowMinusMinutes(mins: number) {
  const d = new Date(Date.now() - mins * 60_000);
  return d.toISOString();
}

function fakeScheduledAt(i: number) {
  if (i % 3 === 0) return null;
  const d = new Date(Date.now() + (i + 1) * 60 * 60_000);
  return d.toISOString();
}

function fakePhone(i: number) {
  const a = 900 + (i % 50);
  const b = 100 + (i % 900);
  const c = 10 + (i % 90);
  const d = 10 + ((i * 7) % 90);
  return `+7 (${a}) ${pad2(Math.floor(b / 10))}${b % 10}-${c}-${d}`;
}

export function seedLeads(count: number, offset = 0): Lead[] {
  return Array.from({ length: count }).map((_, idx) => {
    const i = offset + idx;
    return {
      id: `lead-${i + 1}`,
      category_title: categories[i % categories.length] ?? "Спецтехника",
      created_at: fakeIsoNowMinusMinutes(5 + i * 7),
      location_text: locations[i % locations.length] ?? "—",
      scheduled_at: fakeScheduledAt(i),
      description: "Нужна техника. Подробности в описании заявки.",
      contact: { phone: fakePhone(i) }
    };
  });
}

