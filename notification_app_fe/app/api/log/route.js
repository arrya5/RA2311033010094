/**
 * Next.js API Route — Proxy for the logging middleware.
 * Avoids browser CORS issues by making the log call server-side.
 */
export async function POST(request) {
    const ACCESS_TOKEN =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhdDQzMDJAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMjk3NywiaWF0IjoxNzc3NzAyMDc3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOGMzOTEzN2YtYzdkOC00ODc2LTg3YjctMmZiNzBiMTFlNDYxIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYXJyeWEgdGhha3VyIiwic3ViIjoiMzhkOWQyNWItMTQzZi00ZTgyLWI0MjItN2U5MzI4Mjg2NmY3In0sImVtYWlsIjoiYXQ0MzAyQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoiYXJyeWEgdGhha3VyIiwicm9sbE5vIjoicmEyMzExMDMzMDEwMDk0IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMzhkOWQyNWItMTQzZi00ZTgyLWI0MjItN2U5MzI4Mjg2NmY3IiwiY2xpZW50U2VjcmV0IjoiVVNQYmN5SEpLU2pEalZmcyJ9.oo-PeoZTmhK7SFxuk5OU1W9kPzUQWlnuB1LGvWD_3SU";

    try {
        const body = await request.json();
        await fetch("http://20.207.122.201/evaluation-service/logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
            body: JSON.stringify(body),
        });
        return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (_) {
        return new Response(JSON.stringify({ ok: false }), { status: 200 });
    }
}
