import { Log } from "./index.js";

// Weight map: higher weight = higher priority
const TYPE_WEIGHTS = {
    Placement: 3,
    Result: 2,
    Event: 1,
};

/**
 * Scores a notification based on type weight and recency.
 * Formula: score = typeWeight * 1000 + (timestamp in seconds, normalized)
 *
 * @param {Object} notification - A notification object from the API
 * @param {number} minTime - Earliest timestamp in the dataset (for normalization)
 * @param {number} maxTime - Latest timestamp in the dataset (for normalization)
 * @returns {number} Computed priority score
 */
function computeScore(notification, minTime, maxTime) {
    const typeWeight = TYPE_WEIGHTS[notification.Type] ?? 0;
    const timestamp = new Date(notification.Timestamp).getTime();
    const timeRange = maxTime - minTime || 1;

    // Normalize recency to a 0–1 scale, then scale to 0–999
    const recencyScore = ((timestamp - minTime) / timeRange) * 999;

    return typeWeight * 1000 + recencyScore;
}

/**
 * Fetches notifications from the API and returns the top 10 by priority.
 *
 * @param {string} token - Bearer access token
 * @returns {Promise<Array>} Top 10 prioritized notifications
 */
export async function getTop10PriorityNotifications(token) {
    await Log("frontend", "info", "api", "Fetching notifications from API");

    const response = await fetch("http://20.207.122.201/evaluation-service/notifications", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        await Log("frontend", "error", "api", `Failed to fetch notifications: ${response.status}`);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const notifications = data.notifications ?? [];

    await Log("frontend", "info", "api", `Fetched ${notifications.length} notifications from API`);

    // Compute min/max timestamps for normalization
    const timestamps = notifications.map((n) => new Date(n.Timestamp).getTime());
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);

    // Score, sort descending, and take top 10
    const scored = notifications
        .map((n) => ({
            ...n,
            _score: computeScore(n, minTime, maxTime),
        }))
        .sort((a, b) => b._score - a._score)
        .slice(0, 10);

    await Log("frontend", "info", "state", "Top 10 priority notifications computed successfully");

    return scored;
}
