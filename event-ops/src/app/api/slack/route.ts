import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "SLACK_WEBHOOK_URL is not configured" },
        { status: 500 },
      );
    }

    const body = (await request.json()) as { message?: string };
    if (!body.message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const slackResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: body.message }),
    });

    if (!slackResponse.ok) {
      return NextResponse.json(
        { error: "Slack webhook request failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send Slack message";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
