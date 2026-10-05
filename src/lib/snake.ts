export type Mode = "pass-through" | "walls";
export type Dir = "up" | "down" | "left" | "right";
export type Point = { x: number; y: number };

export interface GameState {
  width: number;
  height: number;
  mode: Mode;
  snake: Point[]; // head first
  dir: Dir;
  pendingDir: Dir;
  food: Point;
  score: number;
  over: boolean;
}

export const DELTA: Record<Dir, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };

export const samePoint = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

export function randomFood(
  width: number,
  height: number,
  snake: Point[],
  rng: () => number = Math.random,
): Point {
  const free: Point[] = [];
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      if (!snake.some((s) => s.x === x && s.y === y)) free.push({ x, y });
  if (free.length === 0) return { x: -1, y: -1 };
  return free[Math.floor(rng() * free.length)]!;
}

export function createGame(
  mode: Mode,
  width = 20,
  height = 20,
  rng: () => number = Math.random,
): GameState {
  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);
  const snake = [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ];
  return {
    width,
    height,
    mode,
    snake,
    dir: "right",
    pendingDir: "right",
    food: randomFood(width, height, snake, rng),
    score: 0,
    over: false,
  };
}

/** Queue a direction change; reversing into yourself is ignored. */
export function changeDirection(state: GameState, dir: Dir): GameState {
  if (state.over || OPPOSITE[state.dir] === dir) return state;
  return { ...state, pendingDir: dir };
}

export function nextHead(state: GameState, dir: Dir): { head: Point; hitWall: boolean } {
  const d = DELTA[dir];
  const h = state.snake[0]!;
  let x = h.x + d.x;
  let y = h.y + d.y;
  const outside = x < 0 || y < 0 || x >= state.width || y >= state.height;
  if (outside && state.mode === "walls") return { head: { x, y }, hitWall: true };
  x = (x + state.width) % state.width;
  y = (y + state.height) % state.height;
  return { head: { x, y }, hitWall: false };
}

export function step(state: GameState, rng: () => number = Math.random): GameState {
  if (state.over) return state;
  const dir = state.pendingDir;
  const { head, hitWall } = nextHead(state, dir);
  if (hitWall) return { ...state, dir, over: true };
  const eating = samePoint(head, state.food);
  const body = eating ? state.snake : state.snake.slice(0, -1);
  if (body.some((p) => samePoint(p, head))) return { ...state, dir, over: true };
  const snake = [head, ...body];
  return {
    ...state,
    dir,
    snake,
    score: eating ? state.score + 10 : state.score,
    food: eating ? randomFood(state.width, state.height, snake, rng) : state.food,
  };
}

/** Simple bot used to simulate other players: greedy toward food, avoids death. */
export function botDirection(state: GameState): Dir {
  const dirs: Dir[] = ["up", "down", "left", "right"];
  const safe = dirs.filter((d) => {
    if (OPPOSITE[state.dir] === d) return false;
    const { head, hitWall } = nextHead(state, d);
    if (hitWall) return false;
    return !state.snake.slice(0, -1).some((p) => samePoint(p, head));
  });
  if (safe.length === 0) return state.dir;
  const dist = (p: Point) => Math.abs(p.x - state.food.x) + Math.abs(p.y - state.food.y);
  safe.sort((a, b) => dist(nextHead(state, a).head) - dist(nextHead(state, b).head));
  return safe[0]!;
}
