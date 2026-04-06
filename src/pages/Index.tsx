import { useState } from "react";
import JoinForm from "@/components/JoinForm";
import RoomPanel from "@/components/RoomPanel";

type Screen = { type: "join" } | { type: "room"; name: string; roomId: string };

const Index = () => {
  const [screen, setScreen] = useState<Screen>({ type: "join" });

  if (screen.type === "room") {
    return (
      <RoomPanel
        userName={screen.name}
        roomId={screen.roomId}
        onLeave={() => setScreen({ type: "join" })}
      />
    );
  }

  return (
    <JoinForm onJoin={(name, roomId) => setScreen({ type: "room", name, roomId })} />
  );
};

export default Index;
