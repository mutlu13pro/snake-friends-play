import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, type LivePlayer } from "@/lib/api";
import type { GameState } from "@/lib/snake";
import { Board } from "@/components/Board";

export const Route = createFileRoute("/watch")({
  head: () => ({
    meta: [
      { title: "Watch live — Snake" },
      { name: "description", content: "Follow other snake players live as they play." },
      { property: "og:title", content: "Watch live snake games" },
      { property: "og:description", content: "Follow other snake players live as they play." },
    ],
  }),
  component: Watch,
});

function Watch() {
  const [players, setPlayers] = useState<LivePlayer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [frame, setFrame] = useState<GameState | null>(null);

  useEffect(() => {
    api.getLivePlayers().then((p) => { setPlayers(p); setSelected(p[0]?.id ?? null); });
  }, []);
  useEffect(() => {
    if (!selected) return;
    return api.watchPlayer(selected, setFrame);
  }, [selected]);

  const current = players.find((p) => p.id === selected);
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 p-4 sm:flex-row">
      <aside className="sm:w-48">
        <h1 className="mb-2 text-lg font-bold text-primary">&gt; live now</h1>
        <ul className="space-y-1">
          {players.map((p) => (
            <li key={p.id}>
              <button onClick={() => setSelected(p.id)}
                className={`w-full border px-2 py-1 text-left text-sm ${p.id === selected ? "border-primary text-primary" : "hover:border-primary"}`}>
                <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-food" />
                {p.username} <span className="text-muted-foreground">· {p.mode}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <section className="flex-1">
        {current && frame && (
          <>
            <div className="mb-2 flex justify-between text-sm">
              <span>watching <b className="text-accent">{current.username}</b></span>
              <span>SCORE <b className="text-primary">{frame.score}</b></span>
            </div>
            <Board state={frame} />
          </>
        )}
      </section>
    </main>
  );
}
