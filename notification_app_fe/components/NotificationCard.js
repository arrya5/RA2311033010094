"use client";

import { useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
    Stack,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Log } from "@/lib/logger";

const TYPE_CONFIG = {
    Placement: {
        icon: <WorkIcon fontSize="small" />,
        color: "#6c63ff",
        bg: "rgba(108,99,255,0.08)",
        border: "rgba(108,99,255,0.25)",
        glow: "rgba(108,99,255,0.15)",
    },
    Result: {
        icon: <AssignmentIcon fontSize="small" />,
        color: "#00c9a7",
        bg: "rgba(0,201,167,0.08)",
        border: "rgba(0,201,167,0.25)",
        glow: "rgba(0,201,167,0.15)",
    },
    Event: {
        icon: <EventIcon fontSize="small" />,
        color: "#ff6b6b",
        bg: "rgba(255,107,107,0.08)",
        border: "rgba(255,107,107,0.25)",
        glow: "rgba(255,107,107,0.15)",
    },
};

const DEFAULT_CONFIG = {
    icon: <NotificationsIcon fontSize="small" />,
    color: "#8888aa",
    bg: "rgba(136,136,170,0.08)",
    border: "rgba(136,136,170,0.25)",
    glow: "rgba(136,136,170,0.1)",
};

export default function NotificationCard({ rank, notification, highlighted = false }) {
    const { Type, Message, Timestamp, _score } = notification;
    const config = TYPE_CONFIG[Type] ?? DEFAULT_CONFIG;

    useEffect(() => {
        Log(
            "frontend",
            "debug",
            "component",
            `NotificationCard rendered — Rank #${rank} [${Type}]: ${Message}`
        );
    }, [rank, Type, Message]);

    const formattedTime = new Date(Timestamp).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                background: highlighted ? config.bg : "rgba(19,19,26,0.8)",
                border: `1px solid ${highlighted ? config.border : "#1e1e2e"}`,
                borderRadius: 3,
                position: "relative",
                overflow: "visible",
                transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                cursor: "default",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 32px ${config.glow}`,
                    borderColor: config.color,
                },
            }}
        >
            {/* Rank Badge */}
            <Box
                sx={{
                    position: "absolute",
                    top: -10,
                    right: 12,
                    background: highlighted ? config.color : "#1e1e2e",
                    color: highlighted ? "#fff" : "#8888aa",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    px: 1,
                    py: 0.25,
                    borderRadius: "999px",
                    lineHeight: 1.8,
                    minWidth: 32,
                    textAlign: "center",
                }}
            >
                #{rank}
            </Box>

            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                {/* Type chip + icon */}
                <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                    <Box sx={{ color: config.color, display: "flex", alignItems: "center" }}>
                        {config.icon}
                    </Box>
                    <Chip
                        label={Type}
                        size="small"
                        sx={{
                            background: `${config.color}18`,
                            color: config.color,
                            border: `1px solid ${config.color}44`,
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            height: 22,
                        }}
                    />
                </Stack>

                {/* Message */}
                <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{
                        color: "#f0f0ff",
                        mb: 2,
                        lineHeight: 1.4,
                        fontSize: "0.95rem",
                    }}
                >
                    {Message}
                </Typography>

                {/* Meta: timestamp + score */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" sx={{ color: "#8888aa", fontSize: "0.72rem" }}>
                        🕐 {formattedTime}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: config.color,
                            fontFamily: "monospace",
                            fontWeight: 600,
                            fontSize: "0.72rem",
                            opacity: 0.8,
                        }}
                    >
                        {_score.toFixed(1)}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}
