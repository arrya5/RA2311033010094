"use client";

import { useState, useEffect, useCallback } from "react";
import { Log } from "@/lib/logger";

const STORAGE_KEY = "viewed_notification_ids";

/**
 * Custom hook to manage "viewed" notification state via localStorage.
 * Logs every new view event using the custom logger.
 */
export function useViewedNotifications() {
    const [viewedIds, setViewedIds] = useState(new Set());

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setViewedIds(new Set(JSON.parse(stored)));
            }
        } catch (_) {
            // Silently fail if localStorage is unavailable
        }
        Log("frontend", "debug", "hook", "useViewedNotifications hook initialized from localStorage");
    }, []);

    const markAsViewed = useCallback((id) => {
        setViewedIds((prev) => {
            if (prev.has(id)) return prev;
            const next = new Set(prev);
            next.add(id);
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
            } catch (_) {}
            Log("frontend", "debug", "state", `Notification ${id} marked as viewed`);
            return next;
        });
    }, []);

    const isViewed = useCallback((id) => viewedIds.has(id), [viewedIds]);

    return { markAsViewed, isViewed };
}
