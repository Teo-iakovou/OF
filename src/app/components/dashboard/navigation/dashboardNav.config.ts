import type { LucideIcon } from "lucide-react";
import { Home, UploadCloud, Video, Settings, History, CreditCard, User } from "lucide-react";

export type DashboardNavPlacement = "desktop" | "mobile";
export type DashboardNavItemType = "route" | "action";
export type DashboardSettingsSection = "account" | "usage" | "billing" | "history";

export type DashboardNavItem = {
  key: string;
  label: string;
  labelKey?: "overview" | "upload" | "talkingHead";
  icon: LucideIcon;
  type: DashboardNavItemType;
  href?: string;
  action?: "openSettings";
  actionSection?: DashboardSettingsSection;
  showDesktop: boolean;
  showMobile: boolean;
  topLevel: boolean;
  settingsOnly: boolean;
};

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  {
    key: "overview",
    label: "Overview",
    labelKey: "overview",
    icon: Home,
    type: "route",
    href: "/dashboard",
    showDesktop: true,
    showMobile: true,
    topLevel: true,
    settingsOnly: false,
  },
  {
    key: "upload",
    label: "Upload Content",
    labelKey: "upload",
    icon: UploadCloud,
    type: "route",
    href: "/dashboard/upload",
    showDesktop: true,
    showMobile: true,
    topLevel: true,
    settingsOnly: false,
  },
  {
    key: "talking-head",
    label: "AI Video Avatar",
    labelKey: "talkingHead",
    icon: Video,
    type: "route",
    href: "/dashboard/talking-head",
    showDesktop: true,
    showMobile: true,
    topLevel: true,
    settingsOnly: false,
  },
  {
    key: "settings",
    label: "Settings",
    icon: Settings,
    type: "action",
    action: "openSettings",
    actionSection: "account",
    showDesktop: false,
    showMobile: true,
    topLevel: true,
    settingsOnly: false,
  },
  {
    key: "history",
    label: "Upload History",
    icon: History,
    type: "route",
    href: "/dashboard/history",
    showDesktop: false,
    showMobile: false,
    topLevel: false,
    settingsOnly: true,
  },
  {
    key: "account",
    label: "Account Info",
    icon: User,
    type: "route",
    href: "/dashboard/account",
    showDesktop: false,
    showMobile: false,
    topLevel: false,
    settingsOnly: true,
  },
  {
    key: "billing",
    label: "Plan & Billing",
    icon: CreditCard,
    type: "route",
    href: "/dashboard/billing",
    showDesktop: false,
    showMobile: false,
    topLevel: false,
    settingsOnly: true,
  },
];

export function getTopLevelDashboardNavItems(placement: DashboardNavPlacement) {
  return DASHBOARD_NAV_ITEMS.filter((item) => {
    if (!item.topLevel) return false;
    return placement === "desktop" ? item.showDesktop : item.showMobile;
  });
}

