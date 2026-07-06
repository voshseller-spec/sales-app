// Run API (:3000) and Vite dev server (:5173, proxies /api) together.
import { spawn } from "node:child_process";

const procs = [
  spawn("node", ["server/index.js"], { stdio: "inherit" }),
  spawn("npx", ["vite"], { stdio: "inherit" }),
];
const kill = () => procs.forEach((p) => p.kill());
process.on("SIGINT", kill);
process.on("SIGTERM", kill);
