import { usePlanInfo } from "@/app/dashboard/PlanContext";

export type ChatAvailabilityReason = "NO_PACKAGE" | "FACE_NOT_ENROLLED";

export type ChatAvailability =
  | { available: true }
  | { available: false; reason: ChatAvailabilityReason };

export function useChatAvailability(): ChatAvailability {
  const { hasActiveInstance, data: planData, loading } = usePlanInfo();

  // Optimistic during initial load to avoid flicker
  if (loading) return { available: true };

  if (!hasActiveInstance || !planData) {
    return { available: false, reason: "NO_PACKAGE" };
  }

  if (planData.faceEnrolled === false) {
    return { available: false, reason: "FACE_NOT_ENROLLED" };
  }

  return { available: true };
}
