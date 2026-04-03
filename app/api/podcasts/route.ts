import { NextResponse } from "next/server";

const LOGIN_URL = "https://api.pocketcasts.com/user/login";
const HISTORY_URL = "https://api.pocketcasts.com/user/history";
const ITUNES_SEARCH = "https://itunes.apple.com/search";

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

async function getArtwork(podcastName: string): Promise<string | null> {
  try {
    const url = `${ITUNES_SEARCH}?term=${encodeURIComponent(podcastName)}&media=podcast&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0]?.artworkUrl100 ?? null;
  } catch {
    return null;
  }
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
    const raw = (data.episodes ?? []).slice(0, 2);

    // Fetch artwork in parallel
    const podcastNames: string[] = [...new Set(raw.map((ep: any) => ep.podcastTitle ?? ep.podcast_title ?? ""))] as string[];
    const artworkMap: Record<string, string | null> = {};
    await Promise.all(
      podcastNames.map(async (name) => {
        artworkMap[name] = await getArtwork(name);
      })
    );

    const episodes = raw.map((ep: any) => {
      const title = ep.podcastTitle ?? ep.podcast_title ?? "Unknown Podcast";
      return {
        podcastTitle: title,
        episodeTitle: ep.title ?? "Unknown Episode",
        duration: ep.duration ?? 0,
        playedUpTo: ep.playedUpTo ?? ep.played_up_to ?? 0,
        playingStatus: ep.playingStatus ?? ep.playing_status ?? 0,
        publishedAt: ep.published ?? ep.publishedDate ?? "",
        artwork: artworkMap[title] ?? null,
      };
    });

    return NextResponse.json({ episodes });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch podcast data" },
      { status: 500 }
    );
  }
}
