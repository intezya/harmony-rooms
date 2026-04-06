import { useMemo, useState } from "react";
import JoinForm from "@/components/JoinForm";
import RoomPanel from "@/components/RoomPanel";
import ScenarioSwitcher from "@/components/ScenarioSwitcher";
import { useMockRoomSession } from "@/hooks/useMockRoomSession";
import { DEFAULT_SCENARIO_ID, ROOM_SCENARIOS, getScenarioById } from "@/lib/mockRoomScenarios";

type Screen = { type: "join" } | { type: "room"; name: string; roomId: string };

const Index = () => {
  const [screen, setScreen] = useState<Screen>({ type: "join" });
  const [selectedScenarioId, setSelectedScenarioId] = useState(DEFAULT_SCENARIO_ID);
  const [sessionKey, setSessionKey] = useState(0);

  const scenario = useMemo(() => getScenarioById(selectedScenarioId), [selectedScenarioId]);

  const roomSession = useMockRoomSession({
    scenario,
    userName: screen.type === "room" ? screen.name : scenario.formDefaults.name || "You",
    enabled: screen.type === "room",
    sessionKey,
  });

  const handleScenarioChange = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);

    if (screen.type === "room") {
      setSessionKey((current) => current + 1);
    }
  };

  const handleJoin = (name: string, roomId: string) => {
    setScreen({ type: "room", name, roomId });
    setSessionKey((current) => current + 1);
  };

  const handleLeave = () => {
    setScreen({ type: "join" });
  };

  return (
    <>
      <ScenarioSwitcher scenarios={ROOM_SCENARIOS} value={selectedScenarioId} onValueChange={handleScenarioChange} />

      {screen.type === "room" ? (
        <RoomPanel
          roomId={screen.roomId}
          status={roomSession.status}
          muted={roomSession.muted}
          audioEnabled={roomSession.audioEnabled}
          canReconnect={roomSession.canReconnect}
          participants={roomSession.participants}
          onToggleMuted={roomSession.toggleMuted}
          onEnableAudio={roomSession.enableAudio}
          onReconnect={roomSession.reconnect}
          onLeave={handleLeave}
        />
      ) : (
        <JoinForm
          initialName={scenario.formDefaults.name}
          initialRoomId={scenario.formDefaults.roomId}
          hint={scenario.hint}
          onJoin={handleJoin}
        />
      )}
    </>
  );
};

export default Index;
