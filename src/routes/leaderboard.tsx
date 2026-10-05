import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, type LeaderboardEntry } from "@/lib/api";
import type { Mode } from "@/lib/snake";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Snake" },
      { name: "description", content: "Top snake scores in pass-through and walls modes." },
      { property: "og:title", content: "Snake Leaderboard" },
      { property: "og:description", content: "Top snake scores in pass-through and walls modes." },
    ],
  }),
  component: Leaderboard,
});

function Leaderboard() {
  const [mode, setMode] = useState<Mode | undefined>();
  const [rows, setRows] = useState<LeaderboardEntry[] | null>(null);
  useEffect(() => {
    setRows(null);
    api.getLeaderboard(mode).then(setRows);
  }, [mode]);
  const tab = (on: boolean) => `px-3 py-1 border ${on ? "bg-primary text-primary-foreground" : "hover:border-primary"}`;
  return (
    <main className="mx-auto max-w-xl p-4">
      <h1 className="mb-4 text-2xl font-bold text-primary">&gt; leaderboard</h1>
      <div className="mb-4 flex gap-2">
        <button className={tab(!mode)} onClick={() => setMode(undefined)}>all</button>
        <button className={tab(mode === "pass-through")} onClick={() => setMode("pass-through")}>pass-through</button>
        <button className={tab(mode === "walls")} onClick={() => setMode("walls")}>walls</button>
      </div>
      {!rows ? <p className="text-muted-foreground">loading...</p> : (
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground"><tr><th>#</th><th>player</th><th>mode</th><th className="text-right">score</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="py-2">{i + 1}</td><td className="text-accent">{r.username}</td>
                <td className="text-muted-foreground">{r.mode}</td><td className="text-right text-primary">{r.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
