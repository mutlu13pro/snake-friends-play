import { n as __toESM } from "../_runtime.mjs";
import { i as step, n as changeDirection, r as createGame, t as api } from "./api-9dT28oaL.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./auth-aQ7v4xrf.mjs";
import { t as Board } from "./Board-hrSSp_HD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DIYzpfJ2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEYS = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "left",
	ArrowRight: "right",
	w: "up",
	s: "down",
	a: "left",
	d: "right"
};
function Play() {
	const { user } = useAuth();
	const [mode, setMode] = (0, import_react.useState)("pass-through");
	const [game, setGame] = (0, import_react.useState)(() => createGame("pass-through"));
	const [running, setRunning] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("");
	const submitted = (0, import_react.useRef)(false);
	const reset = (0, import_react.useCallback)((m) => {
		setGame(createGame(m));
		setRunning(false);
		setMsg("");
		submitted.current = false;
	}, []);
	(0, import_react.useEffect)(() => {
		if (!running || game.over) return;
		const t = setInterval(() => setGame((g) => step(g)), 110);
		return () => clearInterval(t);
	}, [running, game.over]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
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
	}, [
		game.over,
		mode,
		reset
	]);
	(0, import_react.useEffect)(() => {
		if (game.over && !submitted.current && game.score > 0) {
			submitted.current = true;
			if (user) api.submitScore(game.score, mode).then(() => setMsg("Score saved to leaderboard!"));
			else setMsg("Log in to save your score.");
		}
	}, [
		game.over,
		game.score,
		mode,
		user
	]);
	const btn = (on) => `px-3 py-1 border ${on ? "bg-primary text-primary-foreground" : "hover:border-primary"}`;
	const press = (d) => {
		setGame((g) => changeDirection(g, d));
		setRunning(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex max-w-xl flex-col items-center gap-4 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: ["pass-through", "walls"].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: btn(mode === m),
					onClick: () => {
						setMode(m);
						reset(m);
					},
					children: m
				}, m))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full max-w-[400px] justify-between text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["SCORE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
					className: "text-primary",
					children: game.score
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: game.over ? "space: restart" : running ? "space: pause" : "arrows / space: start"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, { state: game }),
			msg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-accent",
				children: msg
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2 sm:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn(false),
						onClick: () => press("up"),
						children: "▲"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn(false),
						onClick: () => press("left"),
						children: "◀"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn(false),
						onClick: () => game.over ? reset(mode) : setRunning((r) => !r),
						children: game.over ? "↻" : running ? "❚❚" : "▶"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn(false),
						onClick: () => press("right"),
						children: "▶"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: btn(false),
						onClick: () => press("down"),
						children: "▼"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "hidden border px-4 py-1 hover:border-primary sm:block",
				onClick: () => reset(mode),
				children: "Restart"
			})
		]
	});
}
//#endregion
export { Play as component };
