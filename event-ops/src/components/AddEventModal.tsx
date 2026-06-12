"use client";

import { useState } from "react";
import type { CafeEvent } from "@/lib/types";

interface AddEventModalProps {
  onClose: () => void;
  onSave: (event: CafeEvent) => void;
}

export function AddEventModal({ onClose, onSave }: AddEventModalProps) {
  const [url, setUrl] = useState("");
  const [cityOverride, setCityOverride] = useState("");
  const [parsed, setParsed] = useState<CafeEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleParse() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setParsed(null);
    try {
      const res = await fetch("/api/parse-luma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = (await res.json()) as {
        event?: CafeEvent;
        error?: string;
      };
      if (!res.ok || !data.event) {
        throw new Error(data.error ?? "Failed to parse event");
      }
      const event = data.event;
      if (cityOverride.trim()) {
        event.city = cityOverride.trim();
      }
      setParsed(event);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse");
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!parsed) return;
    onSave(parsed);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-xl">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">Add event</h2>
          <p className="mt-1 text-sm text-gray-500">
            Paste a Luma URL to auto-parse event details
          </p>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Luma URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://luma.com/cursor-292r"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              City override (optional)
            </label>
            <input
              type="text"
              value={cityOverride}
              onChange={(e) => setCityOverride(e.target.value)}
              placeholder="Oslo"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-gray-400 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleParse}
            disabled={loading || !url.trim()}
            className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? "Parsing…" : "Parse Luma page"}
          </button>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {parsed && (
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
              <p className="font-medium text-gray-900">{parsed.name}</p>
              <p className="mt-1 text-gray-600">
                {parsed.city}, {parsed.country}
              </p>
              <p className="mt-1 font-mono text-xs text-gray-600">
                {parsed.rsvps} RSVPs · {parsed.hosts.join(", ")}
              </p>
              <p className="mt-2 text-xs text-gray-500">{parsed.venue}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!parsed}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            Confirm & save
          </button>
        </div>
      </div>
    </div>
  );
}
