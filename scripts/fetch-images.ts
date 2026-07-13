import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const UA = "ZelligeTravelDemo/1.0 (https://github.com/Mukela12; demo build)";
const OUT = join(process.cwd(), "public", "images");
mkdirSync(OUT, { recursive: true });

// image key -> Commons search term (targeted at the real landmark)
const TERMS: Record<string, string> = {
  morocco: "Aït Benhaddou Morocco kasbah",
  marrakech: "Koutoubia Marrakech",
  fes: "Fes el Bali medina rooftops",
  chefchaouen: "Chefchaouen blue medina",
  sahara: "Erg Chebbi dunes Merzouga",
  "desert-camp": "Erg Chebbi desert camp Morocco",
  "ait-benhaddou": "Ait Benhaddou ksar",
  "atlas-mountains": "High Atlas mountains Morocco",
  majorelle: "Jardin Majorelle Marrakech",
  "bahia-palace": "Bahia Palace Marrakech",
  koutoubia: "Koutoubia mosque Marrakech",
  "jemaa-el-fnaa": "Jemaa el-Fnaa Marrakech",
  "todra-gorge": "Todra Gorge Morocco",
  tannery: "Chouara tannery Fes",
  "riad-courtyard": "Riad Marrakech courtyard",
  ourika: "Ourika Valley Morocco",
  toubkal: "Imlil Toubkal Morocco village",
};

type Cand = { title: string; url: string; w: number; h: number; mime: string };

async function candidates(term: string): Promise<Cand[]> {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.search = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `${term} filetype:bitmap`,
    gsrnamespace: "6",
    gsrlimit: "12",
    prop: "imageinfo",
    iiprop: "url|size|mime",
    iiurlwidth: "1600",
  }).toString();
  const res = await fetch(api, { headers: { "User-Agent": UA } });
  if (!res.ok) return [];
  const data: any = await res.json();
  const pages = data?.query?.pages ?? {};
  const out: Cand[] = [];
  for (const k of Object.keys(pages)) {
    const ii = pages[k]?.imageinfo?.[0];
    if (!ii) continue;
    out.push({
      title: pages[k].title,
      url: ii.thumburl ?? ii.url,
      w: ii.thumbwidth ?? ii.width,
      h: ii.thumbheight ?? ii.height,
      mime: ii.mime,
    });
  }
  return out;
}

function pick(cands: Cand[]): Cand | null {
  const ok = cands.filter(
    (c) => c.mime === "image/jpeg" && c.w >= 1200 && c.w > c.h * 1.25 && !/\.svg/i.test(c.title),
  );
  const pool = ok.length ? ok : cands.filter((c) => c.mime === "image/jpeg");
  if (!pool.length) return null;
  // prefer landscape close to 3:2, largest
  return pool.sort((a, b) => Math.abs(a.w / a.h - 1.5) - Math.abs(b.w / b.h - 1.5) || b.w - a.w)[0];
}

async function download(url: string, dest: string) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  return buf.length;
}

async function main() {
  const results: string[] = [];
  for (const [key, term] of Object.entries(TERMS)) {
    try {
      const cands = await candidates(term);
      const chosen = pick(cands);
      if (!chosen) {
        results.push(`✗ ${key}: no candidate`);
        continue;
      }
      const bytes = await download(chosen.url, join(OUT, `${key}.jpg`));
      results.push(`✓ ${key.padEnd(16)} ${chosen.w}x${chosen.h}  ${(bytes / 1024).toFixed(0)}KB  ${chosen.title.replace("File:", "")}`);
    } catch (e: any) {
      results.push(`✗ ${key}: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 350)); // be polite to Commons
  }
  console.log(results.join("\n"));
}

main();
