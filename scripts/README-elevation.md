# Real London Elevation Data (OS Terrain 50)

The 3D Strava map on `/life` uses real London topography from
**OS Terrain 50** (Ordnance Survey, Open Government License v3).

## One-time setup

### 1. Download OS Terrain 50

1. Go to https://osdatahub.os.uk/downloads/open/Terrain50
2. Click **Download**
3. Choose:
   - **Data format:** ASCII Grid (`.asc`)
   - **Area:** All GB (or just the tile that covers your runs — for London that's tile **TQ**)
4. You'll get a zip file like `terr50_gagg_gb.zip`
5. Extract it somewhere on your machine, e.g. `~/Downloads/os-terrain-50/`

The structure inside looks like `data/<tile>/<sub-tile>.asc` — many small `.asc`
files, each covering a 10km × 10km square.

### 2. Run the conversion script

```bash
bun scripts/convert-os-terrain-50.ts <input-dir> [output-path] [bbox]
```

For all of central London (recommended):

```bash
bun scripts/convert-os-terrain-50.ts \
  ~/Downloads/os-terrain-50/data \
  public/data/london-elevation.json \
  "51.45,-0.25,51.60,-0.05"
```

The bounding box format is `minLat,minLng,maxLat,maxLng`. The example above
covers central London (Camden, City, Westminster, Lambeth, Southwark).

If you want a smaller / larger area, adjust the bbox:
- Tighter (just Camden / Bloomsbury): `51.51,-0.16,51.56,-0.10`
- All of Greater London: `51.28,-0.51,51.69,0.33`

The script will output the JSON size at the end. Aim for under 5 MB —
larger files slow down the API.

### 3. Commit and push

```bash
git add public/data/london-elevation.json
git commit -m "data: add OS Terrain 50 London elevation grid"
git push
```

The Strava API route will automatically detect the file and use it for
real elevation data on the 3D map.

## How it works

1. The conversion script parses the OS Terrain 50 ASCII grid (in British
   National Grid coordinates, EPSG:27700) and packs the elevations into
   a single JSON file with Int16 storage in decimeters.
2. At request time, `/api/strava` loads the JSON, computes the bounding box
   of your latest run, and samples a 96×96 elevation grid covering that area
   plus a 40% padding margin.
3. The grid is sent to the client and used by `Route3D` to build the
   topographic terrain mesh and extract marching-squares contour lines.

If `public/data/london-elevation.json` doesn't exist, the system falls back
to IDW interpolation from the route's altitude stream (less accurate but
self-contained).

## License

OS Terrain 50 is released under the Open Government License v3, which
allows free use including commercial. You must attribute Ordnance Survey
when displaying the data publicly. The site footer or an "About" page
should include something like:

> Elevation data: © Crown copyright and database rights, Ordnance Survey
> (OS Terrain 50, OGL v3).

See https://www.ordnancesurvey.co.uk/business-government/licensing-agreements/open-data-licensing
for the full license terms.
