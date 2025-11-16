<aside>
📌

Memory layer:

---

## 1. High-level app description

**Product name:** SpeakUp

**Frontend:** Next.js App Router (TypeScript, shadcn UI, Clerk)

**Auth:** Clerk handles sign-in / sign-up; backend trusts Clerk’s JWT and uses `userId` from it.

**Backend goal:** Provide JSON APIs for:

- user profile / settings
- characters list + details
- chat history + message-send
- sessions & grammar insights
- PDF report for a session (later)

The frontend currently uses **dummy data** in:

- Home page
- Character page (chat is local state)
- Insights page
- Settings page

Backend will replace these with real APIs.

---

## 2. Auth model (very important)

Backend **does not** implement login / signup itself.

Clerk does that on the frontend.

Backend should:

- Expect requests to carry a **Clerk session token** (e.g. in `Authorization: Bearer <token>` or via cookies, depending on how you wire it).
- Verify the token (using Clerk SDK or JWKS).
- Extract `userId` (Clerk user id, string).
- Use `userId` as the **primary identity** for all per-user data.

**Public vs Protected:**

- **Public** (no auth required):
  - `GET /api/characters` (optional)
  - `GET /api/characters/:id` (optional)
- **Protected** (must have valid Clerk user):
  - All `/api/me`, `/api/chat`, `/api/sessions`, `/api/insights`, `/api/report` routes

---

## 3. Global API conventions

Assume:

- Base URL: `/api`
- All responses are **JSON**, except PDF endpoint (binary file).
- For success, use:

```json
{
  "success": true,
  "data": { ... }
}

```

- For error:

```json
{
  "success": false,
  "error": "Human-readable message"
}
```

Use standard HTTP status codes:

- 200 OK
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 500 Internal Server Error

---

## 4. Data models (core types)

I’ll define them in **TypeScript-style** to be easy to reuse in Express + TypeScript or JS with JSDoc.

### 4.1. User (stored in your DB)

Frontend places using it:

- Settings page (`SettingsForm`)
- Possibly later: theme preferences, etc.

```tsx
export type UserProfile = {
  id: string; // internal DB id (ObjectId as string, or uuid)
  clerkId: string; // Clerk user ID (from token)
  firstName: string;
  lastName: string;
  email: string;
  // optional fields, future:
  theme?: string; // "light" | "dark" | "ocean" | ...
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
};
```

### 4.2. Character

From frontend:

- `HomePage` uses `characters` array
- `CharacterPage` uses `characterConfigs` (id, name, role, vibe)
- Chat navbar uses `characters` (id, name) for pills

```tsx
export type Character = {
  id: string; // "michael", "angela", "alex"
  name: string; // "Michael"
  role: string; // "Coworker", "College friend", "High school ex"
  vibe: string; // short description used on character page
  // future fields:
  avatarColor?: string;
  avatarEmoji?: string;
};
```

### 4.3. Chat message

From `CharacterChat` component:

- `from`: `"you"` or `"character"`
- `text`: string
- `time`: string like `"09:15"`

Backend should store **full timestamp** and userId.

```tsx
export type ChatMessage = {
  id: string; // message id
  userId: string; // Clerk user id
  characterId: string; // "michael", etc.
  from: "you" | "character";
  text: string;
  createdAt: string; // ISO timestamp
  sessionId: string; // link to Session
};
```

The `time` UI string can be derived on frontend from `createdAt`.

### 4.4. Grammar error / categories

From `InsightsPage`:

```tsx
export type ErrorCategory =
  | "verb"
  | "preposition"
  | "article_determiner"
  | "singular_plural";

export type ErrorCounts = {
  verb: number;
  preposition: number;
  article_determiner: number;
  singular_plural: number;
};
```

### 4.5. Example item (per session)

From `EXAMPLES` in `InsightsPage`:

```tsx
export type ExampleItem = {
  category: ErrorCategory;
  original: string;
  corrected: string;
  explanation: string;
};
```

### 4.6. Session summary (for list & charts)

From `SessionSummary` in frontend:

```tsx
export type SessionSummary = {
  id: string;
  userId: string; // Clerk user
  characterId: string; // "michael"
  character: string; // "Michael" (denormalized)
  title: string; // "Office small talk before stand-up"
  date: string; // e.g. "2025-11-15T20:00:00.000Z"
  mode: "text" | "voice";
  durationMinutes: number; // e.g. 9 (instead of "9 min")
  errors: ErrorCounts;
  score: number; // 0–100
};
```

### 4.7. Full session (with examples)

```tsx
export type Session = SessionSummary & {
  examples: ExampleItem[];
};
```

### 4.8. Insights summary

From top snapshot in `InsightsPage`:

```tsx
export type InsightsSummary = {
  totalSessions: number;
  totalMinutes: number;
  averageScore: number; // 0–100
};
```

---

## 5. Endpoint spec (final)

### Group 1: User profile / settings

### 1. `GET /api/me`

**Auth:** Required (Clerk)

**Purpose:** Load user profile for Settings page and potentially Home greeting.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "654321...",
    "clerkId": "user_abc123",
    "firstName": "Learner",
    "lastName": "User",
    "email": "you@example.com",
    "theme": "light",
    "createdAt": "2025-11-15T10:00:00.000Z",
    "updatedAt": "2025-11-15T10:00:00.000Z"
  }
}
```

If user doesn’t exist yet in DB:

- Option A: create a new default profile on first request.
- Option B: return 404 and let frontend handle; **recommended** is A for smoother UX.

---

### 2. `PUT /api/me`

**Auth:** Required

**Purpose:** Update basic user profile info from `SettingsForm`.

**Request body:**

```json
{
  "firstName": "New",
  "lastName": "Name",
  "email": "new@example.com",
  "password": "optional-or-null",
  "theme": "dark" // optional, if you decide to persist it
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "654321...",
    "clerkId": "user_abc123",
    "firstName": "New",
    "lastName": "Name",
    "email": "new@example.com",
    "theme": "dark",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### Group 2: Characters

Currently hardcoded in:

- `app/app/home/page.tsx`
- `app/app/character/[id]/page.tsx`
- `components/chat-navbar.tsx`

You can move them to DB.

### 3. `GET /api/characters`

**Auth:**

- Can be **public** OR **protected**; up to you. For simplicity, make it public.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "michael",
      "name": "Michael",
      "role": "Coworker",
      "vibe": "Semi-formal, supportive, professional small talk."
    },
    {
      "id": "angela",
      "name": "Angela",
      "role": "College friend",
      "vibe": "Casual, warm, emoji-friendly."
    },
    {
      "id": "alex",
      "name": "Alex",
      "role": "High school ex",
      "vibe": "A bit emotional, reflective, sometimes awkward."
    }
  ]
}
```

---

### 4. `GET /api/characters/:id`

**Auth:** Can be public

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "michael",
    "name": "Michael",
    "role": "Coworker",
    "vibe": "Semi-formal, supportive, professional small talk."
  }
}
```

**If not found → 404:**

```json
{
  "success": false,
  "error": "Character not found"
}
```

This supports the fallback logic in `CharacterPage` (“Character not found” message).

---

### 5. `POST /api/characters` (future, for Add Character page)

If you want `Add Character` to be real:

**Auth:** Required (probably)

**Request:**

```json
{
  "name": "Sara",
  "role": "Speaking exam coach",
  "vibe": "Calm, encouraging, focused on IELTS/TOEFL."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "auto-generated-id",
    "name": "Sara",
    "role": "Speaking exam coach",
    "vibe": "Calm, encouraging, focused on IELTS/TOEFL."
  }
}
```

---

### Group 3: Chat

From `CharacterChat` component:

- Initially local state messages.
- Final version should load messages and send new messages to backend.

### 6. `GET /api/chat/:characterId/history`

**Auth:** Required

**Purpose:** Get message history for one user and one character.

**Query params (optional):** `?limit=50` etc.

**Response:**

```json
{
  "success": true,
  "data": {
    "characterId": "michael",
    "messages": [
      {
        "id": "m1",
        "from": "character",
        "text": "Hey, I'm Michael. Ready to practice today?",
        "createdAt": "2025-11-15T12:00:00.000Z",
        "sessionId": "session-1"
      },
      {
        "id": "m2",
        "from": "you",
        "text": "Yes, I want to practice speaking more naturally.",
        "createdAt": "2025-11-15T12:01:00.000Z",
        "sessionId": "session-1"
      }
    ]
  }
}
```

Frontend can map this to `Message[]` and show in `CharacterChat`.

---

### 7. `POST /api/chat/:characterId/message`

**Auth:** Required

**Purpose:** User sends a message; backend stores it, calls AI, and returns the AI’s reply.

**Request body:**

```json
{
  "text": "Hi Michael, how are you?",
  "sessionId": "session-1" // optional – backend can create if missing
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "userMessage": {
      "id": "m3",
      "from": "you",
      "text": "Hi Michael, how are you?",
      "createdAt": "2025-11-15T12:05:00.000Z",
      "sessionId": "session-1"
    },
    "characterMessage": {
      "id": "m4",
      "from": "character",
      "text": "I'm doing well! How was your weekend?",
      "createdAt": "2025-11-15T12:05:02.000Z",
      "sessionId": "session-1"
    }
  }
}
```

---

### Group 4: Sessions & Insights

Front-end `InsightsPage` uses two kinds of data:

1. **Snapshot summary** (top row cards)
2. **Per-session list + per-session details (errors and examples)**

### 8. `GET /api/insights/summary`

**Auth:** Required

**Based on all sessions for that user.**

**Response:**

```json
{
  "success": true,
  "data": {
    "totalSessions": 3,
    "totalMinutes": 27,
    "averageScore": 78
  }
}
```

`totalMinutes` is sum of all `durationMinutes` across `Session`.

---

### 9. `GET /api/sessions`

**Auth:** Required

**Purpose:** List all past sessions for a user (for left column of `InsightsPage`).

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "session-1",
      "userId": "user_abc123",
      "characterId": "michael",
      "character": "Michael",
      "title": "Office small talk before stand-up",
      "date": "2025-11-15T12:00:00.000Z",
      "mode": "text",
      "durationMinutes": 9,
      "score": 78,
      "errors": {
        "verb": 4,
        "preposition": 3,
        "article_determiner": 2,
        "singular_plural": 1
      }
    },
    {
      "id": "session-2",
      "userId": "user_abc123",
      "characterId": "angela",
      "character": "Angela",
      "title": "Planning a weekend with a friend",
      "date": "2025-11-14T15:00:00.000Z",
      "mode": "voice",
      "durationMinutes": 7,
      "score": 84,
      "errors": {
        "verb": 2,
        "preposition": 1,
        "article_determiner": 2,
        "singular_plural": 0
      }
    }
  ]
}
```

These fields match exactly what the frontend uses in its `SESSIONS` constant.

---

### 10. `GET /api/sessions/:id`

**Auth:** Required

**Purpose:** Return a **full session** with examples.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "session-1",
    "userId": "user_abc123",
    "characterId": "michael",
    "character": "Michael",
    "title": "Office small talk before stand-up",
    "date": "2025-11-15T12:00:00.000Z",
    "mode": "text",
    "durationMinutes": 9,
    "score": 78,
    "errors": {
      "verb": 4,
      "preposition": 3,
      "article_determiner": 2,
      "singular_plural": 1
    },
    "examples": [
      {
        "category": "verb",
        "original": "He go to the meeting every Monday.",
        "corrected": "He goes to the meeting every Monday.",
        "explanation": "Use 'goes' (3rd person singular) instead of 'go'."
      },
      {
        "category": "preposition",
        "original": "I will talk you about the project.",
        "corrected": "I will talk to you about the project.",
        "explanation": "We say 'talk to someone', not 'talk someone'."
      }
    ]
  }
}
```

You can have `InsightsPage` call `/api/sessions` to populate list and `/api/sessions/:id` for full details.

---

### 11. `POST /api/sessions`

**Auth:** Required

**Purpose:** Save session analytics when chat is “done”.

This will be called by frontend once you wire it, or by backend after some threshold.

**Request body example:**

```json
{
  "characterId": "michael",
  "title": "Office small talk before stand-up",
  "mode": "text",
  "durationMinutes": 9,
  "score": 78,
  "errors": {
    "verb": 4,
    "preposition": 3,
    "article_determiner": 2,
    "singular_plural": 1
  },
  "examples": [
    {
      "category": "verb",
      "original": "He go to the meeting every Monday.",
      "corrected": "He goes to the meeting every Monday.",
      "explanation": "Use 'goes' (3rd person singular) instead of 'go'."
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "session-1",
    "userId": "user_abc123",
    "characterId": "michael",
    "title": "Office small talk before stand-up",
    "date": "2025-11-15T12:00:00.000Z",
    "mode": "text",
    "durationMinutes": 9,
    "score": 78,
    "errors": { ... },
    "examples": [ ... ]
  }
}

```

---

### Group 5: PDF report

Frontend currently has a button:

```tsx
alert(
  "Later: call your backend PDF endpoint here (e.g. /api/sessions/:id/pdf)."
);
```

So we define:

### 12. `GET /api/sessions/:id/pdf`

**Auth:** Required

**Purpose:** Generate & stream a PDF for a session.

**Response:**

- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="speakup-session-<id>.pdf"`
- Raw PDF bytes.

Internally, backend will:

- Load the session by id and userId.
- Load messages (optional).
- Render to PDF.

---

## 6. How frontend pages map to these endpoints

So the next LLM can know which page calls what.

### `frontend/app/app/home/page.tsx`

Should eventually call:

- `GET /api/me` → for “Welcome back, {name}”
- `GET /api/characters` → for characters list
- Optionally `GET /api/sessions?limit=1` → for “Continue practicing” section

---

### `frontend/app/app/character/[id]/page.tsx`

Should eventually call:

- `GET /api/characters/:id` → load character details (name, role, vibe)
- `GET /api/chat/:characterId/history` → show last messages in `CharacterChat`
- `POST /api/chat/:characterId/message` → whenever user sends a message

---

### `frontend/components/character-chat.tsx`

Will integrate with:

- `GET /api/chat/:characterId/history`
- `POST /api/chat/:characterId/message`

Currently it uses local state. Replace `useState` initialization with data from `/history`, and `handleSend` with a call to `/message`.

---

### `frontend/app/app/insights/page.tsx`

Will integrate with:

- `GET /api/insights/summary` → top 3 cards
- `GET /api/sessions` → left-hand session list
- `GET /api/sessions/:id` → to populate the charts & examples when a session is selected
- `GET /api/sessions/:id/pdf` → for the “Download PDF report” button

---

### `frontend/app/app/settings/page.tsx` & `components/settings-form.tsx`

Will integrate with:

- `GET /api/me` → load `fakeUser` initial data
- `PUT /api/me` → submit and save changes

---

### `frontend/app/app/add-character/page.tsx` (simple placeholder now)

If you decide to implement:

- `POST /api/characters`
- `GET /api/characters` (to show user’s custom characters too)

---

### `frontend/app/auth/login/page.tsx`, `frontend/app/auth/signup/page.tsx`

These are using `Clerk` components:

- No backend endpoints needed for auth.
- Backend just validates Clerk tokens for all protected routes.

---

</aside>
