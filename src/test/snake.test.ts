import { describe, expect, it } from "vitest";
import { botDirection, changeDirection, createGame, randomFood, step, type GameState } from "@/lib/snake";

const fixed = (over: Partial<GameState> = {}): GameState => ({
  ...createGame("walls", 10, 10, () => 0),
  food: { x: 0, y: 0 },
  ...over,
});

describe("snake logic", () => {
  it("creates a 3-length snake moving right", () => {
    const g = createGame("walls", 10, 10);
    expect(g.snake).toHaveLength(3);
    expect(g.dir).toBe("right");
    expect(g.over).toBe(false);
  });

  it("moves one cell per step", () => {
    const g = step(fixed());
    expect(g.snake[0]).toEqual({ x: 6, y: 5 });
    expect(g.snake).toHaveLength(3);
  });

  it("ignores reversing direction", () => {
    const g = changeDirection(fixed(), "left");
    expect(g.pendingDir).toBe("right");
    expect(changeDirection(fixed(), "up").pendingDir).toBe("up");
  });

  it("grows and scores when eating", () => {
    const g = step(fixed({ food: { x: 6, y: 5 } }), () => 0);
    expect(g.snake).toHaveLength(4);
    expect(g.score).toBe(10);
    expect(g.snake.some((p) => p.x === g.food.x && p.y === g.food.y)).toBe(false);
  });

  it("walls mode: hitting edge ends the game", () => {
    const g = step(fixed({ snake: [{ x: 9, y: 5 }, { x: 8, y: 5 }] }));
    expect(g.over).toBe(true);
  });

  it("pass-through mode: wraps around edges", () => {
    const g = step(fixed({ mode: "pass-through", snake: [{ x: 9, y: 5 }, { x: 8, y: 5 }] }));
    expect(g.over).toBe(false);
    expect(g.snake[0]).toEqual({ x: 0, y: 5 });
    const up = step(fixed({ mode: "pass-through", snake: [{ x: 3, y: 0 }, { x: 3, y: 1 }], dir: "up", pendingDir: "up" }));
    expect(up.snake[0]).toEqual({ x: 3, y: 9 });
  });

  it("self collision ends the game", () => {
    const snake = [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 5, y: 6 }, { x: 4, y: 6 }];
    const g = step(fixed({ snake, dir: "up", pendingDir: "down" }));
    expect(g.over).toBe(true);
  });

  it("moving into the tail cell is allowed (tail moves away)", () => {
    const snake = [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 5, y: 6 }];
    const g = step(fixed({ snake, dir: "left", pendingDir: "down" }));
    expect(g.over).toBe(false);
  });

  it("does nothing once over", () => {
    const g = fixed({ over: true });
    expect(step(g)).toBe(g);
    expect(changeDirection(g, "up")).toBe(g);
  });

  it("randomFood never lands on the snake", () => {
    const snake = [{ x: 0, y: 0 }];
    expect(randomFood(2, 1, snake, () => 0)).toEqual({ x: 1, y: 0 });
    expect(randomFood(1, 1, snake)).toEqual({ x: -1, y: -1 });
  });

  it("bot heads toward food and avoids walls", () => {
    expect(botDirection(fixed({ food: { x: 5, y: 0 } }))).toBe("up");
    const cornered = fixed({ snake: [{ x: 9, y: 0 }, { x: 8, y: 0 }] });
    expect(["down"]).toContain(botDirection(cornered));
  });
});
