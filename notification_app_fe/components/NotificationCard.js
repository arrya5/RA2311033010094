"use client";

import { useEffect } from "react";
import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Chip,
    Box,
    Stack,
    Tooltip,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Log } from "@/lib/logger";

/** Type-specific visual configuration */
const TYPE_CONFIG = {
    Placement: {
        icon: <WorkIcon fontSize="small" />,
        color: "#6c63ff",
        bg: "rgba(108,99,255,0.08)",
        border: "rgba(108,99,255,0.25)",
        glow: "rgba(108,99,255,0.18)",
    },
    Result: {
        icon: <AssignmentIcon fontSize="small" />,
        color: "#00c9a7",
        bg: "rgba(0,201,167,0.08)",
        border: "rgba(0,201,167,0.25)",
        glow: "rgba(0,201,167,0.18)",
    },
    Event: {
        icon: <EventIcon fontSize="small" />,
        color: "#ff6b6b",
        bg: "rgba(255,107,107,0.08)",
        border: "rgba(255,107,107,0.25)",
        glow: "rgba(255,107,107,0.18)",
    },
};

const DEFAULT_CONFIG = {
    icon: <NotificationsIcon fontSize="small" />,
    color: "#8888aa",
    bg: "rgba(136,136,170,0.08)",
    border: "rgba(136,136,170,0.25)",
    glow: "rgba(136,136,170,0.1)",
};

/**
 * NotificationCard — displays a single notification with type-colored styling.
 *
 * @param {number} rank - Position in the sorted list
 * @param {Object} notification - Notification data from the API
 * @param {boolean} highlighted - Whether this is a Priority Inbox card
 * @param {boolean} viewed - Whether the user has already viewed this notification
 * @param {Function} onView - Callback to mark notification as viewed
 */
export default function NotificationCard({ rank, notification, highlighted = false, viewed = false, onView }) {
    const { ID, Type, Message, Timestamp, _score } = notification;
    const config = TYPE_CONFIG[Type] ?? DEFAULT_CONFIG;

    useEffect(() => {
        Log(
            "frontend",
            "debug",
            "component",
            `NotificationCard rendered — Rank #${rank} [${Type}]: ${Message}`
        );
    }, [rank, Type, Message]);

    const handleClick = () => {
        if (onView) onView(ID);
    };

    const formattedTime = new Date(Timestamp).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    return (
        <Tooltip
            title={viewed ? "Already viewed" : "Click to mark as viewed"}
            placement="top"
            arrow
        >
            <Card
                elevation={0}
                onClick={handleClick}
                sx={{
                    height: "100%",
                    // Viewed cards are visually dimmed with grey overlay
                    background: viewed
                        ? "rgba(30,30,46,0.5)"
                        : highlighted
                            ? config.bg
                            : "rgba(19,19,26,0.8)",
                    border: `1px solid ${viewed ? "#2a2a3a" : highlighted ? config.border : "#1e1e2e"}`,
                    borderRadius: 3,
                    position: "relative",
                    overflow: "visible",
                    opacity: viewed ? 0.65 : 1,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, opacity 0.3s ease",
                    cursor: "pointer",
                    "&:hover": {
                        transform: viewed ? "none" : "translateY(-4px)",
                        boxShadow: viewed ? "none" : `0 8px 32px ${config.glow}`,
                        borderColor: viewed ? "#2a2a3a" : config.color,
                        opacity: viewed ? 0.75 : 1,
                    },
                }}
            >
                {/* Rank Badge */}
                <Box
                    sx={{
                        position: "absolute",
                        top: -10,
                        right: 12,
                        background: highlighted && !viewed ? config.color : "#1e1e2e",
                        color: highlighted && !viewed ? "#fff" : "#8888aa",
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

                {/* Viewed badge */}
                {viewed && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: -10,
                            left: 12,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.3,
                            background: "#1e1e2e",
                            color: "#555577",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            px: 0.8,
                            py: 0.25,
                            borderRadius: "999px",
                            lineHeight: 1.8,
                        }}
                    >
                        <CheckCircleIcon sx={{ fontSize: 11 }} /> Viewed
                    </Box>
                )}

                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                    {/* Type icon + chip */}
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
                        <Box sx={{ color: viewed ? "#555577" : config.color, display: "flex", alignItems: "center" }}>
                            {config.icon}
                        </Box>
                        <Chip
                            label={Type}
                            size="small"
                            sx={{
                                background: viewed ? "rgba(85,85,119,0.1)" : `${config.color}18`,
                                color: viewed ? "#555577" : config.color,
                                border: `1px solid ${viewed ? "#2a2a3a" : `${config.color}44`}`,
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
                            color: viewed ? "#555577" : "#f0f0ff",
                            mb: 2,
                            lineHeight: 1.4,
                            fontSize: "0.95rem",
                        }}
                    >
                        {Message}
                    </Typography>

                    {/* Meta: timestamp + score */}
                    <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="caption" sx={{ color: "#555577", fontSize: "0.72rem" }}>
                            🕐 {formattedTime}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: viewed ? "#555577" : config.color,
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
        </Tooltip>
    );
}
