export type EventStatus = "upcoming" | "soon" | "live" | "done";
export type RiskLevel = "high" | "medium" | "low";

export interface TicketType {
  name: string;
  maxCapacity?: number;
  spotsRemaining?: number;
}

export interface OpsChecklist {
  venueConfirmed: boolean;
  cursorCreditsArranged: boolean;
  hostBriefingSent: boolean;
  dayOfFaqPosted: boolean;
}

export interface CafeEvent {
  id: string;
  lumaUrl: string;
  lumaSlug: string;
  name: string;
  city: string;
  country: string;
  continent: string;
  date: string;
  endDate?: string;
  venue: string;
  venueAddress?: string;
  hosts: string[];
  format: string;
  rsvps: number;
  capacity: number;
  ticketTypes: TicketType[];
  description: string;
  timezone: string;
  opsChecklist: OpsChecklist;
  dayOfFaq: string;
}

export type SortKey = "date" | "city" | "rsvps" | "risk";
export type SortDir = "asc" | "desc";
