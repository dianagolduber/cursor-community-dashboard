import type { CafeEvent } from "./types";
import seedEvents from "@/data/seed-events.json";

const STORAGE_KEY = "cursor-cafe-event-ops-v1";

export function loadEvents(): CafeEvent[] {
  if (typeof window === "undefined") {
    return seedEvents as CafeEvent[];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return seedEvents as CafeEvent[];
    }
    return JSON.parse(raw) as CafeEvent[];
  } catch {
    return seedEvents as CafeEvent[];
  }
}

export function saveEvents(events: CafeEvent[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function updateEvent(
  events: CafeEvent[],
  id: string,
  patch: Partial<CafeEvent>,
): CafeEvent[] {
  return events.map((e) => (e.id === id ? { ...e, ...patch } : e));
}
