import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Board-hrSSp_HD.js
var import_jsx_runtime = require_jsx_runtime();
function Board({ state, size = 400 }) {
	const cell = 100 / state.width;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative aspect-square w-full border-2 bg-board",
		style: {
			maxWidth: size,
			borderColor: state.mode === "walls" ? "var(--wall)" : "var(--border)",
			borderStyle: state.mode === "walls" ? "solid" : "dashed"
		},
		"data-testid": "board",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute rounded-full bg-food shadow-glow-food",
				style: {
					left: `${state.food.x * cell}%`,
					top: `${state.food.y * cell}%`,
					width: `${cell}%`,
					height: `${cell}%`
				}
			}),
			state.snake.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: i === 0 ? "absolute bg-primary shadow-glow" : "absolute bg-primary/70",
				style: {
					left: `${p.x * cell}%`,
					top: `${p.y * cell}%`,
					width: `${cell}%`,
					height: `${cell}%`
				}
			}, i)),
			state.over && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center bg-background/70 text-2xl font-bold text-food",
				children: "GAME OVER"
			})
		]
	});
}
//#endregion
export { Board as t };
