import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata
  = {
  title: "Lab 5 App",
  description: "Layout and Styling",
};

export default function
  RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}