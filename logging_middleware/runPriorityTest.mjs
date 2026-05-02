// Quick test runner to display top 10 priority notifications
const TOKEN_URL = "http://20.207.122.201/evaluation-service/auth";
const NOTIF_URL = "http://20.207.122.201/evaluation-service/notifications";

const TYPE_WEIGHTS = { Placement: 3, Result: 2, Event: 1 };

async function getToken() {
    const res = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            clientID: "38d9d25b-143f-4e82-b422-7e93282866f7",
            clientSecret: "USPbcyHJKSjDjVfs",
            email: "at4302@srmist.edu.in",
            rollNo: "RA2311033010094",
            name: "Arrya Thakur",
            accessCode: "QkbpxH"
        })
    });
    const data = await res.json();
    return data.access_token;
}

function computeScore(n, minTime, maxTime) {
    const w = TYPE_WEIGHTS[n.Type] ?? 0;
    const t = new Date(n.Timestamp).getTime();
    const recency = ((t - minTime) / (maxTime - minTime || 1)) * 999;
    return w * 1000 + recency;
}

async function main() {
    const token = await getToken();
    const res = await fetch(NOTIF_URL, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const { notifications } = await res.json();

    const times = notifications.map(n => new Date(n.Timestamp).getTime());
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    const top10 = notifications
        .map(n => ({ ...n, _score: computeScore(n, minTime, maxTime) }))
        .sort((a, b) => b._score - a._score)
        .slice(0, 10);

    console.log("\n===== TOP 10 PRIORITY NOTIFICATIONS =====\n");
    top10.forEach((n, i) => {
        console.log(`#${i + 1} [${n.Type}] ${n.Message}`);
        console.log(`    Timestamp : ${n.Timestamp}`);
        console.log(`    Score     : ${n._score.toFixed(2)}`);
        console.log(`    ID        : ${n.ID}\n`);
    });
}

main();
