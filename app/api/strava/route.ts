import { NextResponse } from "next/server";
import { sampleElevationGrid, isElevationGridAvailable } from "@/lib/elevation";

export const revalidate = 600; // 10 min cache

const TOKEN_URL = "https://www.strava.com/oauth/token";
const ACTIVITIES_URL = "https://www.strava.com/api/v3/athlete/activities";
const STREAMS_URL = (id: number) =>
  `https://www.strava.com/api/v3/activities/${id}/streams?keys=latlng,altitude,distance&key_by_type=true`;

async function getAccessToken(): Promise<string> {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const refreshToken = process.env.STRAVA_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Strava credentials");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);

  const data = await res.json();
  return data.access_token;
}

export async function GET() {
  try {
    const token = await getAccessToken();

    const res = await fetch(
      `${ACTIVITIES_URL}?per_page=7&type=Run`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) throw new Error(`Activities fetch failed: ${res.status}`);

    const activities = await res.json();

    const runs = activities.map((a: any) => ({
      id: a.id,
      name: a.name ?? "Run",
      distance: a.distance ?? 0,
      movingTime: a.moving_time ?? 0,
      elapsedTime: a.elapsed_time ?? 0,
      startDate: a.start_date_local ?? a.start_date ?? "",
      averageSpeed: a.average_speed ?? 0,
      calories: a.calories ?? 0,
      sufferScore: a.suffer_score ?? null,
      totalElevationGain: a.total_elevation_gain ?? 0,
      polyline: a.map?.summary_polyline ?? null,
      startLatlng: a.start_latlng ?? null,
    }));

    // Fetch streams (latlng + altitude) for the latest run only — for 3D map
    let latestStreams: { latlng: number[][]; altitude: number[] } | null = null;
    if (runs[0]?.id) {
      try {
        const streamRes = await fetch(STREAMS_URL(runs[0].id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (streamRes.ok) {
          const streamData = await streamRes.json();
          const latlng = streamData?.latlng?.data ?? null;
          const altitude = streamData?.altitude?.data ?? null;
          if (latlng && altitude && latlng.length === altitude.length) {
            latestStreams = { latlng, altitude };
          }
        }
      } catch {
        // Streams optional — fall back to polyline only
      }
    }

    // Sample real elevation grid from OS Terrain 50 (if available) for the
    // bounding box of the latest run, padded for context. This gives the
    // 3D map real London topography instead of IDW interpolation.
    let realElevationGrid: {
      elevations: number[];
      gridSize: number;
      bounds: { minLat: number; minLng: number; maxLat: number; maxLng: number };
    } | null = null;
    if (latestStreams && isElevationGridAvailable()) {
      const lats = latestStreams.latlng.map((p) => p[0]);
      const lngs = latestStreams.latlng.map((p) => p[1]);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      // Pad bounding box by 40% so terrain extends beyond the route
      const padLat = (maxLat - minLat) * 0.4;
      const padLng = (maxLng - minLng) * 0.4;
      const bounds = {
        minLat: minLat - padLat,
        maxLat: maxLat + padLat,
        minLng: minLng - padLng,
        maxLng: maxLng + padLng,
      };
      const sampled = sampleElevationGrid(bounds, 96);
      if (sampled) {
        realElevationGrid = {
          elevations: sampled.elevations,
          gridSize: sampled.gridSize,
          bounds: sampled.bounds,
        };
      }
    }

    // Compute aggregate stats
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyRuns = runs.filter(
      (r: any) => new Date(r.startDate) >= startOfWeek
    );
    const weeklyKm = weeklyRuns.reduce(
      (sum: number, r: any) => sum + r.distance / 1000,
      0
    );

    const lastRun = runs[0] ?? null;
    const lastRunKm = lastRun ? (lastRun.distance / 1000).toFixed(1) : "0";

    // Average pace in min/km (from average_speed in m/s)
    let avgPace = "--:--";
    if (lastRun && lastRun.averageSpeed > 0) {
      const paceSeconds = 1000 / lastRun.averageSpeed;
      const paceMin = Math.floor(paceSeconds / 60);
      const paceSec = Math.round(paceSeconds % 60);
      avgPace = `${paceMin}:${paceSec.toString().padStart(2, "0")}`;
    }

    return NextResponse.json({
      runs,
      latestStreams,
      realElevationGrid,
      stats: {
        lastRunKm,
        avgPace,
        weeklyKm: weeklyKm.toFixed(1),
        vo2max: null, // Not available from Strava API directly
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch running data" },
      { status: 500 }
    );
  }
}
