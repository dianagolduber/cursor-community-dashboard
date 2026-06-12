import { NextResponse } from "next/server";
import { fetchLumaEvent } from "@/lib/luma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: string };
    if (!body.url?.trim()) {
      return NextResponse.json({ error: "Luma URL is required" }, { status: 400 });
    }

    const event = await fetchLumaEvent(body.url.trim());
    return NextResponse.json({ event });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to parse Luma URL";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
