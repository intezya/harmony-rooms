import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RoomParticipant, RoomScenario, RoomScenarioStep } from "@/lib/mockRoomScenarios";

interface UseMockRoomSessionArgs {
  scenario: RoomScenario;
  userName: string;
  enabled?: boolean;
  sessionKey?: number;
}

interface UseMockRoomSessionResult {
  status: RoomScenarioStep["status"];
  participants: RoomParticipant[];
  muted: boolean;
  audioEnabled: boolean;
  canReconnect: boolean;
  toggleMuted: () => void;
  enableAudio: () => void;
  reconnect: () => void;
}

const buildParticipants = (scenario: RoomScenario, userName: string, step: RoomScenarioStep, muted: boolean) => {
  const source = step.participants ?? scenario.participants;

  return [
    {
      id: "me",
      name: userName,
      muted,
      speaking: !muted && step.speakingIds.includes("me"),
    },
    ...source.map((participant) => ({
      ...participant,
      speaking: step.speakingIds.includes(participant.id),
    })),
  ];
};

export const useMockRoomSession = ({
  scenario,
  userName,
  enabled = true,
  sessionKey = 0,
}: UseMockRoomSessionArgs): UseMockRoomSessionResult => {
  const [stepIndex, setStepIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isReconnectRun, setIsReconnectRun] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const steps = useMemo(
    () => (isReconnectRun && scenario.reconnectSteps ? scenario.reconnectSteps : scenario.initialSteps),
    [isReconnectRun, scenario],
  );

  const fallbackStep: RoomScenarioStep = {
    status: "connecting",
    durationMs: 0,
    speakingIds: [],
  };

  const currentStep = steps[Math.min(stepIndex, steps.length - 1)] ?? fallbackStep;

  const setMutedSafely = useCallback((updater: (current: boolean) => boolean) => {
    if (!enabled) return;
    setMuted(updater);
  }, [enabled]);

  const enableAudioSafely = useCallback(() => {
    if (!enabled) return;
    setAudioEnabled(true);
  }, [enabled]);

  const clearScheduledStep = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearScheduledStep();
    setStepIndex(0);
    setMuted(false);
    setAudioEnabled(false);
    setIsReconnectRun(false);
  }, [clearScheduledStep, scenario, sessionKey, userName]);

  useEffect(() => {
    if (!enabled) {
      clearScheduledStep();
      setStepIndex(0);
      setMuted(false);
      setAudioEnabled(false);
      setIsReconnectRun(false);
    }
  }, [clearScheduledStep, enabled]);

  useEffect(() => {
    if (currentStep.audioEnabled !== undefined) {
      setAudioEnabled(currentStep.audioEnabled);
    }
  }, [currentStep]);

  useEffect(() => {
    clearScheduledStep();

    if (!enabled || !currentStep || currentStep.durationMs <= 0 || stepIndex >= steps.length - 1) {
      return clearScheduledStep;
    }

    timeoutRef.current = window.setTimeout(() => {
      setStepIndex((current) => Math.min(current + 1, steps.length - 1));
    }, currentStep.durationMs);

    return clearScheduledStep;
  }, [clearScheduledStep, currentStep, enabled, stepIndex, steps.length]);

  useEffect(() => clearScheduledStep, [clearScheduledStep]);

  const reconnect = useCallback(() => {
    if (!enabled || currentStep.status !== "disconnected") return;

    clearScheduledStep();
    setIsReconnectRun(true);
    setStepIndex(0);
  }, [clearScheduledStep, currentStep.status, enabled]);

  const participants = useMemo(
    () => buildParticipants(scenario, userName, currentStep, muted),
    [currentStep, muted, scenario, userName],
  );

  return {
    status: enabled ? currentStep.status : "connecting",
    participants: enabled ? participants : [],
    muted,
    audioEnabled,
    canReconnect: enabled && currentStep.status === "disconnected",
    toggleMuted: () => setMutedSafely((current) => !current),
    enableAudio: enableAudioSafely,
    reconnect,
  };
};
