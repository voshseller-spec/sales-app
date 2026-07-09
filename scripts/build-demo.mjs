// Build the single-file demo: vite build with the in-browser API shim, then
// inline the JS + CSS into one self-contained HTML fragment (no external
// requests — suitable for any static host or a Claude Artifact).
import { execSync } from "node:child_process";
import fs from "node:fs";

execSync("npx vite build", { stdio: "inherit", env: { ...process.env, VITE_DEMO: "1" } });

const html = fs.readFileSync("dist-demo/index.html", "utf8");
const jsFile = html.match(/src="\/assets\/([^"]+\.js)"/)?.[1];
const cssFile = html.match(/href="\/assets\/([^"]+\.css)"/)?.[1];
if (!jsFile || !cssFile) throw new Error("Could not locate built assets in dist-demo/index.html");

const js = fs.readFileSync(`dist-demo/assets/${jsFile}`, "utf8").replaceAll("</script", "<\\/script");
const css = fs.readFileSync(`dist-demo/assets/${cssFile}`, "utf8");

const out = `<title>TrendForge UGC — Demo</title>
<style>${css}</style>
<div id="root"></div>
<script type="module">${js}</script>
`;

fs.writeFileSync("dist-demo/trendforge-demo.html", out);
console.log(`dist-demo/trendforge-demo.html written (${Math.round(out.length / 1024)} KB)`);
