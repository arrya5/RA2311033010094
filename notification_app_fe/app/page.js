import { fetchPriorityNotifications } from "@/lib/priorityInbox";
import { Log } from "@/lib/logger";
import NotificationInbox from "@/components/NotificationInbox";

export const metadata = {
    title: "Priority Inbox | Notification System",
    description: "Top 10 most important notifications ranked by type weight and recency.",
};

const ACCESS_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhdDQzMDJAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzY5ODc4NiwiaWF0IjoxNzc3Njk3ODg2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZDkzYTViOGUtMDIxMi00OTYyLTljMzUtZjc4OTU4YjNjYTk5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYXJyeWEgdGhha3VyIiwic3ViIjoiMzhkOWQyNWItMTQzZi00ZTgyLWI0MjItN2U5MzI4Mjg2NmY3In0sImVtYWlsIjoiYXQ0MzAyQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoiYXJyeWEgdGhha3VyIiwicm9sbE5vIjoicmEyMzExMDMzMDEwMDk0IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMzhkOWQyNWItMTQzZi00ZTgyLWI0MjItN2U5MzI4Mjg2NmY3IiwiY2xpZW50U2VjcmV0IjoiVVNQYmN5SEpLU2pEalZmcyJ9.L4uanxHQiYXzOPabLgDGUQgXlUWK5tPdSJtPcRrGd6Q";

export default async function HomePage() {
    let top10 = [];
    let all = [];
    let error = null;

    try {
        await Log("frontend", "info", "page", "HomePage rendered — fetching priority notifications");
        const result = await fetchPriorityNotifications(ACCESS_TOKEN);
        top10 = result.top10;
        all = result.all;
        await Log("frontend", "info", "page", "Priority notifications loaded successfully");
    } catch (err) {
        await Log("frontend", "error", "page", `Failed to load notifications: ${err.message}`);
        error = err.message;
    }

    return <NotificationInbox top10={top10} all={all} error={error} />;
}
