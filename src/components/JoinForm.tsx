import { useEffect, useState } from "react";
import { Mic, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface JoinFormProps {
  initialName?: string;
  initialRoomId?: string;
  hint?: string;
  joinError?: string;
  onJoin: (name: string, roomId: string) => void;
}

const JoinForm = ({ initialName = "", initialRoomId = "", hint, joinError, onJoin }: JoinFormProps) => {
  const [name, setName] = useState(initialName);
  const [roomId, setRoomId] = useState(initialRoomId);
  const [errors, setErrors] = useState<{ name?: string; roomId?: string }>({});

  useEffect(() => {
    setName(initialName);
    setRoomId(initialRoomId);
    setErrors({});
  }, [initialName, initialRoomId]);

  const handleJoin = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!roomId.trim()) newErrors.roomId = "Room ID is required";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onJoin(name.trim(), roomId.trim());
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      {/* Decorative blur spheres */}
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-primary/20 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 -right-20 h-80 w-80 rounded-full bg-accent/20 blur-[120px] animate-float-delayed" />

      <div className="glass relative z-10 w-full max-w-md rounded-2xl p-8 animate-scale-in">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary glow-primary">
          <Mic className="h-7 w-7 text-primary-foreground" />
        </div>

        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-foreground">
          Audio Room
        </h1>
        <p className="mb-4 text-center text-sm text-muted-foreground">
          Join a room to start a live audio conversation
        </p>

        {hint && (
          <div className="mb-4 rounded-xl border border-white/10 bg-secondary/40 px-3 py-2 text-left text-xs text-muted-foreground">
            {hint}
          </div>
        )}

        {joinError && (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-left text-xs text-destructive">
            {joinError}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
              className="h-12 rounded-xl bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />
            {errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>}
          </div>
          <div>
            <Input
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => { setRoomId(e.target.value); setErrors((p) => ({ ...p, roomId: undefined })); }}
              className="h-12 rounded-xl bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />
            {errors.roomId && <p className="mt-1.5 text-xs text-destructive">{errors.roomId}</p>}
          </div>

          <Button
            onClick={handleJoin}
            className="h-12 w-full rounded-xl gradient-primary text-primary-foreground font-semibold text-base transition-all hover:opacity-90 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)] active:scale-[0.98]"
          >
            Join Room
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinForm;
