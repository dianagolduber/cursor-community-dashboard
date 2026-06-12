import type { CafeEvent } from "./types";
import { formatEventDateTime } from "./event-utils";

export function defaultFaqForEvent(event: CafeEvent): string {
  const when = formatEventDateTime(event.date, event.timezone);
  const hostLine =
    event.hosts.length > 0
      ? event.hosts.join(", ")
      : "your local hosts";

  return `Q: What time does ${event.name} start?
A: ${when} (${event.timezone}).

Q: Where is the event?
A: ${event.venue}${event.venueAddress ? `. ${event.venueAddress}` : ""}.

Q: Do I need a laptop?
A: Yes, bring your laptop if you plan to build or cowork.

Q: Is food or coffee included?
A: Cursor covers coffee and Cursor credits for builders. Details may vary by ticket type.

Q: Who should I contact with questions?
A: Reach out to ${hostLine} in this chat or via the Luma event page.

Q: What's the format?
A: ${event.format}. Drop in, cowork, demo, and connect with other Cursor users.`;
}

export function buildHostBriefing(event: CafeEvent): string {
  const when = formatEventDateTime(event.date, event.timezone);
  const hosts =
    event.hosts.length > 0 ? event.hosts.join(", ") : "TBD";

  return `Hey team. Host briefing for *${event.name}*

📍 *Venue:* ${event.venue}
👥 *Hosts:* ${hosts}
📅 *When:* ${when}
📊 *RSVPs:* ${event.rsvps} / ${event.capacity}
🎯 *Format:* ${event.format}

*Day-of FAQ (post in Luma chat):*
${event.dayOfFaq}

*Pre-event checklist:*
• Venue confirmed
• Cursor credits arranged
• Host briefing sent
• Day-of FAQ posted in Luma

Luma: ${event.lumaUrl}`;
}
