import { fetchPriorityNotifications } from "@/lib/priorityInbox";
import { Log } from "@/lib/logger";
import NotificationCard from "@/components/NotificationCard";
import styles from "./page.module.css";

const ACCESS_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhdDQzMDJAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzY5ODc4NiwiaWF0IjoxNzc3Njk3ODg2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZDkzYTViOGUtMDIxMi00OTYyLTljMzUtZjc4OTU4YjNjYTk5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYXJyeWEgdGhha3VyIiwic3ViIjoiMzhkOWQyNWItMTQzZi00ZTgyLWI0MjItN2U5MzI4Mjg2NmY3In0sImVtYWlsIjoiYXQ0MzAyQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoiYXJyeWEgdGhha3VyIiwicm9sbE5vIjoicmEyMzExMDMzMDEwMDk0IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMzhkOWQyNWItMTQzZi00ZTgyLWI0MjItN2U5MzI4Mjg2NmY3IiwiY2xpZW50U2VjcmV0IjoiVVNQYmN5SEpLU2pEalZmcyJ9.L4uanxHQiYXzOPabLgDGUQgXlUWK5tPdSJtPcRrGd6Q";

export const metadata = {
    title: "Priority Inbox | Notification System",
    description: "Top 10 most important notifications ranked by type weight and recency.",
};

export default async function HomePage() {
    let notifications = [];
    let error = null;

    try {
        await Log("frontend", "info", "page", "HomePage rendered — loading priority notifications");
        notifications = await fetchPriorityNotifications(ACCESS_TOKEN);
        await Log("frontend", "info", "page", "Priority notifications loaded successfully on HomePage");
    } catch (err) {
        await Log("frontend", "error", "page", `Failed to load priority notifications: ${err.message}`);
        error = err.message;
    }

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.badge}>Priority Inbox</div>
                    <h1 className={styles.title}>Notification Centre</h1>
                    <p className={styles.subtitle}>
                        Showing the top 10 most important notifications, ranked by type priority and recency.
                    </p>
                </div>
            </header>

            <section className={styles.legend}>
                <div className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.placement}`}></span> Placement (Weight: 3)
                </div>
                <div className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.result}`}></span> Result (Weight: 2)
                </div>
                <div className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.event}`}></span> Event (Weight: 1)
                </div>
            </section>

            {error ? (
                <div className={styles.error}>
                    <p>⚠️ Failed to load notifications: {error}</p>
                </div>
            ) : (
                <section className={styles.grid}>
                    {notifications.map((notif, index) => (
                        <NotificationCard
                            key={notif.ID}
                            rank={index + 1}
                            notification={notif}
                        />
                    ))}
                </section>
            )}

            <footer className={styles.footer}>
                <p>Algorithm: Type Weight × 1000 + Normalized Recency Score (0–999)</p>
            </footer>
        </main>
    );
}
