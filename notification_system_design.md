# Notification System Design

---

## Stage 1: Priority Inbox Logic

### Objective
Identify the **top 10 most important notifications** from the Notification API by combining type-based priority weights with recency scoring.

---

### Algorithm

#### Step 1 — Fetch Notifications
A GET request is made to `http://20.207.122.201/evaluation-service/notifications` with a valid `Authorization: Bearer <token>` header. Every API call is logged using the custom `Log()` middleware.

#### Step 2 — Assign Type Weights
Each notification has a `Type` field. We assign weights as per the specification:

| Type      | Weight |
|-----------|--------|
| Placement | 3      |
| Result    | 2      |
| Event     | 1      |

#### Step 3 — Normalize Recency
To fairly compare timestamps across the dataset, recency is normalized to a **0–999 scale**:

```
recencyScore = ((timestamp - minTime) / (maxTime - minTime)) * 999
```

This ensures that more recent notifications score higher within the same type tier.

#### Step 4 — Compute Final Score
The final priority score for each notification is:

```
score = typeWeight * 1000 + recencyScore
```

Multiplying the type weight by 1000 guarantees that **type always takes precedence** over recency. A Placement notification, no matter how old, will always outrank any Result or Event notification.

#### Step 5 — Sort & Slice
All notifications are sorted by score in **descending order**, and the top 10 are returned.

---

### Why This Approach?
- **Simple and deterministic**: No machine learning or complex heuristics — just a transparent, auditable formula.
- **Type dominance**: The 1000x multiplier ensures business-critical types (e.g., Placement) always surface first.
- **Recency as a tiebreaker**: Within the same type, newer notifications are preferred.
- **Scalable**: Works efficiently on any number of notifications with O(n log n) sort complexity.

---

### Files
- `logging_middleware/priorityInbox.js` — Core algorithm implementation
- `logging_middleware/index.js` — Reusable `Log()` middleware used throughout

---

## Stage 2: Enhanced Frontend — Filtering, Pagination & Viewed State

### Objective
Extend the Priority Inbox into a full-featured notification browser with client-side filtering, pagination, and read/unread state tracking.

---

### Architecture

The app uses **Next.js 16 App Router** with a clear server/client split:

```
app/page.js                  (Server Component)
  └── fetches all notifications once on the server
      └── NotificationInbox.js  (Client Component — "use client")
            ├── Section 1: Priority Inbox (static top 10)
            └── Section 2: Browse All (filtered + paginated)
                  └── NotificationCard.js  (Client Component)
hooks/useViewedNotifications.js  (Custom Hook)
lib/logger.js                (Logging Middleware — CORS-proxied)
app/api/log/route.js         (Next.js proxy — avoids browser CORS)
```

---

### Filtering Implementation

- All notifications are fetched **once** from the API on the server.
- Client-side filtering is applied using `Array.filter()` based on the selected type.
- **Desktop**: MUI `Tabs` component with four options — All, Placement, Result, Event.
- **Mobile**: MUI `Select` dropdown for the same options (responsive breakpoint at `sm`).
- Changing the filter resets the page to 1.
- Every filter change triggers: `Log("frontend", "info", "api", "Fetched page 1 with filter [type]")`

---

### Pagination Implementation

- Client-side pagination with **6 notifications per page**.
- MUI `Pagination` component handles page navigation.
- Total pages = `Math.ceil(filteredCount / 6)`.
- Every page change triggers: `Log("frontend", "info", "api", "Fetched page [x] with filter [type]")`

---

### Viewed State Management

Tracked via a **custom React hook** (`hooks/useViewedNotifications.js`):

1. On mount, the hook reads a `viewed_notification_ids` key from `localStorage` (array of IDs).
2. When the user clicks any notification card, `markAsViewed(id)` is called.
3. The ID is added to a `Set`, persisted back to `localStorage`, and the component re-renders.
4. Every new view event triggers: `Log("frontend", "debug", "state", "Notification [ID] marked as viewed")`

**Visual Distinction:**
- **New (unread)**: Full color, hover glow, bright text — active card appearance.
- **Viewed**: 65% opacity, grey tones, dimmed border, `✓ Viewed` badge shown, no hover lift effect.

---

### Logging Coverage (Stage 2)

| Event | Level | Package | Message |
|-------|-------|---------|---------|
| Layout mount | `info` | `style` | MUI layout initialized |
| Hook init | `debug` | `hook` | useViewedNotifications initialized |
| Filter change | `info` | `api` | Fetched page 1 with filter [type] |
| Page change | `info` | `api` | Fetched page [x] with filter [type] |
| Card viewed | `debug` | `state` | Notification [ID] marked as viewed |
| Card render | `debug` | `component` | NotificationCard rendered |

---

### Files (Stage 2)
- `notification_app_fe/components/NotificationInbox.js` — Main layout with filter + pagination
- `notification_app_fe/components/NotificationCard.js` — Card with viewed/unread states
- `notification_app_fe/hooks/useViewedNotifications.js` — Custom localStorage hook
- `notification_app_fe/app/api/log/route.js` — Server-side log proxy (fixes browser CORS)
- `notification_app_fe/lib/logger.js` — Isomorphic logger (server-direct / client-proxied)
