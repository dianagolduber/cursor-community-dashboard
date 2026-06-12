"use client";

import { useState } from "react";
import type { CafeEvent, OpsChecklist } from "@/lib/types";
import {
  displayCity,
  formatEventDateTime,
  getEventStatus,
  statusLabel,
} from "@/lib/event-utils";
import {
  getFillRate,
  getRiskLabel,
  getRiskLevel,
  getRiskNote,
} from "@/lib/risk";
import { buildHostBriefing } from "@/lib/faq-templates";
import { HostBriefingModal } from "./HostBriefingModal";

interface EventDetailProps {
  event: CafeEvent;
  onBack?: () => void;
  onUpdateChecklist: (id: string, checklist: OpsChecklist) => void;
  onUpdateFaq: (id: string, faq: string) => void;
  onBriefingSent: (id: string) => void;
}

const CHECKLIST_ITEMS: {
  key: keyof OpsChecklist;
  label: string;
}[] = [
  { key: "venueConfirmed", label: "Venue confirmed" },
  { key: "cursorCreditsArranged", label: "Cursor credits arranged" },
  { key: "hostBriefingSent", label: "Host briefing sent" },
  { key: "dayOfFaqPosted", label: "Day-of FAQ posted in Luma" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-xs font-medium tracking-wide text-gray-400">
      {children}
    </h3>
  );
}

function riskAlertStyles(level: ReturnType<typeof getRiskLevel>) {
  switch (level) {
    case "high":
      return "border-red-200 bg-red-50 text-red-900";
    case "medium":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "low":
      return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }
}

export function EventDetail({
  event,
  onBack,
  onUpdateChecklist,
  onUpdateFaq,
  onBriefingSent,
}: EventDetailProps) {
  const [copied, setCopied] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);

  const risk = getRiskLevel(event);
  const fillPct = Math.round(getFillRate(event) * 100);
  const status = getEventStatus(event);

  async function copyFaq() {
    await navigator.clipboard.writeText(event.dayOfFaq);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function toggleChecklist(key: keyof OpsChecklist) {
    onUpdateChecklist(event.id, {
      ...event.opsChecklist,
      [key]: !event.opsChecklist[key],
    });
  }

  return (
    <>
      <div className="mx-auto max-w-3xl px-6 py-8 md:px-10 md:py-10">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 text-sm text-gray-500 hover:text-gray-800 md:hidden"
          >
            ← All events
          </button>
        )}

        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {event.name}
          </h1>
          <p className="mt-1 text-base text-gray-500">
            {displayCity(event.city)}, {event.country}
          </p>
        </header>

        <div
          className={`mb-10 rounded-lg border px-5 py-4 ${riskAlertStyles(risk)}`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                risk === "high"
                  ? "bg-red-500"
                  : risk === "medium"
                    ? "bg-amber-500"
                    : "bg-emerald-500"
              }`}
            />
            <p className="text-sm font-semibold">{getRiskLabel(risk)}</p>
            <span className="text-sm opacity-70">· {fillPct}% RSVP fill</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed">{getRiskNote(event)}</p>
        </div>

        <section className="mb-10 border-b border-gray-100 pb-10">
          <SectionLabel>Event info</SectionLabel>
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">Venue</dt>
              <dd className="mt-1 text-base text-gray-900">{event.venue}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Format</dt>
              <dd className="mt-1 text-base text-gray-900">{event.format}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Date</dt>
              <dd className="mt-1 font-mono text-base text-gray-900">
                {formatEventDateTime(event.date, event.timezone)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Status</dt>
              <dd className="mt-1 text-base text-gray-900">
                {statusLabel(status)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-gray-500">Hosts</dt>
              <dd className="mt-1 text-base text-gray-900">
                {event.hosts.join(", ")}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm text-gray-500">Luma</dt>
              <dd className="mt-1">
                <a
                  href={event.lumaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-gray-700 underline decoration-gray-300 underline-offset-2 hover:text-gray-900"
                >
                  {event.lumaUrl}
                </a>
              </dd>
            </div>
          </dl>
        </section>

        <section className="mb-10 border-b border-gray-100 pb-10">
          <SectionLabel>Risk & RSVPs</SectionLabel>
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-3xl font-medium text-gray-900">
              {event.rsvps}
              <span className="text-lg font-normal text-gray-400">
                {" "}
                / {event.capacity}
              </span>
            </p>
            <p className="font-mono text-sm text-gray-500">{fillPct}% filled</p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${
                risk === "high"
                  ? "bg-red-500"
                  : risk === "medium"
                    ? "bg-amber-400"
                    : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(fillPct, 100)}%` }}
            />
          </div>
          {event.ticketTypes.length > 0 && (
            <ul className="mt-5 space-y-2">
              {event.ticketTypes.map((ticket) => (
                <li
                  key={ticket.name}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span>{ticket.name}</span>
                  {ticket.maxCapacity != null && (
                    <span className="font-mono text-gray-500">
                      {ticket.spotsRemaining != null
                        ? `${ticket.spotsRemaining} left`
                        : `cap ${ticket.maxCapacity}`}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mb-10 border-b border-gray-100 pb-10">
          <SectionLabel>Prep checklist</SectionLabel>
          <ul className="space-y-3">
            {CHECKLIST_ITEMS.map((item) => (
              <li key={item.key}>
                <label className="flex cursor-pointer items-center gap-3 text-base text-gray-800">
                  <input
                    type="checkbox"
                    checked={event.opsChecklist[item.key]}
                    onChange={() => toggleChecklist(item.key)}
                    className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-400"
                  />
                  {item.label}
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 border-b border-gray-100 pb-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-medium tracking-wide text-gray-400">
              Day-of FAQ
            </h3>
            <button
              type="button"
              onClick={copyFaq}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {copied ? "Copied!" : "Copy to clipboard"}
            </button>
          </div>
          <textarea
            value={event.dayOfFaq}
            onChange={(e) => onUpdateFaq(event.id, e.target.value)}
            rows={12}
            className="w-full resize-y rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-3 font-mono text-sm leading-relaxed text-gray-800 focus:border-gray-300 focus:bg-white focus:outline-none"
          />
        </section>

        <section>
          <SectionLabel>Send briefing</SectionLabel>
          <p className="mb-4 text-base leading-relaxed text-gray-600">
            Generate a Slack-ready host briefing from this event&apos;s venue,
            hosts, date, and FAQ.
          </p>
          <button
            type="button"
            onClick={() => setShowBriefing(true)}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Generate host briefing
          </button>
        </section>
      </div>

      {showBriefing && (
        <HostBriefingModal
          message={buildHostBriefing(event)}
          onClose={() => setShowBriefing(false)}
          onSent={() => {
            onBriefingSent(event.id);
            setShowBriefing(false);
          }}
        />
      )}
    </>
  );
}
