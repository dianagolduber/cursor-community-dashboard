import type { CafeEvent } from "@/lib/types";
import {
  displayCity,
  formatEventDate,
  getEventStatus,
  riskDotClass,
  sortEvents,
  statusLabel,
} from "@/lib/event-utils";
import { getFillRate, getRiskLabel, getRiskLevel } from "@/lib/risk";

interface EventHealthOverviewProps {
  events: CafeEvent[];
  onSelectEvent: (id: string) => void;
}

function RiskBadge({ event }: { event: CafeEvent }) {
  const risk = getRiskLevel(event);
  const colors = {
    high: "bg-red-50 text-red-700 ring-red-200",
    medium: "bg-amber-50 text-amber-700 ring-amber-200",
    low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${colors[risk]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${riskDotClass(risk)}`} />
      {getRiskLabel(risk)}
    </span>
  );
}

export function EventHealthOverview({
  events,
  onSelectEvent,
}: EventHealthOverviewProps) {
  const sorted = sortEvents(events, "risk", "asc");
  const highRisk = events.filter((e) => getRiskLevel(e) === "high").length;
  const totalRsvps = events.reduce((sum, e) => sum + e.rsvps, 0);
  const continents = new Set(events.map((e) => e.continent)).size;

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-xl font-semibold text-gray-900">Overview</h1>
        <p className="mt-3 text-base leading-relaxed text-gray-600">
          One place to track Cafe Cursor events worldwide. See which cities need
          attention, then click in to handle venue prep, host briefings, and
          day-of FAQs.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          Live RSVP data from Luma. Built to scale to 20 cafes. Add new events
          by pasting a Luma URL.
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-xs font-medium text-gray-400">Event health</h2>
        <p className="mt-1 text-sm text-gray-500">
          RSVP fill and risk per city. Red means low turnout and needs outreach.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          <span className="font-mono text-gray-700">{events.length}</span>{" "}
          events ·{" "}
          <span className="font-mono text-gray-700">
            {totalRsvps.toLocaleString()}
          </span>{" "}
          RSVPs ·{" "}
          <span className="font-mono text-gray-700">{continents}</span>{" "}
          continents
          {highRisk > 0 && (
            <span className="text-red-600">
              {" "}
              · {highRisk} need attention
            </span>
          )}
        </p>
      </div>

      <div className="space-y-2 md:hidden">
        {sorted.map((event) => {
          const fillPct = Math.round(getFillRate(event) * 100);
          const status = getEventStatus(event);

          return (
            <button
              key={event.id}
              type="button"
              onClick={() => onSelectEvent(event.id)}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-gray-900">
                  {displayCity(event.city)}
                </span>
                <RiskBadge event={event} />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                <span>{formatEventDate(event.date, event.timezone)}</span>
                <span className="font-mono">
                  {event.rsvps} RSVPs ({fillPct}% full)
                </span>
                <span>{statusLabel(status)}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-gray-200 md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">RSVPs</th>
              <th className="px-4 py-3">Fill</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((event) => {
              const fillPct = Math.round(getFillRate(event) * 100);
              const status = getEventStatus(event);

              return (
                <tr
                  key={event.id}
                  onClick={() => onSelectEvent(event.id)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {displayCity(event.city)}
                    </p>
                    <p className="text-xs text-gray-500">{event.country}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-700">
                    {formatEventDate(event.date, event.timezone)}
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-900">
                    {event.rsvps}
                    <span className="text-gray-400"> / {event.capacity}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${riskDotClass(getRiskLevel(event))}`}
                          style={{ width: `${Math.min(fillPct, 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-gray-500">
                        {fillPct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {statusLabel(status)}
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge event={event} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
