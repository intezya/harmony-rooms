import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { RoomScenario } from "@/lib/mockRoomScenarios";

interface ScenarioSwitcherProps {
  scenarios: RoomScenario[];
  value: string;
  onValueChange: (scenarioId: string) => void;
}

const ScenarioSwitcher = ({ scenarios, value, onValueChange }: ScenarioSwitcherProps) => {
  const activeScenario = scenarios.find((scenario) => scenario.id === value);

  return (
    <Card className="fixed right-4 top-4 z-20 w-[min(24rem,calc(100vw-2rem))] border-white/10 bg-background/80 backdrop-blur-xl">
      <CardHeader className="space-y-2 p-4 pb-3">
        <CardTitle className="text-base">Demo scenario</CardTitle>
        <CardDescription>
          Pick a deterministic room flow to test without a backend.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0">
        <ToggleGroup
          type="single"
          value={value}
          onValueChange={(nextValue) => nextValue && onValueChange(nextValue)}
          variant="outline"
          className="flex flex-wrap justify-start gap-2"
        >
          {scenarios.map((scenario) => (
            <ToggleGroupItem key={scenario.id} value={scenario.id} size="sm" className="rounded-lg text-xs">
              {scenario.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {activeScenario && (
          <div className="rounded-xl border border-white/10 bg-secondary/40 px-3 py-2">
            <p className="text-sm font-medium text-foreground">{activeScenario.description}</p>
            <p className="mt-1 text-xs text-muted-foreground">{activeScenario.hint}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScenarioSwitcher;
