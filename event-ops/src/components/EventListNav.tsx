import type { CafeEvent } from "@/lib/types";
import { displayCity, formatEventDate, riskDotClass } from "@/lib/event-utils";
import { getRiskLevel } from "@/lib/risk";

interface EventListNavProps {
  events: CafeEvent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onSelectOverview: () => void;
}

export function EventListNav({
  events,
  selectedId,
  onSelect,
  onSelectOverview,
}: EventListNavProps) {
  const overviewActive = selectedId === null;

  return (
    <nav className="flex h-full flex-col">
      <div className="border-b border-gray-200 px-4 py-3">
        <p className="text-xs font-medium text-gray-400">Navigation</p>
      </div>
      <ul className="py-1">
        <li>
          <button
            type="button"
            onClick={onSelectOverview}
            className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left transition-colors ${
              overviewActive
                ? "border-gray-900 bg-gray-50"
                : "border-transparent hover:bg-gray-50/80"
            }`}
          >
            <span
              className={`text-sm ${
                overviewActive ? "font-medium text-gray-900" : "text-gray-800"
              }`}
            >
              Overview
            </span>
          </button>
        </li>
      </ul>
      <div className="border-b border-gray-200 px-4 py-3">
        <p className="text-xs font-medium text-gray-400">Events</p>
        <p className="font-mono text-sm text-gray-600">{events.length} total</p>
      </div>
      <ul className="flex-1 overflow-y-auto py-1">
        {events.map((event) => {
          const active = selectedId === event.id;
          const risk = getRiskLevel(event);

          return (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => onSelect(event.id)}
                className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left transition-colors ${
                  active
                    ? "border-gray-900 bg-gray-50"
                    : "border-transparent hover:bg-gray-50/80"
                }`}
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${riskDotClass(risk)}`}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm ${
                      active ? "font-medium text-gray-900" : "text-gray-800"
                    }`}
                  >
                    {displayCity(event.city)}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {formatEventDate(event.date, event.timezone)}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-xs text-gray-600">
                  {event.rsvps}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
