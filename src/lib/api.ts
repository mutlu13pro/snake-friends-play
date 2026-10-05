/**
 * Single place for every backend call. Everything is mocked in memory for now;
 * swap the bodies of these functions for real HTTP calls later.
 */
import { botDirection, createGame, step, type GameState, type Mode } from "./snake";

export interface User {
  username: string;
  email: string;
}
export interface LeaderboardEntry {
  username: string;
  score: number;
  mode: Mode;
  date: string;
}
export interface LivePlayer {
  id: string;
  username: string;
  mode: Mode;
}

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

interface DB {
  users: Map<string, User & { password: string }>;
  session: User | null;
  scores: LeaderboardEntry[];
}

function seed(): DB {
  const users = new Map<string, User & { password: string }>();
  users.set("demo@snake.io", { username: "demo", email: "demo@snake.io", password: "demo123" });
  const names = ["viper", "nokia3310", "pixelpy", "coil", "slyther", "mamba", "byte", "noodle"];
  const scores: LeaderboardEntry[] = names.map((n, i) => ({
    username: n,
    score: 400 - i * 40,
    mode: i % 2 ? "walls" : "pass-through",
    date: "2026-10-0" + ((i % 4) + 1),
  }));
  return { users, session: null, scores };
}

let db = seed();

/** Test helper: reset mock state. */
export function __resetMockBackend() {
  db = seed();
  liveGames.clear();
}

export const api = {
  async login(email: string, password: string): Promise<User> {
    await delay();
    const u = db.users.get(email.trim().toLowerCase());
    if (!u || u.password !== password) throw new Error("Invalid email or password");
    db.session = { username: u.username, email: u.email };
    return db.session;
  },

  async signup(username: string, email: string, password: string): Promise<User> {
    await delay();
    const e = email.trim().toLowerCase();
    const name = username.trim();
    if (name.length < 3) throw new Error("Username must be at least 3 characters");
    if (!/^\S+@\S+\.\S+$/.test(e)) throw new Error("Invalid email");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");
    if (db.users.has(e)) throw new Error("Email already registered");
    if ([...db.users.values()].some((u) => u.username.toLowerCase() === name.toLowerCase()))
      throw new Error("Username taken");
    db.users.set(e, { username: name, email: e, password });
    db.session = { username: name, email: e };
    return db.session;
  },

  async logout(): Promise<void> {
    await delay(50);
    db.session = null;
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(50);
    return db.session;
  },

  async getLeaderboard(mode?: Mode): Promise<LeaderboardEntry[]> {
    await delay();
    return db.scores
      .filter((s) => !mode || s.mode === mode)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  },

  async submitScore(score: number, mode: Mode): Promise<LeaderboardEntry> {
    await delay();
    if (!db.session) throw new Error("Not logged in");
    const entry = {
      username: db.session.username,
      score,
      mode,
      date: new Date().toISOString().slice(0, 10),
    };
    db.scores.push(entry);
    return entry;
  },

  async getLivePlayers(): Promise<LivePlayer[]> {
    await delay();
    return LIVE_PLAYERS;
  },

  /** Subscribe to a live game. Returns an unsubscribe function. */
  watchPlayer(id: string, onFrame: (s: GameState) => void, tickMs = 120): () => void {
    const player = LIVE_PLAYERS.find((p) => p.id === id);
    if (!player) throw new Error("Player not found");
    let state = liveGames.get(id) ?? createGame(player.mode);
    onFrame(state);
    const t = setInterval(() => {
      state = simulateTick(state);
      liveGames.set(id, state);
      onFrame(state);
    }, tickMs);
    return () => clearInterval(t);
  },
};

const LIVE_PLAYERS: LivePlayer[] = [
  { id: "p1", username: "viper", mode: "pass-through" },
  { id: "p2", username: "mamba", mode: "walls" },
  { id: "p3", username: "noodle", mode: "walls" },
];
const liveGames = new Map<string, GameState>();

/** One tick of a simulated player; restarts automatically on game over. */
export function simulateTick(state: GameState): GameState {
  if (state.over) return createGame(state.mode, state.width, state.height);
  return step({ ...state, pendingDir: botDirection(state) });
}
