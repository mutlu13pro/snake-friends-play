import { act, render, screen, waitFor } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthProvider, useAuth } from "@/lib/auth";
import { __resetMockBackend } from "@/lib/api";
import { Board } from "@/components/Board";
import { createGame } from "@/lib/snake";
import { routeTree } from "@/routeTree.gen";

beforeEach(() => __resetMockBackend());

let auth: ReturnType<typeof useAuth>;
function Probe() {
  auth = useAuth();
  return <span data-testid="who">{auth.user?.username ?? "guest"}</span>;
}

describe("auth context", () => {
  it("logs in, shows username, logs out", async () => {
    render(<AuthProvider><Probe /></AuthProvider>);
    expect(screen.getByTestId("who")).toHaveTextContent("guest");
    await act(() => auth.login("demo@snake.io", "demo123"));
    expect(screen.getByTestId("who")).toHaveTextContent("demo");
    await act(() => auth.logout());
    expect(screen.getByTestId("who")).toHaveTextContent("guest");
  });

  it("signs up and surfaces errors", async () => {
    render(<AuthProvider><Probe /></AuthProvider>);
    await expect(auth.login("x@y.co", "bad")).rejects.toThrow();
    await act(() => auth.signup("newbie", "n@x.co", "secret1"));
    await waitFor(() => expect(screen.getByTestId("who")).toHaveTextContent("newbie"));
  });

  it("throws outside provider", () => {
    expect(() => render(<Probe />)).toThrow(/AuthProvider/);
  });
});

describe("Board", () => {
  it("renders snake, food and game-over overlay", () => {
    const g = createGame("walls", 10, 10, () => 0);
    const { container, rerender } = render(<Board state={g} />);
    expect(container.querySelectorAll(".bg-primary, .bg-primary\\/70")).toHaveLength(3);
    expect(container.querySelector(".bg-food")).not.toBeNull();
    expect(screen.queryByText("GAME OVER")).toBeNull();
    rerender(<Board state={{ ...g, over: true }} />);
    expect(screen.getByText("GAME OVER")).toBeInTheDocument();
  });
});

describe("routes", () => {
  it.each(["/", "/leaderboard", "/watch", "/login", "/signup"])("%s resolves", (path) => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes(path).at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
