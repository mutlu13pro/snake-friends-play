import { n as __toESM } from "../_runtime.mjs";
import { t as api } from "./api-9dT28oaL.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leaderboard-OoSgLVHF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Leaderboard() {
	const [mode, setMode] = (0, import_react.useState)();
	const [rows, setRows] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setRows(null);
		api.getLeaderboard(mode).then(setRows);
	}, [mode]);
	const tab = (on) => `px-3 py-1 border ${on ? "bg-primary text-primary-foreground" : "hover:border-primary"}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-4 text-2xl font-bold text-primary",
				children: "> leaderboard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: tab(!mode),
						onClick: () => setMode(void 0),
						children: "all"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: tab(mode === "pass-through"),
						onClick: () => setMode("pass-through"),
						children: "pass-through"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: tab(mode === "walls"),
						onClick: () => setMode("walls"),
						children: "walls"
					})
				]
			}),
			!rows ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "loading..."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-left text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "#" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "player" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "mode" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right",
							children: "score"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2",
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-accent",
							children: r.username
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-muted-foreground",
							children: r.mode
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right text-primary",
							children: r.score
						})
					]
				}, i)) })]
			})
		]
	});
}
//#endregion
export { Leaderboard as component };
