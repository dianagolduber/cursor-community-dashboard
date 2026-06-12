import type { CafeEvent } from "@/lib/types";
import { countBriefingsSent, countContinents } from "@/lib/event-utils";

interface SummaryBarProps {
  events: CafeEvent[];
}

export function SummaryBar({ events }: SummaryBarProps) {
  const totalRsvps = events.reduce((sum, e) => sum + e.rsvps, 0);

  const stats = [
    { label: "Events", value: events.length },
    { label: "RSVPs", value: totalRsvps.toLocaleString() },
    { label: "Continents", value: countContinents(events) },
    { label: "Briefings sent", value: countBriefingsSent(events) },
  ];

  return (
    <div className="flex items-center gap-6 overflow-x-auto border-b border-gray-200 bg-white px-4 py-2 sm:gap-10 sm:px-6">
      {stats.map((stat) => (
        <div key={stat.label} className="flex shrink-0 items-baseline gap-2">
          <span className="text-xs text-gray-400">{stat.label}</span>
          <span className="font-mono text-sm font-medium text-gray-700">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
