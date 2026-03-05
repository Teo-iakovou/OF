export function getRemaining(
  baseLimit: number | null | undefined,
  addons: number | null | undefined,
  used: number | null | undefined
): number | null {
  if (baseLimit === 0) return null;
  if (typeof baseLimit !== "number") return null;
  const addonsValue = typeof addons === "number" ? addons : 0;
  const usedValue = typeof used === "number" ? used : 0;
  return Math.max(0, baseLimit + addonsValue - usedValue);
}
