"use client";

import { useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Divider,
    Alert,
    Chip,
    Stack,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Log } from "@/lib/logger";
import NotificationCard from "@/components/NotificationCard";

export default function NotificationInbox({ top10, all, error }) {
    useEffect(() => {
        Log("frontend", "info", "style", "NotificationInbox layout initialized with MUI Container and Grid");
    }, []);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 50%, #0a0a0f 100%)",
                py: { xs: 3, md: 6 },
            }}
        >
            <Container maxWidth="xl">
                {/* ── Page Header ── */}
                <Box textAlign="center" mb={6}>
                    <Chip
                        label="LIVE FEED"
                        size="small"
                        sx={{
                            background: "linear-gradient(135deg, #6c63ff, #9c8fff)",
                            color: "#fff",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            mb: 2,
                        }}
                    />
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: "2rem", sm: "2.8rem", md: "3.5rem" },
                            fontWeight: 800,
                            background: "linear-gradient(135deg, #ffffff 30%, #6c63ff)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            lineHeight: 1.1,
                            mb: 1.5,
                        }}
                    >
                        Notification Centre
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: "#8888aa", maxWidth: 500, mx: "auto", lineHeight: 1.6 }}
                    >
                        Notifications ranked by type priority (Placement &gt; Result &gt; Event) and recency.
                    </Typography>

                    {/* Legend */}
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        flexWrap="wrap"
                        mt={3}
                    >
                        {[
                            { label: "Placement — Weight 3", color: "#6c63ff" },
                            { label: "Result — Weight 2", color: "#00c9a7" },
                            { label: "Event — Weight 1", color: "#ff6b6b" },
                        ].map((item) => (
                            <Chip
                                key={item.label}
                                label={item.label}
                                size="small"
                                sx={{
                                    background: `${item.color}22`,
                                    color: item.color,
                                    border: `1px solid ${item.color}44`,
                                    fontWeight: 600,
                                    fontSize: "0.72rem",
                                }}
                            />
                        ))}
                    </Stack>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 4, background: "rgba(255,107,107,0.1)", color: "#ff6b6b" }}>
                        Failed to load notifications: {error}
                    </Alert>
                )}

                {/* ══════════════════════════════════════════
                    SECTION 1 — PRIORITY INBOX (Top 10)
                ══════════════════════════════════════════ */}
                <Box mb={2}>
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                        <StarIcon sx={{ color: "#6c63ff", fontSize: 28 }} />
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{ color: "#f0f0ff" }}
                        >
                            Priority Inbox
                        </Typography>
                        <Chip
                            label="Top 10"
                            size="small"
                            sx={{
                                background: "rgba(108,99,255,0.15)",
                                color: "#6c63ff",
                                fontWeight: 700,
                                border: "1px solid rgba(108,99,255,0.3)",
                            }}
                        />
                    </Stack>

                    <Grid container spacing={2.5}>
                        {top10.map((notif, index) => (
                            <Grid
                                item
                                key={notif.ID}
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                            >
                                <NotificationCard
                                    rank={index + 1}
                                    notification={notif}
                                    highlighted
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Divider */}
                <Divider
                    sx={{
                        my: 5,
                        borderColor: "#1e1e2e",
                        "&::before, &::after": { borderColor: "#1e1e2e" },
                    }}
                >
                    <Chip
                        label="ALL NOTIFICATIONS"
                        size="small"
                        sx={{ color: "#8888aa", background: "#13131a", border: "1px solid #1e1e2e" }}
                    />
                </Divider>

                {/* ══════════════════════════════════════════
                    SECTION 2 — ALL NOTIFICATIONS
                ══════════════════════════════════════════ */}
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                        <FormatListBulletedIcon sx={{ color: "#8888aa", fontSize: 26 }} />
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{ color: "#f0f0ff" }}
                        >
                            All Notifications
                        </Typography>
                        <Chip
                            label={`${all.length} total`}
                            size="small"
                            sx={{
                                background: "rgba(136,136,170,0.1)",
                                color: "#8888aa",
                                fontWeight: 600,
                                border: "1px solid rgba(136,136,170,0.2)",
                            }}
                        />
                    </Stack>

                    <Grid container spacing={2}>
                        {all.map((notif, index) => (
                            <Grid
                                item
                                key={notif.ID}
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                            >
                                <NotificationCard
                                    rank={index + 1}
                                    notification={notif}
                                    highlighted={false}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Footer */}
                <Box textAlign="center" mt={6}>
                    <Typography variant="caption" sx={{ color: "#8888aa", opacity: 0.5 }}>
                        Algorithm: Score = TypeWeight × 1000 + NormalizedRecency (0–999)
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
