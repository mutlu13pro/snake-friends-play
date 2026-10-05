import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { __resetMockBackend, api, simulateTick } from "@/lib/api";
import { createGame } from "@/lib/snake";

beforeEach(() => __resetMockBackend());
afterEach(() => vi.useRealTimers());

describe("mock api", () => {
  it("logs in with valid credentials and rejects invalid", async () => {
    await expect(api.login("demo@snake.io", "nope")).rejects.toThrow();
    const u = await api.login("demo@snake.io", "demo123");
    expect(u.username).toBe("demo");
    expect(await api.getCurrentUser()).toEqual(u);
    await api.logout();
    expect(await api.getCurrentUser()).toBeNull();
  });

  it("signs up and validates input", async () => {
    await expect(api.signup("ab", "a@b.co", "123456")).rejects.toThrow(/Username/);
    await expect(api.signup("abc", "bad", "123456")).rejects.toThrow(/email/);
    await expect(api.signup("abc", "a@b.co", "1")).rejects.toThrow(/Password/);
    await expect(api.signup("demo", "x@y.co", "123456")).rejects.toThrow(/taken/);
    await expect(api.signup("new", "demo@snake.io", "123456")).rejects.toThrow(/registered/);
    const u = await api.signup("newbie", "New@x.co", "123456");
    expect(u).toEqual({ username: "newbie", email: "new@x.co" });
    await api.logout();
    expect((await api.login("new@x.co", "123456")).username).toBe("newbie");
  });

  it("leaderboard sorted and filtered by mode", async () => {
    const all = await api.getLeaderboard();
    expect(all.map((r) => r.score)).toEqual([...all.map((r) => r.score)].sort((a, b) => b - a));
    const walls = await api.getLeaderboard("walls");
    expect(walls.every((r) => r.mode === "walls")).toBe(true);
  });

  it("submitting score requires login and appears on leaderboard", async () => {
    await expect(api.submitScore(999, "walls")).rejects.toThrow(/Not logged in/);
    await api.login("demo@snake.io", "demo123");
    await api.submitScore(999, "walls");
    expect((await api.getLeaderboard("walls"))[0]).toMatchObject({ username: "demo", score: 999 });
  });

  it("lists live players and streams frames when watching", async () => {
    const players = await api.getLivePlayers();
    expect(players.length).toBeGreaterThan(0);
    vi.useFakeTimers();
    const frames: number[] = [];
    const stop = api.watchPlayer(players[0].id, (s) => frames.push(s.snake.length), 100);
    vi.advanceTimersByTime(500);
    stop();
    const n = frames.length;
    vi.advanceTimersByTime(500);
    expect(n).toBe(6);
    expect(frames.length).toBe(n);
    expect(() => api.watchPlayer("nope", () => {})).toThrow();
  });

  it("simulated player keeps playing and restarts after game over", () => {
    let s = createGame("walls", 10, 10);
    for (let i = 0; i < 200; i++) s = simulateTick(s);
    expect(s.snake.length).toBeGreaterThanOrEqual(3);
    const restarted = simulateTick({ ...s, over: true });
    expect(restarted.over).toBe(false);
    expect(restarted.score).toBe(0);
  });
});
