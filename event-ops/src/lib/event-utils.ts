import type { CafeEvent, EventStatus } from "./types";
import { getRiskLevel, RISK_ORDER } from "./risk";
import type { RiskLevel } from "./types";
import type { SortDir, SortKey } from "./types";

const CONTINENT_BY_COUNTRY: Record<string, string> = {
  Kenya: "Africa",
  Mexico: "North America",
  Norway: "Europe",
  Albania: "Europe",
};

export function getContinent(country: string): string {
  return CONTINENT_BY_COUNTRY[country] ?? "Other";
}

const CITY_DISPLAY_NAMES: Record<string, string> = {
  "León de los Aldama": "León",
};

export function displayCity(city: string): string {
  return CITY_DISPLAY_NAMES[city] ?? city;
}

export function getEventStatus(event: CafeEvent, now = new Date()): EventStatus {
  const start = new Date(event.date);
  const end = event.endDate ? new Date(event.endDate) : start;

  if (end < now) return "done";

  if (start <= now && now <= end) return "live";

  const daysUntil =
    (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (daysUntil <= 7) return "soon";

  return "upcoming";
}

export function formatEventDate(iso: string, timezone?: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: timezone || "UTC",
  }).format(new Date(iso));
}

export function formatEventDateTime(iso: string, timezone?: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone || "UTC",
  }).format(new Date(iso));
}

export function sortEvents(
  events: CafeEvent[],
  key: SortKey,
  dir: SortDir,
): CafeEvent[] {
  const sorted = [...events].sort((a, b) => {
    let cmp = 0;
    switch (key) {
      case "date":
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "city":
        cmp = a.city.localeCompare(b.city);
        break;
      case "rsvps":
        cmp = a.rsvps - b.rsvps;
        break;
      case "risk":
        cmp =
          RISK_ORDER[getRiskLevel(a)] - RISK_ORDER[getRiskLevel(b)];
        break;
    }
    return dir === "asc" ? cmp : -cmp;
  });
  return sorted;
}

export function countBriefingsSent(events: CafeEvent[]): number {
  return events.filter((e) => e.opsChecklist.hostBriefingSent).length;
}

export function countContinents(events: CafeEvent[]): number {
  return new Set(events.map((e) => e.continent)).size;
}

export function statusLabel(status: EventStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function riskDotClass(level: RiskLevel): string {
  switch (level) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-amber-400";
    case "low":
      return "bg-emerald-500";
  }
}
