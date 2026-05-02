"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Box,
    Container,
    Typography,
    Divider,
    Alert,
    Chip,
    Stack,
    Grid,
    Tabs,
    Tab,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Log } from "@/lib/logger";
import NotificationCard from "@/components/NotificationCard";
import { useViewedNotifications } from "@/hooks/useViewedNotifications";

const FILTERS = ["All", "Placement", "Result", "Event"];
const PAGE_SIZE = 6;

export default function NotificationInbox({ top10, all, error }) {
    const [activeFilter, setActiveFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const { markAsViewed, isViewed } = useViewedNotifications();

    // Log layout initialization
    useEffect(() => {
        Log("frontend", "info", "style", "NotificationInbox layout initialized with MUI Container and Grid");
    }, []);

    // Filter notifications client-side
    const filtered = useMemo(() => {
        if (activeFilter === "All") return all;
        return all.filter((n) => n.Type === activeFilter);
    }, [all, activeFilter]);

    // Paginate
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    // Handle filter change
    const handleFilterChange = (_, newValue) => {
        setActiveFilter(newValue);
        setCurrentPage(1);
        Log("frontend", "info", "api", `Fetched page 1 with filter ${newValue}`);
    };

    // Handle page change
    const handlePageChange = (_, page) => {
        setCurrentPage(page);
        Log("frontend", "info", "api", `Fetched page ${page} with filter ${activeFilter}`);
    };

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
                        sx={{ color: "#8888aa", maxWidth: 520, mx: "auto", lineHeight: 1.6 }}
                    >
                        Notifications ranked by type priority (Placement &gt; Result &gt; Event) and recency.
                    </Typography>

                    {/* Legend chips */}
                    <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" mt={3}>
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
                    <Alert
                        severity="error"
                        sx={{ mb: 4, background: "rgba(255,107,107,0.1)", color: "#ff6b6b" }}
                    >
                        Failed to load notifications: {error}
                    </Alert>
                )}

                {/* ══════════════════════════════
                    SECTION 1 — PRIORITY INBOX
                ══════════════════════════════ */}
                <Box mb={2}>
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                        <StarIcon sx={{ color: "#6c63ff", fontSize: 28 }} />
                        <Typography variant="h5" fontWeight={700} sx={{ color: "#f0f0ff" }}>
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
                            <Grid item key={notif.ID} xs={12} sm={6} md={4} lg={3}>
                                <NotificationCard
                                    rank={index + 1}
                                    notification={notif}
                                    highlighted
                                    viewed={isViewed(notif.ID)}
                                    onView={markAsViewed}
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
                        label="BROWSE ALL"
                        size="small"
                        sx={{ color: "#8888aa", background: "#13131a", border: "1px solid #1e1e2e" }}
                    />
                </Divider>

                {/* ══════════════════════════════
                    SECTION 2 — ALL NOTIFICATIONS
                    with Filter + Pagination
                ══════════════════════════════ */}
                <Box>
                    {/* Section Header + Filter Controls */}
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                        spacing={2}
                        mb={3}
                        flexWrap="wrap"
                    >
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <FormatListBulletedIcon sx={{ color: "#8888aa", fontSize: 26 }} />
                            <Typography variant="h5" fontWeight={700} sx={{ color: "#f0f0ff" }}>
                                All Notifications
                            </Typography>
                            <Chip
                                label={`${filtered.length} results`}
                                size="small"
                                sx={{
                                    background: "rgba(136,136,170,0.1)",
                                    color: "#8888aa",
                                    fontWeight: 600,
                                    border: "1px solid rgba(136,136,170,0.2)",
                                }}
                            />
                        </Stack>

                        {/* Desktop: MUI Tabs filter */}
                        <Box sx={{ display: { xs: "none", sm: "block" } }}>
                            <Tabs
                                value={activeFilter}
                                onChange={handleFilterChange}
                                sx={{
                                    "& .MuiTab-root": {
                                        color: "#8888aa",
                                        fontWeight: 600,
                                        fontSize: "0.8rem",
                                        minWidth: 90,
                                    },
                                    "& .Mui-selected": { color: "#6c63ff !important" },
                                    "& .MuiTabs-indicator": { backgroundColor: "#6c63ff" },
                                    background: "rgba(19,19,26,0.8)",
                                    borderRadius: 2,
                                    border: "1px solid #1e1e2e",
                                    px: 0.5,
                                }}
                            >
                                {FILTERS.map((f) => (
                                    <Tab key={f} label={f} value={f} />
                                ))}
                            </Tabs>
                        </Box>

                        {/* Mobile: MUI Select filter */}
                        <Box sx={{ display: { xs: "block", sm: "none" }, minWidth: 160 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel
                                    sx={{ color: "#8888aa" }}
                                    id="filter-select-label"
                                >
                                    <FilterListIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                    Filter
                                </InputLabel>
                                <Select
                                    labelId="filter-select-label"
                                    value={activeFilter}
                                    label="Filter"
                                    onChange={(e) => handleFilterChange(null, e.target.value)}
                                    sx={{
                                        color: "#f0f0ff",
                                        background: "rgba(19,19,26,0.8)",
                                        border: "1px solid #1e1e2e",
                                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                                        "& .MuiSvgIcon-root": { color: "#8888aa" },
                                    }}
                                >
                                    {FILTERS.map((f) => (
                                        <MenuItem key={f} value={f}>{f}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Stack>

                    {/* Notification Grid */}
                    <Grid container spacing={2}>
                        {paginated.map((notif, index) => (
                            <Grid item key={notif.ID} xs={12} sm={6} md={4} lg={3}>
                                <NotificationCard
                                    rank={(currentPage - 1) * PAGE_SIZE + index + 1}
                                    notification={notif}
                                    highlighted={false}
                                    viewed={isViewed(notif.ID)}
                                    onView={markAsViewed}
                                />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={5}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                variant="outlined"
                                shape="rounded"
                                sx={{
                                    "& .MuiPaginationItem-root": {
                                        color: "#8888aa",
                                        borderColor: "#1e1e2e",
                                        "&:hover": {
                                            background: "rgba(108,99,255,0.1)",
                                            borderColor: "#6c63ff",
                                            color: "#6c63ff",
                                        },
                                    },
                                    "& .Mui-selected": {
                                        background: "rgba(108,99,255,0.2) !important",
                                        borderColor: "#6c63ff !important",
                                        color: "#6c63ff !important",
                                        fontWeight: 700,
                                    },
                                }}
                            />
                        </Box>
                    )}
                </Box>

                {/* Footer */}
                <Box textAlign="center" mt={6}>
                    <Typography variant="caption" sx={{ color: "#8888aa", opacity: 0.5 }}>
                        Score = TypeWeight × 1000 + NormalizedRecency (0–999) &nbsp;|&nbsp; {PAGE_SIZE} per page
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}
