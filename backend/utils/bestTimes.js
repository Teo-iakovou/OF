const moment = require("moment-timezone");
const { getPolicies } = require("../policies/loader");

function parseWindow(win) {
  const [s, e] = win.split("-");
  return { start: s, end: e };
}
function isWeekend(dayIdx) { return dayIdx === 0 || dayIdx === 6; }

function bestTimesV1(platformKey, tz = "Europe/Athens", date = new Date()) {
  const { platforms } = getPolicies();
  const p = platforms[String(platformKey || "").toLowerCase()];
  if (!p) return [];
  const dow = moment.tz(date, tz).day();
  const bucket = isWeekend(dow) ? "weekend" : "weekday";
  const wins = p.bestTimeWindowsLocal?.[bucket] || [];
  return wins.map(parseWindow).map(w => [w.start, w.end]); // [["18:00","21:00"], ...]
}

module.exports = { bestTimesV1 };