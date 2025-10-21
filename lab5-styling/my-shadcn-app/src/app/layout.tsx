"use client";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Toaster } from "sonner";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          {children}
          <Toaster
            richColors
            closeButton
            position="top-right"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
