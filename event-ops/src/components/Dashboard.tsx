"use client";

import { useEffect, useMemo, useState } from "react";
import type { CafeEvent, OpsChecklist } from "@/lib/types";
import { displayCity, sortEvents } from "@/lib/event-utils";
import { defaultFaqForEvent } from "@/lib/faq-templates";
import { loadEvents, saveEvents, updateEvent } from "@/lib/storage";
import { SummaryBar } from "./SummaryBar";
import { EventListNav } from "./EventListNav";
import { EventDetail } from "./EventDetail";
import { AddEventModal } from "./AddEventModal";
import { EventHealthOverview } from "./EventHealthOverview";

function hydrateEvents(events: CafeEvent[]): CafeEvent[] {
  return events.map((event) => {
    const normalized = {
      ...event,
      city: displayCity(event.city),
      dayOfFaq: event.dayOfFaq || defaultFaqForEvent(event),
    };
    return normalized;
  });
}

export function Dashboard() {
  const [events, setEvents] = useState<CafeEvent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEvents(hydrateEvents(loadEvents()));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveEvents(events);
  }, [events, ready]);

  const sortedEvents = useMemo(
    () => sortEvents(events, "date", "asc"),
    [events],
  );

  const selectedEvent =
    events.find((e) => e.id === selectedId) ?? null;

  function patchEvent(id: string, patch: Partial<CafeEvent>) {
    setEvents((prev) => updateEvent(prev, id, patch));
  }

  function handleUpdateChecklist(id: string, checklist: OpsChecklist) {
    patchEvent(id, { opsChecklist: checklist });
  }

  function handleUpdateFaq(id: string, faq: string) {
    patchEvent(id, { dayOfFaq: faq });
  }

  function handleBriefingSent(id: string) {
    const event = events.find((e) => e.id === id);
    if (!event) return;
    patchEvent(id, {
      opsChecklist: { ...event.opsChecklist, hostBriefingSent: true },
    });
  }

  function handleAddEvent(event: CafeEvent) {
    const hydrated = {
      ...event,
      dayOfFaq: event.dayOfFaq || defaultFaqForEvent(event),
    };
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === hydrated.id);
      if (exists) {
        return prev.map((e) => (e.id === hydrated.id ? hydrated : e));
      }
      return [...prev, hydrated];
    });
    setSelectedId(hydrated.id);
  }

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center text-base text-gray-500">
        Loading events…
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div>
          <h1 className="text-base font-semibold text-gray-900">
            Cursor Cafe Ops
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add event
        </button>
      </header>

      <SummaryBar events={events} />

      <div className="flex min-h-0 flex-1">
        <aside
          className={`w-full shrink-0 border-r border-gray-200 bg-white md:w-64 lg:w-72 ${
            selectedId !== null ? "hidden md:flex md:flex-col" : "flex flex-col"
          }`}
        >
          <EventListNav
            events={sortedEvents}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onSelectOverview={() => setSelectedId(null)}
          />
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto bg-white">
          {selectedEvent ? (
            <EventDetail
              event={selectedEvent}
              onBack={() => setSelectedId(null)}
              onUpdateChecklist={handleUpdateChecklist}
              onUpdateFaq={handleUpdateFaq}
              onBriefingSent={handleBriefingSent}
            />
          ) : (
            <EventHealthOverview
              events={events}
              onSelectEvent={setSelectedId}
            />
          )}
        </main>
      </div>

      {showAdd && (
        <AddEventModal
          onClose={() => setShowAdd(false)}
          onSave={handleAddEvent}
        />
      )}
    </div>
  );
}
