export type AddonType = "uploads" | "chat" | "videos";

export interface AddonPackEntry {
  type: AddonType;
  packKey: string;
  qty: number;
  bestValue: boolean;
}

export const ADDON_PACKS: AddonPackEntry[] = [
  { type: "videos",  packKey: "pack_3",   qty: 3,          bestValue: false },
  { type: "videos",  packKey: "pack_10",  qty: 10,         bestValue: false },
  { type: "videos",  packKey: "pack_25",  qty: 25,         bestValue: true  },
  { type: "uploads", packKey: "pack_25",  qty: 25,         bestValue: false },
  { type: "uploads", packKey: "pack_75",  qty: 75,         bestValue: false },
  { type: "uploads", packKey: "pack_200", qty: 200,        bestValue: true  },
  { type: "chat",    packKey: "pack_1m",  qty: 1_000_000,  bestValue: false },
  { type: "chat",    packKey: "pack_5m",  qty: 5_000_000,  bestValue: false },
  { type: "chat",    packKey: "pack_15m", qty: 15_000_000, bestValue: true  },
];

export function formatAddonQty(qty: number, type: AddonType): string {
  if (type === "chat") {
    if (qty >= 1_000_000) return `${qty / 1_000_000}M`;
    if (qty >= 1_000) return `${qty / 1_000}K`;
    return String(qty);
  }
  return String(qty);
}
