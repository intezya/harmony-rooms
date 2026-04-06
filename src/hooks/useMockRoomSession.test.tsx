import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ROOM_SCENARIOS } from "@/lib/mockRoomScenarios";
import { useMockRoomSession } from "@/hooks/useMockRoomSession";

describe("useMockRoomSession", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("plays deterministic scenario steps", () => {
    vi.useFakeTimers();

    const scenario = ROOM_SCENARIOS.find((item) => item.id === "happy-path")!;
    const { result } = renderHook(() => useMockRoomSession({ scenario, userName: "Mia" }));

    expect(result.current.status).toBe("connecting");
    expect(result.current.participants).toHaveLength(5);

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(result.current.status).toBe("connected");
    expect(result.current.audioEnabled).toBe(true);
    expect(result.current.participants.find((participant) => participant.id === "1")?.speaking).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1800);
    });

    expect(result.current.participants.find((participant) => participant.id === "2")?.speaking).toBe(true);
    expect(result.current.participants.find((participant) => participant.id === "me")?.speaking).toBe(true);
  });

  it("handles manual reconnect scenarios", () => {
    vi.useFakeTimers();

    const scenario = ROOM_SCENARIOS.find((item) => item.id === "disconnect-then-retry")!;
    const { result } = renderHook(() => useMockRoomSession({ scenario, userName: "Ava" }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      vi.advanceTimersByTime(1600);
    });

    expect(result.current.status).toBe("disconnected");
    expect(result.current.canReconnect).toBe(true);

    act(() => {
      result.current.reconnect();
    });

    expect(result.current.status).toBe("reconnecting");
    expect(result.current.canReconnect).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1400);
    });

    expect(result.current.status).toBe("connected");
    expect(result.current.participants.find((participant) => participant.id === "2")?.speaking).toBe(true);
  });

  it("suppresses local speaking when muted", () => {
    vi.useFakeTimers();

    const scenario = ROOM_SCENARIOS.find((item) => item.id === "happy-path")!;
    const { result } = renderHook(() => useMockRoomSession({ scenario, userName: "Mia" }));

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    act(() => {
      vi.advanceTimersByTime(1800);
    });

    expect(result.current.participants.find((participant) => participant.id === "me")?.speaking).toBe(true);

    act(() => {
      result.current.toggleMuted();
    });

    expect(result.current.participants.find((participant) => participant.id === "me")?.speaking).toBe(false);
    expect(result.current.muted).toBe(true);
  });
});
