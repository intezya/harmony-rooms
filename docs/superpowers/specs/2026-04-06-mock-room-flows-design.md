# Mock room flows design

## Goal
Add richer mock data and deterministic frontend-only scenarios so the full room UX can be tested without a backend.

## Current context
- `src/pages/Index.tsx` currently switches only between the join screen and room screen.
- `src/components/RoomPanel.tsx` contains hardcoded participants and its own simulated connection lifecycle.
- `src/components/JoinForm.tsx` handles only local required-field validation.
- There is no scenario switcher or centralized mock-flow orchestration.

## Recommended approach
Use a page-level mock flow controller instead of scattering mock behavior inside UI components or building a fake API layer.

Why this approach:
- keeps the implementation small
- makes every scenario deterministic and easy to replay
- keeps `JoinForm` and `RoomPanel` focused on presentation
- avoids premature backend-like abstractions

## Architecture
### Page orchestration
`src/pages/Index.tsx` becomes the coordinator for demo flows.

Responsibilities:
- store the selected scenario preset
- store the current screen (`join` or `room`)
- start the selected scenario when the user joins
- drive room state transitions with timers
- handle leave and reconnect actions

### Scenario data module
Create a dedicated module for mock presets, e.g. `src/lib/mockRoomScenarios.ts`.

It will contain:
- scenario ids and labels
- optional descriptions for the switcher UI
- join form defaults (`name`, `roomId`)
- optional join-stage behavior
- room state sequences
- participant sets per scenario or per room step

This module is the single source of truth for backend-free flows.

### UI components
#### `src/components/JoinForm.tsx`
Keep local required-field validation, but make the component accept external demo inputs.

New props should allow:
- initial name
- initial room id
- optional scenario hint text
- optional join-stage error message

The component should remain mostly presentational and continue emitting `onJoin(name, roomId)`.

#### `src/components/RoomPanel.tsx`
Move hardcoded room behavior out of the component.

The component should receive from the page:
- connection status
- participants
- audio enabled flag
- reconnect callback

The component may keep small local interaction state that is purely visual, such as muting the local mic, unless the scenario needs to control it.

#### Optional scenario switcher component
If `Index.tsx` gets too large, extract a small `ScenarioSwitcher` component.

Its scope stays narrow:
- render the current preset
- let the user choose another preset
- show a brief description of what the preset demonstrates

## Scenario model
Each scenario preset should include:
- `id`
- `label`
- `description`
- `formDefaults` with `name` and `roomId`
- optional `joinBehavior`
- `roomFlow` sequence

Example conceptual shape:
- form defaults
- join action outcome
- ordered room steps with duration and payload

A room step should support:
- `status`: `connecting | connected | reconnecting | disconnected`
- `durationMs`: how long before the next step starts
- `participants`
- `audioEnabled`
- optional banner text override if needed

## Initial scenario set
Implement 6 deterministic presets:

1. `happy-path`
   - normal join
   - short connecting state
   - stable connected room

2. `empty-form`
   - demonstrates join validation on blank fields
   - no room transition starts until required fields are filled

3. `slow-connect`
   - longer connecting phase before entering connected state

4. `reconnect-once`
   - connected room drops into reconnecting and returns to connected

5. `disconnect-then-retry`
   - room reaches disconnected state
   - reconnect button restarts the scenario from its reconnect path

6. `busy-room`
   - connected room with a larger and more varied participant list

## Data flow
1. User selects a scenario from the dev panel.
2. Join form reflects that scenario’s defaults and hint text.
3. User clicks Join.
4. `Index.tsx` validates whether the scenario should stay on join or start the room flow.
5. The selected room flow runs in memory with deterministic timed transitions.
6. `RoomPanel` renders the current room snapshot.
7. `Reconnect` triggers the reconnect logic defined by the scenario.
8. `Leave` always returns to join while preserving the selected scenario.

## Error handling and scope boundaries
This design intentionally does not add:
- fake API clients
- React Query orchestration for mock transport
- persistent storage
- advanced event buses

This keeps the feature focused on frontend UX testing.

The only errors handled in this scope are:
- required-field validation in the join form
- scenario-defined room connection states
- scenario-defined reconnect behavior

## Testing strategy
Primary validation is manual scenario replay in the browser.

Expected checks:
- every scenario is selectable from the dev switcher
- scenario defaults appear in the join form
- join starts the expected flow
- reconnect works for reconnect-enabled scenarios
- leave returns to join without losing the selected scenario

Automated tests are optional for this step. If added, keep them narrow and focused on page-level orchestration rather than UI styling.

## Implementation boundaries
Keep the change minimal:
- do not add a fake backend layer
- do not refactor unrelated UI pieces
- do not expand beyond the existing join-room flow

## Expected outcome
After implementation, the app should support replayable frontend-only flows that cover the main UX states of joining and using an audio room without requiring a backend.