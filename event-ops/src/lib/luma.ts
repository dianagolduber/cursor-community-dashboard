import type { CafeEvent, TicketType } from "./types";
import { displayCity, getContinent } from "./event-utils";
import { defaultFaqForEvent } from "./faq-templates";

interface LumaTicketType {
  name?: string;
  max_capacity?: number | null;
  spots_remaining?: number | null;
}

interface LumaPageData {
  event: {
    name: string;
    start_at: string;
    end_at?: string;
    timezone: string;
    url: string;
    geo_address_info?: {
      city?: string;
      country?: string;
      address?: string;
      city_state?: string;
      full_address?: string;
    };
  };
  hosts?: { name: string }[];
  guest_count?: number;
  ticket_count?: number;
  ticket_types?: LumaTicketType[];
  description_mirror?: ProseMirrorDoc | string;
}

interface ProseMirrorNode {
  type?: string;
  text?: string;
  content?: ProseMirrorNode[];
}

interface ProseMirrorDoc {
  type?: string;
  content?: ProseMirrorNode[];
}

function extractSlug(url: string): string {
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    const path = parsed.pathname.replace(/^\//, "").split("/")[0];
    if (path) return path;
  } catch {
    // fall through
  }
  return trimmed.replace(/^https?:\/\/(www\.)?luma\.com\//i, "").split("/")[0];
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function proseMirrorToText(node: ProseMirrorNode | ProseMirrorDoc): string {
  if ("text" in node && node.text) return node.text;
  if (!node.content?.length) return "";
  return node.content
    .map((child) => {
      if (child.type === "paragraph" || child.type === "heading") {
        return proseMirrorToText(child);
      }
      return proseMirrorToText(child);
    })
    .filter(Boolean)
    .join("\n");
}

function extractDescription(mirror: ProseMirrorDoc | string | undefined): string {
  if (!mirror) return "";
  if (typeof mirror === "string") return stripHtml(mirror);
  return proseMirrorToText(mirror).trim();
}

function inferCapacity(ticketTypes: TicketType[], rsvps: number): number {
  const summed = ticketTypes.reduce(
    (sum, t) => sum + (t.maxCapacity ?? 0),
    0,
  );
  if (summed > 0) return summed;
  return Math.max(Math.ceil(rsvps * 1.5), 50);
}

function inferFormat(description: string, ticketTypes: TicketType[]): string {
  const lower = description.toLowerCase();
  if (lower.includes("cowork") || lower.includes("co-working")) {
    return "Coworking day";
  }
  if (ticketTypes.length > 2) return "Multi-session drop-in";
  if (lower.includes("evening")) return "Evening session";
  return "Cafe Cursor meetup";
}

export function parseLumaHtml(html: string, inputUrl: string): CafeEvent {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  );
  if (!match) {
    throw new Error("Could not parse Luma page data");
  }

  const nextData = JSON.parse(match[1]) as {
    props?: { pageProps?: { initialData?: { data?: LumaPageData } } };
  };
  const data = nextData.props?.pageProps?.initialData?.data;
  if (!data?.event) {
    throw new Error("Luma event data not found on page");
  }

  const { event } = data;
  const slug = event.url || extractSlug(inputUrl);
  const ticketTypes: TicketType[] = (data.ticket_types ?? []).map((t) => ({
    name: t.name ?? "Ticket",
    maxCapacity: t.max_capacity ?? undefined,
    spotsRemaining: t.spots_remaining ?? undefined,
  }));

  const rsvps = data.ticket_count ?? data.guest_count ?? 0;
  const capacity = inferCapacity(ticketTypes, rsvps);
  const geo = event.geo_address_info ?? {};
  const rawCity = geo.city ?? "Unknown";
  const city = displayCity(rawCity);
  const country = geo.country ?? "Unknown";
  const description = extractDescription(data.description_mirror);

  const venue =
    geo.full_address ||
    geo.address ||
    (geo.city_state ? geo.city_state : `${city}, ${country}`);

  const draft: CafeEvent = {
    id: slug,
    lumaUrl: `https://luma.com/${slug}`,
    lumaSlug: slug,
    name: event.name,
    city,
    country,
    continent: getContinent(country),
    date: event.start_at,
    endDate: event.end_at,
    venue,
    venueAddress: geo.full_address || geo.address,
    hosts: (data.hosts ?? []).map((h) => h.name),
    format: inferFormat(description, ticketTypes),
    rsvps,
    capacity,
    ticketTypes,
    description,
    timezone: event.timezone,
    opsChecklist: {
      venueConfirmed: false,
      cursorCreditsArranged: false,
      hostBriefingSent: false,
      dayOfFaqPosted: false,
    },
    dayOfFaq: "",
  };

  draft.dayOfFaq = defaultFaqForEvent(draft);
  return draft;
}

export async function fetchLumaEvent(url: string): Promise<CafeEvent> {
  const slug = extractSlug(url);
  const lumaUrl = `https://luma.com/${slug}`;
  const response = await fetch(lumaUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; CursorCafeOps/1.0)",
      Accept: "text/html",
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Luma page (${response.status})`);
  }

  const html = await response.text();
  return parseLumaHtml(html, lumaUrl);
}

export { extractSlug };
