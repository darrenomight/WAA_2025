import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js JWT Demo",
  description: "Consuming data from an API",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Next.js JWT Demo</h1>
        {children}
      </body>
    </html>
  );
}
