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

