"use client";

import { useState } from "react";

interface HostBriefingModalProps {
  message: string;
  onClose: () => void;
  onSent: () => void;
}

export function HostBriefingModal({
  message,
  onClose,
  onSent,
}: HostBriefingModalProps) {
  const [draft, setDraft] = useState(message);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/slack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: draft }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to send");
      }
      onSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-xl">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            Host briefing preview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review before sending to Slack
          </p>
        </div>
        <div className="px-5 py-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={14}
            className="w-full resize-y rounded-md border border-gray-200 px-3 py-2 font-mono text-xs leading-relaxed text-gray-800 focus:border-gray-400 focus:outline-none"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
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
            onClick={handleSend}
            disabled={sending}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send to Slack"}
          </button>
        </div>
      </div>
    </div>
  );
}
