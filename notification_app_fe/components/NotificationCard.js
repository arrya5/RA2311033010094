"use client";

import { Log } from "@/lib/logger";
import { useEffect } from "react";
import styles from "./NotificationCard.module.css";

const TYPE_LABELS = {
    Placement: { emoji: "💼", className: "placement" },
    Result: { emoji: "📋", className: "result" },
    Event: { emoji: "🎉", className: "event" },
};

export default function NotificationCard({ rank, notification }) {
    const { Type, Message, Timestamp, _score } = notification;
    const meta = TYPE_LABELS[Type] ?? { emoji: "🔔", className: "default" };

    useEffect(() => {
        Log("frontend", "debug", "component", `NotificationCard rendered: Rank #${rank} — [${Type}] ${Message}`);
    }, [rank, Type, Message]);

    const formattedTime = new Date(Timestamp).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    return (
        <article className={`${styles.card} ${styles[meta.className]}`}>
            <div className={styles.rankBadge}>#{rank}</div>
            <div className={styles.cardHeader}>
                <span className={styles.emoji}>{meta.emoji}</span>
                <span className={`${styles.typeBadge} ${styles[`type_${meta.className}`]}`}>{Type}</span>
            </div>
            <h2 className={styles.message}>{Message}</h2>
            <div className={styles.meta}>
                <span className={styles.timestamp}>🕐 {formattedTime}</span>
                <span className={styles.score}>Score: {_score.toFixed(1)}</span>
            </div>
        </article>
    );
}
