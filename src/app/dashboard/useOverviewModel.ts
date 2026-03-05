"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  checkUserPackage,
  fetchActivePackageInstances,
  fetchLatestResultForPackageInstance,
  type PackageInstanceSummary,
  type UserPackageResponse,
} from "@/app/utils/api";
import type { ResultDoc } from "@/app/types/analysis";

const MIN_SKELETON_MS = 300;

type UseOverviewModelOptions = {
  enabled: boolean;
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

export function useOverviewModel({ enabled }: UseOverviewModelOptions) {
  const [state, setState] = useState<OverviewModelState>(INITIAL_STATE);
  const requestSeq = useRef(0);
  const instancesSeq = useRef(0);

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

  const refresh = useCallback(async (force = false) => {
    if (!enabled) {
      return;
    }

    const seq = ++requestSeq.current;
    const startedAt = Date.now();
    setState((prev) => ({
      ...prev,
      ready: false,
      coreLoading: true,
      latestResult: null,
      latestLoading: false,
      coreError: null,
    }));

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

    const elapsed = Date.now() - startedAt;
    const wait = Math.max(0, MIN_SKELETON_MS - elapsed);
    if (wait > 0) {
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
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
      latestLoading: hasActiveInstance && !coreError,
    }));

    if (coreError || !hasActiveInstance || !planData?.packageInstanceId) return;

    try {
      const latest = await fetchLatestResultForPackageInstance(planData.packageInstanceId);
      if (seq !== requestSeq.current) return;
      setState((prev) => ({
        ...prev,
        latestResult: latest,
        latestLoading: false,
      }));
    } catch {
      if (seq !== requestSeq.current) return;
      setState((prev) => ({
        ...prev,
        latestResult: null,
        latestLoading: false,
      }));
    }
  }, [enabled, safeCheckUserPackage]);

  useEffect(() => {
    void refresh(false);
  }, [refresh]);

  useEffect(() => {
    if (!enabled) {
      requestSeq.current += 1;
      instancesSeq.current += 1;
    }
  }, [enabled]);

  return { ...state, refresh, loadInstances };
}
