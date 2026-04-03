import { NextResponse } from "next/server";

const LOGIN_URL = "https://api.pocketcasts.com/user/login";
const HISTORY_URL = "https://api.pocketcasts.com/user/history";

async function getToken(): Promise<string> {
  const email = process.env.POCKETCASTS_EMAIL;
  const password = process.env.POCKETCASTS_PASSWORD;

  if (!email || !password) throw new Error("Missing Pocket Casts credentials");

  const res = await fetch(LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error(`Login failed: ${res.status}`);

  const data = await res.json();
  return data.token;
}

export async function GET() {
  try {
    const token = await getToken();

    const res = await fetch(HISTORY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);

    const data = await res.json();
    const episodes = (data.episodes ?? []).slice(0, 2).map((ep: any) => ({
      podcastTitle: ep.podcastTitle ?? ep.podcast_title ?? "Unknown Podcast",
      episodeTitle: ep.title ?? "Unknown Episode",
      duration: ep.duration ?? 0,
      playedUpTo: ep.playedUpTo ?? ep.played_up_to ?? 0,
      playingStatus: ep.playingStatus ?? ep.playing_status ?? 0,
      publishedAt: ep.published ?? ep.publishedDate ?? "",
    }));

    return NextResponse.json({ episodes });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch podcast data" },
      { status: 500 }
    );
  }
}
