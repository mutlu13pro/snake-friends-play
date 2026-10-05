import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./auth-aQ7v4xrf.mjs";
import { b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuthForm-DN187lZW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthForm({ kind }) {
	const { login, signup } = useAuth();
	const nav = useNavigate();
	const [username, setUsername] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)(kind === "login" ? "demo@snake.io" : "");
	const [password, setPassword] = (0, import_react.useState)(kind === "login" ? "demo123" : "");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		setError("");
		setBusy(true);
		try {
			if (kind === "login") await login(email, password);
			else await signup(username, email, password);
			nav({ to: "/" });
		} catch (err) {
			setError(err.message);
		} finally {
			setBusy(false);
		}
	};
	const input = "w-full border bg-board px-3 py-2 outline-none focus:border-primary";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "mx-auto mt-10 w-full max-w-sm space-y-4 border p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold text-primary",
				children: kind === "login" ? "> log in" : "> sign up"
			}),
			kind === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: input,
				placeholder: "username",
				value: username,
				onChange: (e) => setUsername(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: input,
				placeholder: "email",
				value: email,
				onChange: (e) => setEmail(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: input,
				type: "password",
				placeholder: "password",
				value: password,
				onChange: (e) => setPassword(e.target.value)
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				role: "alert",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				disabled: busy,
				className: "w-full bg-primary py-2 font-bold text-primary-foreground disabled:opacity-50",
				children: busy ? "..." : kind === "login" ? "Log in" : "Create account"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: kind === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"No account? ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/signup",
						className: "text-primary",
						children: "Sign up"
					}),
					" · demo: demo@snake.io / demo123"
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Have an account? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "text-primary",
					children: "Log in"
				})] })
			})
		]
	});
}
//#endregion
export { AuthForm as t };
