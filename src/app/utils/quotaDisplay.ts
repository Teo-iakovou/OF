export function formatRemaining(remaining: number | null): string {
  return remaining === null ? "Unlimited" : String(remaining);
}
