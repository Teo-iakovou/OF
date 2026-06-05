"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  checkUserPackage,
  fetchActivePackageInstances,
  type PackageInstanceSummary,
  type UserPackageResponse,
} from "@/app/utils/api";
import type { ResultDoc } from "@/app/types/analysis";

type UseOverviewModelOptions = {
  enabled: boolean;
  planLoading?: boolean;
  planData?: UserPackageResponse | null;
  hasActiveInstance?: boolean;
  isMissingActiveInstance?: boolean;
  isNewUser?: boolean;
};

type OverviewModelState = {
  ready: boolean;
  coreLoading: boolean;
  coreError: string | null;
  planData: UserPackageResponse | null;
  hasActiveInstance: boolean;
  isMissingActiveInstance: boolean;
  isNewUser: boolean;
  instances: PackageInstanceSummary[];
  instancesLoading: boolean;
  instancesError: string | null;
  latestResult: ResultDoc | null;
  latestLoading: boolean;
};

const INITIAL_STATE: OverviewModelState = {
  ready: false,
  coreLoading: true,
  coreError: null,
  planData: null,
  hasActiveInstance: false,
  isMissingActiveInstance: false,
  isNewUser: false,
  instances: [],
  instancesLoading: false,
  instancesError: null,
  latestResult: null,
  latestLoading: false,
};

function getInitialState({
  planLoading = true,
  planData = null,
  hasActiveInstance = false,
  isMissingActiveInstance = false,
  isNewUser = false,
}: UseOverviewModelOptions): OverviewModelState {
  if (planLoading) return INITIAL_STATE;
  return {
    ...INITIAL_STATE,
    ready: true,
    coreLoading: false,
    planData,
    hasActiveInstance,
    isMissingActiveInstance,
    isNewUser,
  };
}

export function useOverviewModel({
  enabled,
  planLoading = true,
  planData: contextPlanData = null,
  hasActiveInstance: contextHasActiveInstance = false,
  isMissingActiveInstance: contextIsMissingActiveInstance = false,
  isNewUser: contextIsNewUser = false,
}: UseOverviewModelOptions) {
  const [state, setState] = useState<OverviewModelState>(() =>
    getInitialState({
      enabled,
      planLoading,
      planData: contextPlanData,
      hasActiveInstance: contextHasActiveInstance,
      isMissingActiveInstance: contextIsMissingActiveInstance,
      isNewUser: contextIsNewUser,
    })
  );
  const requestSeq = useRef(0);
  const instancesSeq = useRef(0);
  const inFlightRef = useRef(false);

  const safeCheckUserPackage = useCallback(async (force = false) => {
    const fn: (options?: { force?: boolean }) => Promise<UserPackageResponse> =
      checkUserPackage;
    if (!force) {
      return await fn();
    }
    try {
      return await fn({ force: true });
    } catch {
      return await fn();
    }
  }, []);

  const loadInstances = useCallback(async () => {
    if (!enabled) return;
    const seq = ++instancesSeq.current;
    setState((prev) => ({
      ...prev,
      instancesLoading: true,
      instancesError: null,
    }));
    try {
      const list = await fetchActivePackageInstances();
      if (seq !== instancesSeq.current) return;
      setState((prev) => ({
        ...prev,
        instances: list,
        instancesLoading: false,
        instancesError: null,
      }));
    } catch (err: unknown) {
      if (seq !== instancesSeq.current) return;
      const message = err instanceof Error ? err.message : "Failed to load packages";
      setState((prev) => ({
        ...prev,
        instancesLoading: false,
        instancesError: message,
      }));
    }
  }, [enabled]);

  const refresh = useCallback(async (force = false, silent = false) => {
    if (!enabled) {
      return;
    }

    // Dedup: skip concurrent non-forced calls — the in-flight fetch will settle
    // into the same final state. Forced calls always proceed (user intent).
    if (inFlightRef.current && !force) return;

    inFlightRef.current = true;
    const seq = ++requestSeq.current;

    if (!silent) {
      setState((prev) => ({
        ...prev,
        ready: false,
        coreLoading: true,
        latestResult: null,
        latestLoading: false,
        coreError: null,
      }));
    }

    let planData: UserPackageResponse | null = null;
    let coreError: string | null = null;

    try {
      planData = await safeCheckUserPackage(force);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load dashboard overview";
      coreError = message;
    } finally {
      inFlightRef.current = false;
    }

    if (seq !== requestSeq.current) return;

    const hasActiveInstance = Boolean(planData?.hasAccess && planData?.packageInstanceId);
    const isMissingActiveInstance = !hasActiveInstance;
    const uploadsUsed = typeof planData?.uploadsUsed === "number" ? planData.uploadsUsed : null;
    const createdAt = planData?.packageInstanceCreatedAt
      ? Date.parse(planData.packageInstanceCreatedAt)
      : NaN;
    const now = Date.now();
    const within24h =
      Number.isFinite(createdAt) && createdAt <= now
        ? now - createdAt < 24 * 60 * 60 * 1000
        : false;
    const isNewUser = uploadsUsed === 0 || (uploadsUsed === null && within24h);

    if (seq !== requestSeq.current) return;

    setState((prev) => ({
      ...prev,
      ready: true,
      coreLoading: false,
      coreError,
      planData,
      hasActiveInstance,
      isMissingActiveInstance,
      isNewUser,
      instancesError: prev.instancesError,
      latestResult: null,
      latestLoading: false,
    }));
  }, [enabled, safeCheckUserPackage]);

  useEffect(() => {
    if (!enabled) return;
    if (planLoading) {
      setState((prev) => {
        if (prev.planData) {
          return prev.coreLoading ? { ...prev, coreLoading: false } : prev;
        }
        return !prev.ready && prev.coreLoading
          ? prev
          : { ...prev, ready: false, coreLoading: true };
      });
      return;
    }
    setState((prev) => {
      if (
        prev.ready &&
        !prev.coreLoading &&
        prev.coreError === null &&
        prev.planData === contextPlanData &&
        prev.hasActiveInstance === contextHasActiveInstance &&
        prev.isMissingActiveInstance === contextIsMissingActiveInstance &&
        prev.isNewUser === contextIsNewUser &&
        prev.latestResult === null &&
        !prev.latestLoading
      ) {
        return prev;
      }
      return {
        ...prev,
        ready: true,
        coreLoading: false,
        coreError: null,
        planData: contextPlanData,
        hasActiveInstance: contextHasActiveInstance,
        isMissingActiveInstance: contextIsMissingActiveInstance,
        isNewUser: contextIsNewUser,
        latestResult: null,
        latestLoading: false,
      };
    });
  }, [
    enabled,
    planLoading,
    contextPlanData,
    contextHasActiveInstance,
    contextIsMissingActiveInstance,
    contextIsNewUser,
  ]);

  useEffect(() => {
    if (!enabled) {
      requestSeq.current += 1;
      instancesSeq.current += 1;
    }
  }, [enabled]);

  return { ...state, refresh, loadInstances };
}
