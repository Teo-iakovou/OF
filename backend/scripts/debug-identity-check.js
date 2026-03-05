const BASE_URL = process.env.DEBUG_BASE_URL || "http://localhost:5001";
const COOKIE_HEADER = process.env.DEBUG_COOKIE || "";

async function fetchJson(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: COOKIE_HEADER ? { cookie: COOKIE_HEADER } : {},
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { ok: res.ok, status: res.status, data };
}

async function main() {
  const whoami = await fetchJson("/api/debug/whoami");
  const check = await fetchJson("/api/user/check-package");

  const whoamiData = whoami.data && typeof whoami.data === "object" ? whoami.data : {};
  const checkData = check.data && typeof check.data === "object" ? check.data : {};

  const requestId =
    whoamiData.requestId ||
    checkData.requestId ||
    (checkData && checkData.requestId) ||
    null;

  console.log("[identity-check]", {
    requestId,
    whoamiStatus: whoami.status,
    checkStatus: check.status,
    userId: whoamiData.userId || null,
    userEmail: whoamiData.userEmail || null,
    activePackageInstanceId: whoamiData.activePackageInstanceId || null,
  });

  if (!whoami.ok || !check.ok) {
    console.log("[identity-check:whoami]", whoami.data);
    console.log("[identity-check:check-package]", check.data);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[identity-check:error]", err?.message || err);
  process.exit(1);
});
