export type ConnectionStatus = "connecting" | "connected" | "reconnecting" | "disconnected";

export interface RoomParticipant {
  id: string;
  name: string;
  speaking: boolean;
  muted: boolean;
}

export interface ScenarioParticipant {
  id: string;
  name: string;
  muted: boolean;
}

export interface RoomScenarioStep {
  status: ConnectionStatus;
  durationMs: number;
  speakingIds: string[];
  audioEnabled?: boolean;
  participants?: ScenarioParticipant[];
}

export interface RoomScenario {
  id: string;
  label: string;
  description: string;
  hint: string;
  formDefaults: {
    name: string;
    roomId: string;
  };
  participants: ScenarioParticipant[];
  initialSteps: RoomScenarioStep[];
  reconnectSteps?: RoomScenarioStep[];
}

export const getScenarioById = (scenarioId: string) =>
  ROOM_SCENARIOS.find((scenario) => scenario.id === scenarioId) ?? ROOM_SCENARIOS[0];


const coreParticipants: ScenarioParticipant[] = [
  { id: "1", name: "Alice", muted: false },
  { id: "2", name: "Bob", muted: false },
  { id: "3", name: "Charlie", muted: true },
  { id: "4", name: "Diana", muted: false },
];

const busyRoomParticipants: ScenarioParticipant[] = [
  { id: "1", name: "Alice", muted: false },
  { id: "2", name: "Bob", muted: false },
  { id: "3", name: "Charlie", muted: true },
  { id: "4", name: "Diana", muted: false },
  { id: "5", name: "Eva", muted: false },
  { id: "6", name: "Farid", muted: false },
  { id: "7", name: "Grace", muted: true },
];

export const ROOM_SCENARIOS: RoomScenario[] = [
  {
    id: "happy-path",
    label: "Happy path",
    description: "Stable room connection with a short join and a normal conversation.",
    hint: "Quick sanity check for join → connect → active room.",
    formDefaults: {
      name: "Mia",
      roomId: "harmony-101",
    },
    participants: coreParticipants,
    initialSteps: [
      { status: "connecting", durationMs: 1200, speakingIds: [] },
      { status: "connected", durationMs: 1800, speakingIds: ["1"], audioEnabled: true },
      { status: "connected", durationMs: 0, speakingIds: ["2", "me"] },
    ],
  },
  {
    id: "empty-form",
    label: "Empty form",
    description: "Leave the form blank and confirm required-field validation still works.",
    hint: "Press Join Room without filling anything in, then type your values and retry.",
    formDefaults: {
      name: "",
      roomId: "",
    },
    participants: coreParticipants,
    initialSteps: [
      { status: "connecting", durationMs: 1200, speakingIds: [] },
      { status: "connected", durationMs: 1800, speakingIds: ["1"], audioEnabled: true },
      { status: "connected", durationMs: 0, speakingIds: ["2"] },
    ],
  },
  {
    id: "slow-connect",
    label: "Slow connect",
    description: "Extended connecting state with room audio left disabled at first.",
    hint: "Use this to verify slow-loading UI and the audio enable button.",
    formDefaults: {
      name: "Olivia",
      roomId: "slow-lobby",
    },
    participants: coreParticipants,
    initialSteps: [
      { status: "connecting", durationMs: 2600, speakingIds: [] },
      { status: "connected", durationMs: 1500, speakingIds: ["4"], audioEnabled: false },
      { status: "connected", durationMs: 0, speakingIds: ["1", "2"] },
    ],
  },
  {
    id: "reconnect-once",
    label: "Auto reconnect",
    description: "The room briefly reconnects on its own and then recovers.",
    hint: "Useful for checking passive recovery UI without pressing Reconnect.",
    formDefaults: {
      name: "Ethan",
      roomId: "signal-lab",
    },
    participants: coreParticipants,
    initialSteps: [
      { status: "connecting", durationMs: 900, speakingIds: [] },
      { status: "connected", durationMs: 1500, speakingIds: ["1", "me"], audioEnabled: true },
      { status: "reconnecting", durationMs: 1200, speakingIds: [] },
      { status: "connected", durationMs: 0, speakingIds: ["2"] },
    ],
  },
  {
    id: "disconnect-then-retry",
    label: "Disconnect & retry",
    description: "The room drops completely and waits for a manual reconnect.",
    hint: "Verifies the disconnect banner and explicit reconnect action.",
    formDefaults: {
      name: "Ava",
      roomId: "retry-room",
    },
    participants: coreParticipants,
    initialSteps: [
      { status: "connecting", durationMs: 1000, speakingIds: [] },
      { status: "connected", durationMs: 1600, speakingIds: ["1"], audioEnabled: true },
      { status: "disconnected", durationMs: 0, speakingIds: [] },
    ],
    reconnectSteps: [
      { status: "reconnecting", durationMs: 1400, speakingIds: [] },
      { status: "connected", durationMs: 1400, speakingIds: ["2", "me"], audioEnabled: true },
      { status: "connected", durationMs: 0, speakingIds: ["4"] },
    ],
  },
  {
    id: "busy-room",
    label: "Busy room",
    description: "A more crowded room with more speakers and a denser participant grid.",
    hint: "Check how the room UI behaves with a larger participant list.",
    formDefaults: {
      name: "Kai",
      roomId: "all-hands",
    },
    participants: busyRoomParticipants,
    initialSteps: [
      { status: "connecting", durationMs: 900, speakingIds: [] },
      { status: "connected", durationMs: 1400, speakingIds: ["1", "2"], audioEnabled: true },
      { status: "connected", durationMs: 0, speakingIds: ["3", "4", "me"] },
    ],
  },
];

export const DEFAULT_SCENARIO_ID = "happy-path";
