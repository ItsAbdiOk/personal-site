import { NextResponse } from "next/server";

const ANILIST_URL = "https://graphql.anilist.co";
const USERNAME = "TheBastard";

const CURRENT_QUERY = `
query {
  MediaListCollection(userName: "${USERNAME}", type: MANGA, status: CURRENT) {
    lists {
      entries {
        media {
          title { romaji english }
          coverImage { medium }
          chapters
        }
        progress
        updatedAt
      }
    }
  }
}
`;

const COMPLETED_QUERY = `
query {
  MediaListCollection(userName: "${USERNAME}", type: MANGA, status: COMPLETED, sort: UPDATED_TIME_DESC) {
    lists {
      entries {
        media {
          title { romaji english }
          coverImage { medium }
          chapters
        }
        progress
        updatedAt
      }
    }
  }
}
`;

async function queryAniList(query: string) {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`AniList responded ${res.status}`);
  return res.json();
}

export async function GET() {
  try {
    const [currentData, completedData] = await Promise.all([
      queryAniList(CURRENT_QUERY),
      queryAniList(COMPLETED_QUERY),
    ]);

    const currentEntries =
      currentData?.data?.MediaListCollection?.lists?.[0]?.entries ?? [];
    const completedEntries =
      completedData?.data?.MediaListCollection?.lists?.[0]?.entries ?? [];

    const toEntry = (e: any, status: string) => ({
      title: e.media.title.english || e.media.title.romaji,
      coverImage: e.media.coverImage.medium,
      totalChapters: e.media.chapters,
      progress: e.progress,
      updatedAt: e.updatedAt,
      status,
    });

    const all = [
      ...currentEntries.map((e: any) => toEntry(e, "current")),
      ...completedEntries.map((e: any) => toEntry(e, "completed")),
    ]
      .sort((a: any, b: any) => b.updatedAt - a.updatedAt)
      .slice(0, 3);

    return NextResponse.json({ entries: all });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch manga data" },
      { status: 500 }
    );
  }
}
