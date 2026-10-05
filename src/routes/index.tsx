import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Board } from "@/components/Board";
import { changeDirection, createGame, step, type Dir, type Mode } from "@/lib/snake";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Snake — Play pass-through or walls mode" },
      { name: "description", content: "Classic snake with pass-through and walls modes, leaderboard and live spectating." },
      { property: "og:title", content: "Snake — Play now" },
      { property: "og:description", content: "Classic snake with two modes, leaderboard and live spectating." },
    ],
  }),
  component: Play,
});

const KEYS: Record<string, Dir> = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  w: "up", s: "down", a: "left", d: "right",
};

function Play() {
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>("pass-through");
  const [game, setGame] = useState(() => createGame("pass-through"));
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState("");
  const submitted = useRef(false);

  const reset = useCallback((m: Mode) => {
    setGame(createGame(m));
    setRunning(false);
    setMsg("");
    submitted.current = false;
  }, []);

  useEffect(() => {
    if (!running || game.over) return;
    const t = setInterval(() => setGame((g) => step(g)), 110);
    return () => clearInterval(t);
  }, [running, game.over]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        if (game.over) reset(mode);
        else setRunning((r) => !r);
        return;
      }
      const d = KEYS[e.key];
      if (d) {
        e.preventDefault();
        setGame((g) => changeDirection(g, d));
        setRunning(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [game.over, mode, reset]);

  useEffect(() => {
    if (game.over && !submitted.current && game.score > 0) {
      submitted.current = true;
      if (user) api.submitScore(game.score, mode).then(() => setMsg("Score saved to leaderboard!"));
      else setMsg("Log in to save your score.");
    }
  }, [game.over, game.score, mode, user]);

  const btn = (on: boolean) => `px-3 py-1 border ${on ? "bg-primary text-primary-foreground" : "hover:border-primary"}`;
  const press = (d: Dir) => { setGame((g) => changeDirection(g, d)); setRunning(true); };

  return (
    <main className="mx-auto flex max-w-xl flex-col items-center gap-4 p-4">
      <div className="flex gap-2">
        {(["pass-through", "walls"] as Mode[]).map((m) => (
          <button key={m} className={btn(mode === m)} onClick={() => { setMode(m); reset(m); }}>{m}</button>
        ))}
      </div>
      <div className="flex w-full max-w-[400px] justify-between text-sm">
        <span>SCORE <b className="text-primary">{game.score}</b></span>
        <span className="text-muted-foreground">{game.over ? "space: restart" : running ? "space: pause" : "arrows / space: start"}</span>
      </div>
      <Board state={game} />
      {msg && <p className="text-sm text-accent">{msg}</p>}
      <div className="grid grid-cols-3 gap-2 sm:hidden">
        <span /><button className={btn(false)} onClick={() => press("up")}>▲</button><span />
        <button className={btn(false)} onClick={() => press("left")}>◀</button>
        <button className={btn(false)} onClick={() => (game.over ? reset(mode) : setRunning((r) => !r))}>{game.over ? "↻" : running ? "❚❚" : "▶"}</button>
        <button className={btn(false)} onClick={() => press("right")}>▶</button>
        <span /><button className={btn(false)} onClick={() => press("down")}>▼</button><span />
      </div>
      <button className="hidden border px-4 py-1 hover:border-primary sm:block" onClick={() => reset(mode)}>Restart</button>
    </main>
  );
}
