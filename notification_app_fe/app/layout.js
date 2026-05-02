import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";

export const metadata = {
    title: "Notification Centre",
    description: "Priority notification inbox with filtering and pagination.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <ThemeRegistry>
                    {children}
                </ThemeRegistry>
            </body>
        </html>
    );
}
