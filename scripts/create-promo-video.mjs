#!/usr/bin/env node
/**
 * Records Valor website walkthrough and composes social-media promo videos.
 * Outputs: promo/output/valor-promo-landscape.mp4 (16:9) and valor-promo-vertical.mp4 (9:16)
 */

import { chromium } from "playwright";
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const BASE_URL = process.env.PROMO_BASE_URL ?? "http://localhost:3000";
const OUT_DIR = join(process.cwd(), "promo");
const RAW_DIR = join(OUT_DIR, "raw");
const OUTPUT_DIR = join(OUT_DIR, "output");
const ASSETS_DIR = join(OUT_DIR, "assets");

const FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf";
const BRAND = "Valor";
const TAGLINE = "Interior Design & Decoration";
const ACCENT = "8b6d4d";

function run(cmd) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function smoothScroll(page, distance, steps = 40) {
  const step = distance / steps;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, step);
    await sleep(35);
  }
}

async function recordWebsite() {
  mkdirSync(RAW_DIR, { recursive: true });

  for (const f of readdirSync(RAW_DIR).filter((f) => f.endsWith(".webm"))) {
    unlinkSync(join(RAW_DIR, f));
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: RAW_DIR, size: { width: 1920, height: 1080 } },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  // Homepage hero + scroll
  await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle", timeout: 60000 });
  await sleep(2500);
  await smoothScroll(page, 1800);
  await sleep(1500);
  await smoothScroll(page, 1800);
  await sleep(1500);
  await smoothScroll(page, 1800);
  await sleep(1200);

  // Work portfolio
  await page.goto(`${BASE_URL}/en/work`, { waitUntil: "networkidle", timeout: 60000 });
  await sleep(2000);
  await smoothScroll(page, 1200);
  await sleep(1500);

  // First project detail
  const projectLink = page.locator('a[href*="/en/work/"]').first();
  if (await projectLink.count()) {
    await projectLink.click();
    await page.waitForLoadState("networkidle");
    await sleep(2000);
    await smoothScroll(page, 1000);
    await sleep(1500);
  }

  // Services
  await page.goto(`${BASE_URL}/en/services`, { waitUntil: "networkidle", timeout: 60000 });
  await sleep(2500);
  await smoothScroll(page, 800);
  await sleep(1500);

  // Contact CTA
  await page.goto(`${BASE_URL}/en/contact`, { waitUntil: "networkidle", timeout: 60000 });
  await sleep(2500);

  const video = page.video();
  await context.close();
  await browser.close();

  const webmPath = await video.path();
  const rawMp4 = join(RAW_DIR, "walkthrough.mp4");
  run(
    `ffmpeg -y -i "${webmPath}" -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -an "${rawMp4}"`
  );
  return rawMp4;
}

function createAmbientMusic(path, durationSec) {
  const fadeOut = Math.max(0, durationSec - 3);
  run(
    `ffmpeg -y ` +
      `-f lavfi -i "sine=frequency=196:duration=${durationSec}" ` +
      `-f lavfi -i "sine=frequency=262:duration=${durationSec}" ` +
      `-f lavfi -i "sine=frequency=330:duration=${durationSec}" ` +
      `-filter_complex "[0:a][1:a][2:a]amix=inputs=3:duration=first:dropout_transition=2,volume=0.06,afade=t=in:st=0:d=2,afade=t=out:st=${fadeOut}:d=3[aout]" ` +
      `-map "[aout]" -t ${durationSec} "${path}"`
  );
}

function getDuration(file) {
  const out = execSync(
    `ffprobe -v error -show_entries format=duration -of csv=p=0 "${file}"`,
    { encoding: "utf8" }
  ).trim();
  return parseFloat(out);
}

function buildIntro(duration = 3) {
  const intro = join(RAW_DIR, "intro.mp4");
  run(
    `ffmpeg -y -f lavfi -i color=c=0x1a1a1a:s=1920x1080:d=${duration} ` +
      `-vf "drawtext=fontfile='${FONT}':text='${BRAND}':fontsize=96:fontcolor=white:x=(w-text_w)/2:y=(h/2)-80,` +
      `drawtext=fontfile='${FONT}':text='${TAGLINE}':fontsize=42:fontcolor=0x${ACCENT}:x=(w-text_w)/2:y=(h/2)+30,` +
      `fade=t=in:st=0:d=0.8,fade=t=out:st=${duration - 0.8}:d=0.8" ` +
      `-c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -t ${duration} "${intro}"`
  );
  return intro;
}

function buildOutro(duration = 3) {
  const outro = join(RAW_DIR, "outro.mp4");
  run(
    `ffmpeg -y -f lavfi -i color=c=0x1a1a1a:s=1920x1080:d=${duration} ` +
      `-vf "drawtext=fontfile='${FONT}':text='Elevate Your Home':fontsize=64:fontcolor=white:x=(w-text_w)/2:y=(h/2)-60,` +
      `drawtext=fontfile='${FONT}':text='Explore Our Collection':fontsize=38:fontcolor=0x${ACCENT}:x=(w-text_w)/2:y=(h/2)+30,` +
      `fade=t=in:st=0:d=0.6,fade=t=out:st=${duration - 0.8}:d=0.8" ` +
      `-c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -t ${duration} "${outro}"`
  );
  return outro;
}

function composeLandscape(walkthrough, intro, outro, music) {
  const landscape = join(OUTPUT_DIR, "valor-promo-landscape.mp4");
  const listFile = join(RAW_DIR, "concat.txt");
  const concatSrc = join(RAW_DIR, "concat-nosound.mp4");

  execSync(
    `cat > "${listFile}" << 'EOF'\nfile '${intro}'\nfile '${walkthrough}'\nfile '${outro}'\nEOF`
  );

  run(
    `ffmpeg -y -f concat -safe 0 -i "${listFile}" -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -an "${concatSrc}"`
  );

  const totalDur = getDuration(concatSrc);
  run(
    `ffmpeg -y -i "${concatSrc}" -i "${music}" ` +
      `-filter_complex "[1:a]atrim=0:${totalDur},asetpts=PTS-STARTPTS[a]" ` +
      `-map 0:v -map "[a]" -c:v copy -c:a aac -b:a 128k -shortest "${landscape}"`
  );
  return landscape;
}

function buildVertical(landscape) {
  const vertical = join(OUTPUT_DIR, "valor-promo-vertical.mp4");
  // Scale to 9:16 height then center-crop width for Reels/TikTok/Stories
  run(
    `ffmpeg -y -i "${landscape}" ` +
      `-vf "scale=-2:1920,crop=1080:1920:(iw-1080)/2:0,setsar=1" ` +
      `-c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -c:a copy "${vertical}"`
  );
  return vertical;
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  mkdirSync(ASSETS_DIR, { recursive: true });

  console.log("Recording website walkthrough...");
  const walkthrough = await recordWebsite();

  console.log("Building intro/outro...");
  const intro = buildIntro(3);
  const outro = buildOutro(3);

  const totalApprox =
    getDuration(intro) + getDuration(walkthrough) + getDuration(outro) + 1;
  const music = join(ASSETS_DIR, "ambient.mp3");
  if (!existsSync(music)) {
    console.log("Generating ambient soundtrack...");
    createAmbientMusic(music, Math.ceil(totalApprox));
  }

  console.log("Composing landscape promo...");
  const landscape = composeLandscape(walkthrough, intro, outro, music);

  console.log("Creating vertical (9:16) version...");
  const vertical = buildVertical(landscape);

  console.log("\nDone!");
  console.log(`  Landscape (16:9): ${landscape}`);
  console.log(`  Vertical (9:16):    ${vertical}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
