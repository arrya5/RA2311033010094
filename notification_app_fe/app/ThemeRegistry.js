"use client";

import { useState } from "react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

/**
 * ThemeRegistry — fixes MUI emotion SSR hydration mismatch
 * in Next.js App Router by collecting server-rendered styles
 * and injecting them before React hydrates.
 */
function createEmotionCache() {
    let insertedNames = [];
    const cache = createCache({ key: "css" });
    cache.compat = true;
    const prevInsert = cache.insert;
    cache.insert = (...args) => {
        const serialized = args[1];
        if (cache.inserted[serialized.name] === undefined) {
            insertedNames.push(serialized.name);
        }
        return prevInsert(...args);
    };
    function flush() {
        const prev = insertedNames;
        insertedNames = [];
        return prev;
    }
    return { cache, flush };
}

const darkTheme = createTheme({
    palette: { mode: "dark" },
    typography: { fontFamily: "'Inter', sans-serif" },
});

export default function ThemeRegistry({ children }) {
    const [{ cache, flush }] = useState(() => createEmotionCache());

    useServerInsertedHTML(() => {
        const names = flush();
        if (names.length === 0) return null;
        let styles = "";
        for (const name of names) {
            styles += cache.inserted[name];
        }
        return (
            <style
                key={cache.key}
                data-emotion={`${cache.key} ${names.join(" ")}`}
                dangerouslySetInnerHTML={{ __html: styles }}
            />
        );
    });

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}
