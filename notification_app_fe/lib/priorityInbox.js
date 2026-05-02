import { Log } from "@/lib/logger";

const NOTIF_API_URL = "http://20.207.122.201/evaluation-service/notifications";

/** Weight map: higher number = higher priority */
const TYPE_WEIGHTS = {
    Placement: 3,
    Result: 2,
    Event: 1,
};

/**
 * Computes a priority score for a notification.
 * Formula: typeWeight * 1000 + normalizedRecency (0–999)
 */
function computeScore(notification, minTime, maxTime) {
    const weight = TYPE_WEIGHTS[notification.Type] ?? 0;
    const timestamp = new Date(notification.Timestamp).getTime();
    const range = maxTime - minTime || 1;
    const recency = ((timestamp - minTime) / range) * 999;
    return weight * 1000 + recency;
}

/**
 * Fetches all notifications from the API, scores them by
 * type weight + recency, and returns the top 10.
 *
 * @param {string} token - Bearer access token
 * @returns {Promise<Array>} Top 10 prioritized notifications (with _score)
 */
export async function fetchPriorityNotifications(token) {
    await Log("frontend", "info", "api", "Initiating fetch for priority notifications");

    const response = await fetch(NOTIF_API_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        await Log("frontend", "error", "api", `Notification API returned ${response.status}: ${response.statusText}`);
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const notifications = data.notifications ?? [];

    await Log("frontend", "info", "api", `Successfully fetched ${notifications.length} notifications`);

    // Compute min/max timestamps for recency normalization
    const timestamps = notifications.map((n) => new Date(n.Timestamp).getTime());
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);

    const top10 = notifications
        .map((n) => ({ ...n, _score: computeScore(n, minTime, maxTime) }))
        .sort((a, b) => b._score - a._score)
        .slice(0, 10);

    await Log("frontend", "info", "state", `Priority inbox computed — top 10 selected from ${notifications.length} notifications`);

    return top10;
}
