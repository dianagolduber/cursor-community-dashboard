import type { CafeEvent, RiskLevel } from "./types";

export function getFillRate(event: CafeEvent): number {
  if (event.capacity <= 0) return 0;
  return event.rsvps / event.capacity;
}

export function getRiskLevel(event: CafeEvent): RiskLevel {
  const rate = getFillRate(event);
  if (rate < 0.2) return "high";
  if (rate < 0.6) return "medium";
  return "low";
}

export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case "high":
      return "High risk";
    case "medium":
      return "Medium risk";
    case "low":
      return "Low risk";
  }
}

export function getRiskNote(event: CafeEvent): string {
  const rate = Math.round(getFillRate(event) * 100);
  const level = getRiskLevel(event);
  if (level === "high") {
    return `RSVP fill at ${rate}%. Push outreach and host amplification this week.`;
  }
  if (level === "medium") {
    return `RSVP fill at ${rate}%. On track but monitor. Confirm venue headcount.`;
  }
  return `RSVP fill at ${rate}%. Healthy pace. Focus on day-of logistics.`;
}

export const RISK_ORDER: Record<RiskLevel, number> = {
  high: 0,
  medium: 1,
  low: 2,
};
