//#region node_modules/.nitro/vite/services/ssr/assets/api-9dT28oaL.js
var DELTA = {
	up: {
		x: 0,
		y: -1
	},
	down: {
		x: 0,
		y: 1
	},
	left: {
		x: -1,
		y: 0
	},
	right: {
		x: 1,
		y: 0
	}
};
var OPPOSITE = {
	up: "down",
	down: "up",
	left: "right",
	right: "left"
};
var samePoint = (a, b) => a.x === b.x && a.y === b.y;
function randomFood(width, height, snake, rng = Math.random) {
	const free = [];
	for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (!snake.some((s) => s.x === x && s.y === y)) free.push({
		x,
		y
	});
	if (free.length === 0) return {
		x: -1,
		y: -1
	};
	return free[Math.floor(rng() * free.length)];
}
function createGame(mode, width = 20, height = 20, rng = Math.random) {
	const cx = Math.floor(width / 2);
	const cy = Math.floor(height / 2);
	const snake = [
		{
			x: cx,
			y: cy
		},
		{
			x: cx - 1,
			y: cy
		},
		{
			x: cx - 2,
			y: cy
		}
	];
	return {
		width,
		height,
		mode,
		snake,
		dir: "right",
		pendingDir: "right",
		food: randomFood(width, height, snake, rng),
		score: 0,
		over: false
	};
}
/** Queue a direction change; reversing into yourself is ignored. */
function changeDirection(state, dir) {
	if (state.over || OPPOSITE[state.dir] === dir) return state;
	return {
		...state,
		pendingDir: dir
	};
}
function nextHead(state, dir) {
	const d = DELTA[dir];
	const h = state.snake[0];
	let x = h.x + d.x;
	let y = h.y + d.y;
	if ((x < 0 || y < 0 || x >= state.width || y >= state.height) && state.mode === "walls") return {
		head: {
			x,
			y
		},
		hitWall: true
	};
	x = (x + state.width) % state.width;
	y = (y + state.height) % state.height;
	return {
		head: {
			x,
			y
		},
		hitWall: false
	};
}
function step(state, rng = Math.random) {
	if (state.over) return state;
	const dir = state.pendingDir;
	const { head, hitWall } = nextHead(state, dir);
	if (hitWall) return {
		...state,
		dir,
		over: true
	};
	const eating = samePoint(head, state.food);
	const body = eating ? state.snake : state.snake.slice(0, -1);
	if (body.some((p) => samePoint(p, head))) return {
		...state,
		dir,
		over: true
	};
	const snake = [head, ...body];
	return {
		...state,
		dir,
		snake,
		score: eating ? state.score + 10 : state.score,
		food: eating ? randomFood(state.width, state.height, snake, rng) : state.food
	};
}
/** Simple bot used to simulate other players: greedy toward food, avoids death. */
function botDirection(state) {
	const safe = [
		"up",
		"down",
		"left",
		"right"
	].filter((d) => {
		if (OPPOSITE[state.dir] === d) return false;
		const { head, hitWall } = nextHead(state, d);
		if (hitWall) return false;
		return !state.snake.slice(0, -1).some((p) => samePoint(p, head));
	});
	if (safe.length === 0) return state.dir;
	const dist = (p) => Math.abs(p.x - state.food.x) + Math.abs(p.y - state.food.y);
	safe.sort((a, b) => dist(nextHead(state, a).head) - dist(nextHead(state, b).head));
	return safe[0];
}
/**
* Single place for every backend call. Everything is mocked in memory for now;
* swap the bodies of these functions for real HTTP calls later.
*/
var delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));
function seed() {
	const users = /* @__PURE__ */ new Map();
	users.set("demo@snake.io", {
		username: "demo",
		email: "demo@snake.io",
		password: "demo123"
	});
	return {
		users,
		session: null,
		scores: [
			"viper",
			"nokia3310",
			"pixelpy",
			"coil",
			"slyther",
			"mamba",
			"byte",
			"noodle"
		].map((n, i) => ({
			username: n,
			score: 400 - i * 40,
			mode: i % 2 ? "walls" : "pass-through",
			date: "2026-10-0" + (i % 4 + 1)
		}))
	};
}
var db = seed();
var api = {
	async login(email, password) {
		await delay();
		const u = db.users.get(email.trim().toLowerCase());
		if (!u || u.password !== password) throw new Error("Invalid email or password");
		db.session = {
			username: u.username,
			email: u.email
		};
		return db.session;
	},
	async signup(username, email, password) {
		await delay();
		const e = email.trim().toLowerCase();
		const name = username.trim();
		if (name.length < 3) throw new Error("Username must be at least 3 characters");
		if (!/^\S+@\S+\.\S+$/.test(e)) throw new Error("Invalid email");
		if (password.length < 6) throw new Error("Password must be at least 6 characters");
		if (db.users.has(e)) throw new Error("Email already registered");
		if ([...db.users.values()].some((u) => u.username.toLowerCase() === name.toLowerCase())) throw new Error("Username taken");
		db.users.set(e, {
			username: name,
			email: e,
			password
		});
		db.session = {
			username: name,
			email: e
		};
		return db.session;
	},
	async logout() {
		await delay(50);
		db.session = null;
	},
	async getCurrentUser() {
		await delay(50);
		return db.session;
	},
	async getLeaderboard(mode) {
		await delay();
		return db.scores.filter((s) => !mode || s.mode === mode).sort((a, b) => b.score - a.score).slice(0, 20);
	},
	async submitScore(score, mode) {
		await delay();
		if (!db.session) throw new Error("Not logged in");
		const entry = {
			username: db.session.username,
			score,
			mode,
			date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
		};
		db.scores.push(entry);
		return entry;
	},
	async getLivePlayers() {
		await delay();
		return LIVE_PLAYERS;
	},
	/** Subscribe to a live game. Returns an unsubscribe function. */
	watchPlayer(id, onFrame, tickMs = 120) {
		const player = LIVE_PLAYERS.find((p) => p.id === id);
		if (!player) throw new Error("Player not found");
		let state = liveGames.get(id) ?? createGame(player.mode);
		onFrame(state);
		const t = setInterval(() => {
			state = simulateTick(state);
			liveGames.set(id, state);
			onFrame(state);
		}, tickMs);
		return () => clearInterval(t);
	}
};
var LIVE_PLAYERS = [
	{
		id: "p1",
		username: "viper",
		mode: "pass-through"
	},
	{
		id: "p2",
		username: "mamba",
		mode: "walls"
	},
	{
		id: "p3",
		username: "noodle",
		mode: "walls"
	}
];
var liveGames = /* @__PURE__ */ new Map();
/** One tick of a simulated player; restarts automatically on game over. */
function simulateTick(state) {
	if (state.over) return createGame(state.mode, state.width, state.height);
	return step({
		...state,
		pendingDir: botDirection(state)
	});
}
//#endregion
export { step as i, changeDirection as n, createGame as r, api as t };
