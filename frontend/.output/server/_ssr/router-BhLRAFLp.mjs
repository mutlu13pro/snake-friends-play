import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth, t as AuthProvider } from "./auth-aQ7v4xrf.mjs";
import { _ as createFileRoute, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRouteWithContext, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BhLRAFLp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-TyAMtWMs.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var link = "px-2 py-1 hover:text-primary";
var active = { className: "text-primary underline underline-offset-4" };
function Nav() {
	const { user, logout } = useAuth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "text-xl font-bold text-primary text-glow",
			children: "SNAKE_"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "flex flex-wrap items-center gap-1 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: link,
					activeProps: active,
					activeOptions: { exact: true },
					children: "Play"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/leaderboard",
					className: link,
					activeProps: active,
					children: "Leaderboard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/watch",
					className: link,
					activeProps: active,
					children: "Watch"
				}),
				user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "px-2 text-accent",
					"data-testid": "username",
					children: ["@", user.username]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: link,
					onClick: logout,
					children: "Log out"
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: link,
					activeProps: active,
					children: "Log in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/signup",
					className: link,
					activeProps: active,
					children: "Sign up"
				})] })
			]
		})]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$5 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Snake" },
			{
				name: "description",
				content: "Retro snake game with leaderboard and live spectating."
			},
			{
				property: "og:title",
				content: "Snake"
			},
			{
				property: "og:description",
				content: "Retro snake game with leaderboard and live spectating."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$5.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})] })
	});
}
var $$splitComponentImporter$4 = () => import("./routes-DIYzpfJ2.mjs");
var Route$4 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Snake — Play pass-through or walls mode" },
		{
			name: "description",
			content: "Classic snake with pass-through and walls modes, leaderboard and live spectating."
		},
		{
			property: "og:title",
			content: "Snake — Play now"
		},
		{
			property: "og:description",
			content: "Classic snake with two modes, leaderboard and live spectating."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./leaderboard-OoSgLVHF.mjs");
var Route$3 = createFileRoute("/leaderboard")({
	head: () => ({ meta: [
		{ title: "Leaderboard — Snake" },
		{
			name: "description",
			content: "Top snake scores in pass-through and walls modes."
		},
		{
			property: "og:title",
			content: "Snake Leaderboard"
		},
		{
			property: "og:description",
			content: "Top snake scores in pass-through and walls modes."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./login-DDvxeAsy.mjs");
var Route$2 = createFileRoute("/login")({
	head: () => ({ meta: [
		{ title: "Log in — Snake" },
		{
			name: "description",
			content: "Log in to save your snake scores."
		},
		{
			property: "og:title",
			content: "Log in — Snake"
		},
		{
			property: "og:description",
			content: "Log in to save your snake scores."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./signup-08ufGFM-.mjs");
var Route$1 = createFileRoute("/signup")({
	head: () => ({ meta: [
		{ title: "Sign up — Snake" },
		{
			name: "description",
			content: "Create a snake account and climb the leaderboard."
		},
		{
			property: "og:title",
			content: "Sign up — Snake"
		},
		{
			property: "og:description",
			content: "Create a snake account and climb the leaderboard."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./watch-us-HLQaf.mjs");
var Route = createFileRoute("/watch")({
	head: () => ({ meta: [
		{ title: "Watch live — Snake" },
		{
			name: "description",
			content: "Follow other snake players live as they play."
		},
		{
			property: "og:title",
			content: "Watch live snake games"
		},
		{
			property: "og:description",
			content: "Follow other snake players live as they play."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$4.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$5
	}),
	LeaderboardRoute: Route$3.update({
		id: "/leaderboard",
		path: "/leaderboard",
		getParentRoute: () => Route$5
	}),
	LoginRoute: Route$2.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$5
	}),
	SignupRoute: Route$1.update({
		id: "/signup",
		path: "/signup",
		getParentRoute: () => Route$5
	}),
	WatchRoute: Route.update({
		id: "/watch",
		path: "/watch",
		getParentRoute: () => Route$5
	})
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
