const fs = require("fs");
const path = require("path");

let cache = null;
let ver = "";

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function getPolicies() {
  if (!cache) {
    const base = path.resolve(__dirname);
    const platforms = loadJSON(path.join(base, "platforms.json"));
    const niches = loadJSON(path.join(base, "niches.json"));
    ver = String(platforms.version || niches.version || Date.now());
    cache = { platforms, niches };
  }
  return { ...cache, version: ver };
}

module.exports = { getPolicies };