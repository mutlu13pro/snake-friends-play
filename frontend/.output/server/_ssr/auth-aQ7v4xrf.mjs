import { n as __toESM } from "../_runtime.mjs";
import { t as api } from "./api-9dT28oaL.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-aQ7v4xrf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx = (0, import_react.createContext)(null);
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		api.getCurrentUser().then(setUser);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			user,
			login: async (e, p) => setUser(await api.login(e, p)),
			signup: async (u, e, p) => setUser(await api.signup(u, e, p)),
			logout: async () => {
				await api.logout();
				setUser(null);
			}
		},
		children
	});
}
function useAuth() {
	const c = (0, import_react.useContext)(Ctx);
	if (!c) throw new Error("useAuth outside AuthProvider");
	return c;
}
//#endregion
export { useAuth as n, AuthProvider as t };
