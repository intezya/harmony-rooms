import { Mic, MicOff, LogOut, RefreshCw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConnectionStatus, RoomParticipant } from "@/lib/mockRoomScenarios";

interface RoomPanelProps {
  roomId: string;
  status: ConnectionStatus;
  muted: boolean;
  audioEnabled: boolean;
  canReconnect: boolean;
  participants: RoomParticipant[];
  onToggleMuted: () => void;
  onEnableAudio: () => void;
  onReconnect: () => void;
  onLeave: () => void;
}

const statusConfig: Record<ConnectionStatus, { label: string; className: string }> = {
  connecting: { label: "Connecting…", className: "bg-warning/20 text-warning border-warning/30" },
  connected: { label: "Connected", className: "bg-success/20 text-success border-success/30" },
  reconnecting: { label: "Reconnecting…", className: "bg-warning/20 text-warning border-warning/30" },
  disconnected: { label: "Disconnected", className: "bg-destructive/20 text-destructive border-destructive/30" },
};

const RoomPanel = ({
  roomId,
  status,
  muted,
  audioEnabled,
  canReconnect,
  participants,
  onToggleMuted,
  onEnableAudio,
  onReconnect,
  onLeave,
}: RoomPanelProps) => {
  const st = statusConfig[status];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute top-1/3 -left-32 h-72 w-72 rounded-full bg-primary/15 blur-[120px] animate-float" />
      <div className="absolute bottom-1/3 -right-32 h-72 w-72 rounded-full bg-accent/15 blur-[120px] animate-float-delayed" />

      <div className="glass relative z-10 w-full max-w-lg rounded-2xl animate-fade-in">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${st.className}`}>
              {st.label}
            </span>
            <span className="text-sm font-mono text-muted-foreground">{roomId}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onLeave} className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="mr-1.5 h-4 w-4" />
            Leave
          </Button>
        </div>

        {(status === "reconnecting" || status === "disconnected") && (
          <div className="mx-6 mt-4 flex items-center justify-between rounded-xl border border-warning/20 bg-warning/5 px-4 py-3">
            <span className="text-sm text-warning">
              {status === "reconnecting" ? "Trying to reconnect…" : "Connection lost"}
            </span>
            {canReconnect && (
              <Button size="sm" variant="outline" onClick={onReconnect} className="border-warning/30 text-warning hover:bg-warning/10">
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Reconnect
              </Button>
            )}
          </div>
        )}

        <div className="flex flex-col items-center gap-4 px-6 py-8">
          <div className="relative">
            {!muted && participants.find((participant) => participant.id === "me")?.speaking && (
              <div className="absolute inset-0 rounded-full bg-success/30 animate-pulse-ring" />
            )}
            <button
              onClick={onToggleMuted}
              className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                muted
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : "border-success/40 bg-success/10 text-success glow-success"
              }`}
            >
              {muted ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </button>
          </div>
          <span className="text-xs text-muted-foreground">{muted ? "Muted" : "Tap to mute"}</span>

          {!audioEnabled && (
            <Button onClick={onEnableAudio} variant="outline" className="rounded-xl border-primary/30 text-primary hover:bg-primary/10">
              <Volume2 className="mr-2 h-4 w-4" />
              Enable room audio
            </Button>
          )}
        </div>

        <div className="border-t border-white/[0.06] px-6 py-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Participants ({participants.length})
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {participants.map((participant) => (
              <div key={participant.id} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold transition-shadow duration-300 ${
                      participant.speaking
                        ? "bg-success/20 text-success ring-2 ring-success/50 glow-success"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {participant.name[0]}
                  </div>
                  {participant.muted && (
                    <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive">
                      <MicOff className="h-3 w-3 text-destructive-foreground" />
                    </div>
                  )}
                </div>
                <span className="max-w-full truncate text-xs text-muted-foreground">
                  {participant.id === "me" ? "You" : participant.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPanel;
