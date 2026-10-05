import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

const link = "px-2 py-1 hover:text-primary";
const active = { className: "text-primary underline underline-offset-4" };

export function Nav() {
  const { user, logout } = useAuth();
  return (
    <header className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
      <Link to="/" className="text-xl font-bold text-primary text-glow">SNAKE_</Link>
      <nav className="flex flex-wrap items-center gap-1 text-sm">
        <Link to="/" className={link} activeProps={active} activeOptions={{ exact: true }}>Play</Link>
        <Link to="/leaderboard" className={link} activeProps={active}>Leaderboard</Link>
        <Link to="/watch" className={link} activeProps={active}>Watch</Link>
        {user ? (
          <>
            <span className="px-2 text-accent" data-testid="username">@{user.username}</span>
            <button className={link} onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" className={link} activeProps={active}>Log in</Link>
            <Link to="/signup" className={link} activeProps={active}>Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
