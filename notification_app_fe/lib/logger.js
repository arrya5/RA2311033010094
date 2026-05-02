/**
 * Logging Middleware — re-exported for use inside the Next.js app.
 * Wraps the shared logging_middleware from the repo root.
 *
 * Stack is always "frontend" for this app.
 * Levels  : debug | info | warn | error | fatal
 * Packages: api | component | hook | page | state | style
 */

const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";
const ACCESS_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhdDQzMDJAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzY5ODc4NiwiaWF0IjoxNzc3Njk3ODg2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZDkzYTViOGUtMDIxMi00OTYyLTljMzUtZjc4OTU4YjNjYTk5IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYXJyeWEgdGhha3VyIiwic3ViIjoiMzhkOWQyNWItMTQzZi00ZTgyLWI0MjItN2U5MzI4Mjg2NmY3In0sImVtYWlsIjoiYXQ0MzAyQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoiYXJyeWEgdGhha3VyIiwicm9sbE5vIjoicmEyMzExMDMzMDEwMDk0IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMzhkOWQyNWItMTQzZi00ZTgyLWI0MjItN2U5MzI4Mjg2NmY3IiwiY2xpZW50U2VjcmV0IjoiVVNQYmN5SEpLU2pEalZmcyJ9.L4uanxHQiYXzOPabLgDGUQgXlUWK5tPdSJtPcRrGd6Q";

const VALID_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const VALID_PACKAGES = ["api", "component", "hook", "page", "state", "style"];

/**
 * Log a message to the evaluation logging API.
 *
 * @param {"frontend"} stack
 * @param {"debug"|"info"|"warn"|"error"|"fatal"} level
 * @param {"api"|"component"|"hook"|"page"|"state"|"style"} pkg
 * @param {string} message
 */
export async function Log(stack, level, pkg, message) {
    if (stack !== "frontend") {
        throw new Error(`[Log] Invalid stack: '${stack}'. Must be 'frontend'.`);
    }
    if (!VALID_LEVELS.includes(level)) {
        throw new Error(`[Log] Invalid level: '${level}'. Must be one of: ${VALID_LEVELS.join(", ")}`);
    }
    if (!VALID_PACKAGES.includes(pkg)) {
        throw new Error(`[Log] Invalid package: '${pkg}'. Must be one of: ${VALID_PACKAGES.join(", ")}`);
    }

    try {
        await fetch(LOG_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
            body: JSON.stringify({ stack, level, package: pkg, message }),
        });
    } catch (_) {
        // Silently fail — console logging is strictly forbidden
    }
}
