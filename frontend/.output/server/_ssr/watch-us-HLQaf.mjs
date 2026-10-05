import { n as __toESM } from "../_runtime.mjs";
import { t as api } from "./api-9dT28oaL.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as Board } from "./Board-hrSSp_HD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/watch-us-HLQaf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Watch() {
	const [players, setPlayers] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [frame, setFrame] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		api.getLivePlayers().then((p) => {
			setPlayers(p);
			setSelected(p[0]?.id ?? null);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (!selected) return;
		return api.watchPlayer(selected, setFrame);
	}, [selected]);
	const current = players.find((p) => p.id === selected);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex max-w-3xl flex-col gap-4 p-4 sm:flex-row",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "sm:w-48",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-2 text-lg font-bold text-primary",
				children: "> live now"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1",
				children: players.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setSelected(p.id),
					className: `w-full border px-2 py-1 text-left text-sm ${p.id === selected ? "border-primary text-primary" : "hover:border-primary"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-food" }),
						p.username,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: ["· ", p.mode]
						})
					]
				}) }, p.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "flex-1",
			children: current && frame && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex justify-between text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["watching ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
					className: "text-accent",
					children: current.username
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["SCORE ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
					className: "text-primary",
					children: frame.score
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Board, { state: frame })] })
		})]
	});
}
//#endregion
export { Watch as component };
