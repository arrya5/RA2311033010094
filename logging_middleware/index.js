/**
 * Reusable Logging Utility
 * 
 * @param {string} stack - The technology stack (e.g., 'frontend', 'backend', 'React')
 * @param {string} level - The log level (e.g., 'info', 'warn', 'error')
 * @param {string} pkg - The package or module name (e.g., 'auth', 'notification')
 * @param {string} message - The actual log message
 */
export async function Log(stack, level, pkg, message) {
    // Validation Logic
    if (stack !== "frontend") {
        throw new Error(`[Logging Middleware] Invalid stack: '${stack}'. Must be 'frontend'.`);
    }
    
    const validLevels = ["debug", "info", "warn", "error", "fatal"];
    if (!validLevels.includes(level)) {
        throw new Error(`[Logging Middleware] Invalid level: '${level}'. Must be one of: ${validLevels.join(", ")}`);
    }
    
    const validPackages = ["api", "component", "hook", "page", "state", "style"];
    if (!validPackages.includes(pkg)) {
        throw new Error(`[Logging Middleware] Invalid package: '${pkg}'. Must be one of: ${validPackages.join(", ")}`);
    }

    // Access token from authentication step
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhdDQzMDJAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMjk3NywiaWF0IjoxNzc3NzAyMDc3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOGMzOTEzN2YtYzdkOC00ODc2LTg3YjctMmZiNzBiMTFlNDYxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYXJyeWEgdGhha3VyIiwic3ViIjoiMzhkOWQyNWItMTQzZi00ZTgyLWI0MjItN2U5MzI4Mjg2NmY3In0sImVtYWlsIjoiYXQ0MzAyQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoiYXJyeWEgdGhha3VyIiwicm9sbE5vIjoicmEyMzExMDMzMDEwMDk0IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMzhkOWQyNWItMTQzZi00ZTgyLWI0MjItN2U5MzI4Mjg2NmY3IiwiY2xpZW50U2VjcmV0IjoiVVNQYmN5SEpLU2pEalZmcyJ9.oo-PeoZTmhK7SFxuk5OU1W9kPzUQWlnuB1LGvWD_3SU";
    
    const logData = {
        stack,
        level,
        package: pkg,
        message,
    };

    try {
        await fetch("http://20.207.122.201/evaluation-service/logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(logData)
        });
    } catch (_) {
        // Silently fail — console logging is strictly forbidden per constraints
    }
}
