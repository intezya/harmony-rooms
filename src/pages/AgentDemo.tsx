import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AgentDemo = () => {
  const [text, setText] = useState("");

  const handleSpeak = () => {
    if (!text.trim()) return;
    toast.success("Sent to agent", { description: `"${text.trim()}"` });
    setText("");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-accent/10 blur-[160px]" />

      <div className="glass relative z-10 w-full max-w-md rounded-2xl p-8 animate-scale-in">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-accent">
          <Bot className="h-7 w-7" />
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold text-foreground">Agent Demo</h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">Send text for the voice agent to speak in the room</p>

        <div className="flex gap-2">
          <Input
            placeholder="Type something…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSpeak()}
            className="h-12 flex-1 rounded-xl bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-accent"
          />
          <Button onClick={handleSpeak} className="h-12 w-12 rounded-xl gradient-primary text-primary-foreground hover:opacity-90">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentDemo;
