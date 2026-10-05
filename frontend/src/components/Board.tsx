import type { GameState } from "@/lib/snake";

export function Board({ state, size = 400 }: { state: GameState; size?: number }) {
  const cell = 100 / state.width;
  return (
    <div
      className="relative aspect-square w-full border-2 bg-board"
      style={{
        maxWidth: size,
        borderColor: state.mode === "walls" ? "var(--wall)" : "var(--border)",
        borderStyle: state.mode === "walls" ? "solid" : "dashed",
      }}
      data-testid="board"
    >
      <div
        className="absolute rounded-full bg-food shadow-glow-food"
        style={{ left: `${state.food.x * cell}%`, top: `${state.food.y * cell}%`, width: `${cell}%`, height: `${cell}%` }}
      />
      {state.snake.map((p, i) => (
        <div
          key={i}
          className={i === 0 ? "absolute bg-primary shadow-glow" : "absolute bg-primary/70"}
          style={{ left: `${p.x * cell}%`, top: `${p.y * cell}%`, width: `${cell}%`, height: `${cell}%` }}
        />
      ))}
      {state.over && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-2xl font-bold text-food">
          GAME OVER
        </div>
      )}
    </div>
  );
}
