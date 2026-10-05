import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export function AuthForm({ kind }: { kind: "login" | "signup" }) {
  const { login, signup } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(kind === "login" ? "demo@snake.io" : "");
  const [password, setPassword] = useState(kind === "login" ? "demo123" : "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (kind === "login") await login(email, password);
      else await signup(username, email, password);
      nav({ to: "/" });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const input = "w-full border bg-board px-3 py-2 outline-none focus:border-primary";
  return (
    <form onSubmit={submit} className="mx-auto mt-10 w-full max-w-sm space-y-4 border p-6">
      <h1 className="text-2xl font-bold text-primary">{kind === "login" ? "> log in" : "> sign up"}</h1>
      {kind === "signup" && (
        <input className={input} placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      )}
      <input className={input} placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className={input} type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
      <button disabled={busy} className="w-full bg-primary py-2 font-bold text-primary-foreground disabled:opacity-50">
        {busy ? "..." : kind === "login" ? "Log in" : "Create account"}
      </button>
      <p className="text-sm text-muted-foreground">
        {kind === "login" ? (
          <>No account? <Link to="/signup" className="text-primary">Sign up</Link> · demo: demo@snake.io / demo123</>
        ) : (
          <>Have an account? <Link to="/login" className="text-primary">Log in</Link></>
        )}
      </p>
    </form>
  );
}
