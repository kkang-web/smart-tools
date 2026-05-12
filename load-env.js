/**
 * .env → public/config.js 생성 스크립트
 * 실행: node load-env.js
 * 브라우저에서 window.__ENV__ 로 접근 가능
 */
const fs = require("fs");
const path = require("path");

// dotenv 없이 직접 파싱
const envPath = path.resolve(__dirname, ".env");
if (!fs.existsSync(envPath)) {
  console.error(".env 파일이 없습니다. .env.example 을 복사해 .env 를 만드세요.");
  process.exit(1);
}

const lines = fs.readFileSync(envPath, "utf-8").split("\n");
const env = {};
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx === -1) continue;
  const key = trimmed.slice(0, idx).trim();
  const val = trimmed.slice(idx + 1).trim();
  env[key] = val;
}

// 브라우저 노출용 — 민감 키는 여기서 제외
const PUBLIC_KEYS = ["APP_ENV", "APP_TITLE", "DATA_API_URL", "CHARTJS_CDN", "DATALABELS_CDN"];
const publicEnv = {};
for (const k of PUBLIC_KEYS) {
  if (env[k] !== undefined) publicEnv[k] = env[k];
}

const out = `/* 자동 생성 — 수정하지 마세요. load-env.js 를 실행하세요. */\nwindow.__ENV__ = ${JSON.stringify(publicEnv, null, 2)};\n`;

const outDir = path.resolve(__dirname, "public");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
fs.writeFileSync(path.join(outDir, "config.js"), out, "utf-8");
console.log("✓ public/config.js 생성 완료");
console.log(publicEnv);
