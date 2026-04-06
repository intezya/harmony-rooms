import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Index from "@/pages/Index";

describe("Index mock room flows", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows scenario defaults and join validation", () => {
    render(<Index />);

    expect(screen.getByDisplayValue("Mia")).toBeInTheDocument();
    expect(screen.getByDisplayValue("harmony-101")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Empty form"));

    expect(screen.getAllByText(/Press Join Room without filling anything in/i)).toHaveLength(2);
    expect(screen.getAllByDisplayValue("")).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: /Join Room/i }));

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Room ID is required")).toBeInTheDocument();
  });

  it("runs reconnect flow and returns to join", () => {
    vi.useFakeTimers();

    render(<Index />);

    fireEvent.click(screen.getByText("Disconnect & retry"));
    fireEvent.click(screen.getByRole("button", { name: /Join Room/i }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      vi.advanceTimersByTime(1600);
    });

    expect(screen.getByText("Connection lost")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Reconnect/i }));

    expect(screen.getByText("Trying to reconnect…")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1400);
    });

    expect(screen.getByText("Connected")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Leave/i }));

    expect(screen.getByRole("button", { name: /Join Room/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Ava")).toBeInTheDocument();
  });
});
