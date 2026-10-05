# Snake Friends Play - Backend Specification & Implementation Guide

This directory contains the OpenAPI 3.1.0 specification for the **Snake Friends Play** backend, designed directly from the requirements, domain types, and data flows of the frontend application (`/frontend`).

---

## 1. Specification Files

- **OpenAPI 3.1.0 (YAML)**: [`backend/openapi.yaml`](./openapi.yaml) (Canonical Specification)
- **OpenAPI 3.1.0 (JSON)**: [`backend/openapi.json`](./openapi.json) (Bundled JSON)
- **Root Symlink**: [`openapi.yaml`](../openapi.yaml)

Both files have been strictly validated with Redocly CLI (`@redocly/cli lint`) with 0 errors and 0 warnings.

---

## 2. Frontend Requirements & Mapping

The frontend client operates through a centralized API interface located at [`frontend/src/lib/api.ts`](../frontend/src/lib/api.ts). The table below outlines how each frontend operation and data structure maps to the OpenAPI specification:

| Frontend Call (`src/lib/api.ts`) | HTTP Method | Path | Auth Required | Request Body / Query Params | Response Type | Status Code |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `api.signup(username, email, password)` | `POST` | `/api/auth/signup` | No | `SignupRequest` (`username`, `email`, `password`) | `UserResponse` (`User`) + `Set-Cookie` | `201 Created` |
| `api.login(email, password)` | `POST` | `/api/auth/login` | No | `LoginRequest` (`email`, `password`) | `UserResponse` (`User`) + `Set-Cookie` | `200 OK` |
| `api.logout()` | `POST` | `/api/auth/logout` | Optional | None | `SuccessMessageResponse` + Clear Cookie | `200 OK` / `204 No Content` |
| `api.getCurrentUser()` | `GET` | `/api/auth/me` | Optional | None | `CurrentUserResponse` (`User \| null`) | `200 OK` |
| `api.getLeaderboard(mode?)` | `GET` | `/api/leaderboard` | No | `?mode=pass-through\|walls&limit=20` | `LeaderboardEntry[]` | `200 OK` |
| `api.submitScore(score, mode)` | `POST` | `/api/leaderboard` | **Yes** | `ScoreSubmission` (`score`, `mode`) | `LeaderboardEntry` | `201 Created` |
| `api.getLivePlayers()` | `GET` | `/api/live/players` | No | None | `LivePlayer[]` | `200 OK` |
| `api.watchPlayer(id, onFrame, tickMs)` (stream) | `GET` | `/api/live/players/{id}/stream` | No | `?tickMs=120` | `text/event-stream` (`GameState` frames) | `200 OK` |
| `watchPlayer` (snapshot fallback) | `GET` | `/api/live/players/{id}/state` | No | Path: `id` | `GameState` | `200 OK` |

---

## 3. Data Schema Definitions

### 3.1 Domain Types

- **`User`**:
  - `username`: `string` (min length 3, unique)
  - `email`: `string` (format: email, unique)
- **`Mode`**:
  - Enum: `"pass-through"` | `"walls"`
- **`Dir`**:
  - Enum: `"up"` | `"down"` | `"left"` | `"right"`
- **`Point`**:
  - `x`: `integer` (grid coordinate 0 to `width - 1`)
  - `y`: `integer` (grid coordinate 0 to `height - 1`)
- **`GameState`**:
  - `width`: `integer` (default: 20)
  - `height`: `integer` (default: 20)
  - `mode`: `Mode`
  - `snake`: `Point[]` (ordered array, element 0 is snake head)
  - `dir`: `Dir` (current moving direction)
  - `pendingDir`: `Dir` (queued direction for next tick)
  - `food`: `Point` (coordinate of the active food)
  - `score`: `integer` (current accumulated score, eating food adds +10)
  - `over`: `boolean` (true if game terminated by wall or self-collision)
- **`LeaderboardEntry`**:
  - `username`: `string`
  - `score`: `integer`
  - `mode`: `Mode`
  - `date`: `string` (`YYYY-MM-DD` or ISO date string)
- **`LivePlayer`**:
  - `id`: `string` (e.g., `"p1"`, `"p2"`, or UUID)
  - `username`: `string`
  - `mode`: `Mode`

### 3.2 Error Responses

All error responses return a standardized JSON structure matching the frontend's error message extractor:
```json
{
  "message": "Invalid email or password",
  "code": "INVALID_CREDENTIALS",
  "details": {}
}
```

Validation constraints expected by the frontend tests:
- Username minimum length: 3 characters (`"Username must be at least 3 characters"`)
- Email format: valid email regex (`"Invalid email"`)
- Password minimum length: 6 characters (`"Password must be at least 6 characters"`)
- Username uniqueness: `"Username taken"`
- Email uniqueness: `"Email already registered"`
- Score submission unauthenticated: `"Not logged in"`

---

## 4. Real-Time Streaming Architecture (Spectating)

The frontend's spectating page (`/watch`) allows users to follow active players in real time:

```typescript
watchPlayer(id: string, onFrame: (s: GameState) => void, tickMs = 120): () => void
```

### Server-Sent Events (SSE) Protocol:
- **Endpoint**: `GET /api/live/players/{id}/stream?tickMs=120`
- **Headers**:
  ```http
  HTTP/1.1 200 OK
  Content-Type: text/event-stream
  Cache-Control: no-cache
  Connection: keep-alive
  ```
- **Payload Event Structure**:
  ```http
  data: {"width":20,"height":20,"mode":"pass-through","snake":[{"x":10,"y":10},{"x":9,"y":10},{"x":8,"y":10}],"dir":"right","pendingDir":"right","food":{"x":15,"y":10},"score":0,"over":false}

  ```
- **Client Unsubscribe**: Closing the SSE `EventSource` terminates the server subscription.

### WebSocket Alternative (Optional / Bi-directional):
If bi-directional gameplay is introduced:
- **Route**: `ws://<host>/ws/live/:id`
- Sends binary or JSON `GameState` messages on every tick.

---

## 5. Recommended Backend Implementation Stacks

When implementing the backend, the following technology stacks are ideal drop-ins for this specification:

### Option A: Node.js / TypeScript with Fastify (Recommended for speed & SSE)
- **Framework**: Fastify with `@fastify/cookie`, `@fastify/session`, and `@fastify/cors`
- **Schema Validation**: TypeBox or Zod using the schemas directly from `openapi.yaml`
- **Database**: SQLite or PostgreSQL with Drizzle ORM or Prisma
- **Why**: Native support for Server-Sent Events, ultra-low latency game ticking (120ms), and easy schema validation.

### Option B: Node.js with Hono / Cloudflare Workers
- **Framework**: Hono with `@hono/zod-openapi`
- **Database**: Cloudflare D1 (SQLite) or Supabase (PostgreSQL)
- **Realtime**: Durable Objects or Cloudflare Workers SSE streaming
- **Why**: Matches the frontend's Nitro/Cloudflare deployment targets.

### Option C: Go (Golang)
- **Framework**: Chi or Gin + `go-chi/render`
- **OpenAPI Generator**: `oapi-codegen` to generate server stubs and types from `openapi.yaml`
- **Realtime**: Channels and SSE handler or Gorilla WebSocket.

### Option D: Python with FastAPI
- **Framework**: FastAPI with Pydantic v2
- **Database**: SQLAlchemy 2.0 with asyncpg / aiosqlite
- **Realtime**: `StreamingResponse(sse_generator(), media_type="text/event-stream")`

---

## 6. Recommended Database Schema (SQL / Relational)

```sql
-- Users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Scores / Leaderboard Table
CREATE TABLE scores (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0),
    mode TEXT NOT NULL CHECK (mode IN ('pass-through', 'walls')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_scores_mode_score ON scores (mode, score DESC);
CREATE INDEX idx_scores_score ON scores (score DESC);

-- Sessions Table (if using server-side session store)
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

---

## 7. Connecting Frontend to the Backend

Once the backend is started (e.g., at `http://localhost:3001` or through a Vite proxy `/api`), `frontend/src/lib/api.ts` can be switched from memory mocks to real `fetch` calls:

```typescript
const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = {
  async signup(username: string, email: string, password: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to sign up");
    return data;
  },

  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid credentials");
    return data;
  },

  async logout(): Promise<void> {
    await fetch(`${BASE_URL}/auth/logout`, { method: "POST", credentials: "include" });
  },

  async getCurrentUser(): Promise<User | null> {
    const res = await fetch(`${BASE_URL}/auth/me`, { credentials: "include" });
    if (!res.ok) return null;
    return await res.json();
  },

  async getLeaderboard(mode?: Mode): Promise<LeaderboardEntry[]> {
    const query = mode ? `?mode=${encodeURIComponent(mode)}` : "";
    const res = await fetch(`${BASE_URL}/leaderboard${query}`);
    if (!res.ok) throw new Error("Failed to load leaderboard");
    return await res.json();
  },

  async submitScore(score: number, mode: Mode): Promise<LeaderboardEntry> {
    const res = await fetch(`${BASE_URL}/leaderboard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, mode }),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to submit score");
    return data;
  },

  async getLivePlayers(): Promise<LivePlayer[]> {
    const res = await fetch(`${BASE_URL}/live/players`);
    if (!res.ok) throw new Error("Failed to load live players");
    return await res.json();
  },

  watchPlayer(id: string, onFrame: (s: GameState) => void, tickMs = 120): () => void {
    const es = new EventSource(`${BASE_URL}/live/players/${encodeURIComponent(id)}/stream?tickMs=${tickMs}`);
    es.onmessage = (event) => {
      try {
        const frame = JSON.parse(event.data);
        onFrame(frame);
      } catch (e) {
        console.error("Failed to parse game frame", e);
      }
    };
    es.onerror = () => {
      es.close();
    };
    return () => es.close();
  },
};
```

---

## 8. Validation Commands

To re-lint and validate the specification:
```sh
# Lint YAML specification
npx -y @redocly/cli lint backend/openapi.yaml

# Bundle to JSON
npx -y @redocly/cli bundle backend/openapi.yaml --output backend/openapi.json
```
