// Tiny JSON-file persistence. Good enough for the MVP; swap for
// Postgres/Supabase without touching route code (routes only use the API below).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "..", "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const defaults = () => ({
  user: {
    plan: "free", // free | creator | pro
    rendersUsedThisMonth: 0,
  },
  renders: [], // completed + in-flight render jobs, newest first
  performanceLogs: {}, // renderId -> { views, ctr, spend, notes, loggedAt }
});

let state = defaults();

export function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      state = { ...defaults(), ...JSON.parse(fs.readFileSync(DB_FILE, "utf8")) };
    }
  } catch (err) {
    console.warn("db: could not load, starting fresh:", err.message);
    state = defaults();
  }
  return state;
}

let saveTimer = null;
export function saveDb() {
  // Debounced write — render progress ticks call this frequently.
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
    } catch (err) {
      console.warn("db: save failed:", err.message);
    }
  }, 250);
}

export function db() {
  return state;
}
