import type { CafeEvent } from "@/lib/types";

interface OverviewReadmeProps {
  events: CafeEvent[];
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-medium text-gray-400">{children}</p>
  );
}

export function OverviewReadme({ events }: OverviewReadmeProps) {
  const totalRsvps = events.reduce((sum, e) => sum + e.rsvps, 0);
  const continents = new Set(events.map((e) => e.continent)).size;

  return (
    <div className="mx-auto max-w-xl px-6 py-8 md:px-10 md:py-10">
      <h1 className="text-xl font-semibold text-gray-900">
        Cursor Cafe Event Ops
      </h1>

      <div className="mt-8">
        <Label>What this does</Label>
        <p className="text-base leading-relaxed text-gray-600">
          Tracks Cafe Cursor events in one place. Live Luma data, RSVP risk
          flags, ops checklists, day-of FAQs, and host briefings.
        </p>
      </div>

      <div className="mt-6">
        <Label>Right now</Label>
        <p className="text-base leading-relaxed text-gray-600">
          <span className="font-mono text-gray-800">{events.length}</span>{" "}
          events.{" "}
          <span className="font-mono text-gray-800">
            {totalRsvps.toLocaleString()}
          </span>{" "}
          RSVPs.{" "}
          <span className="font-mono text-gray-800">{continents}</span>{" "}
          continents. Select a city to open ops detail.
        </p>
      </div>

      <div className="mt-6">
        <Label>What it could be</Label>
        <p className="text-base leading-relaxed text-gray-600">
          The ops layer for 20 global cafes. Same playbook per city. Risk
          surfaced early. New events added by pasting a Luma URL.
        </p>
      </div>
    </div>
  );
}
