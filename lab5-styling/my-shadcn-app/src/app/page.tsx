"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function Page() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensures this component only renders theme-dependent UI afterhydration
  useEffect(() => {
    setMounted(true);
  }, []);
  // Avoid hydration mismatch by not rendering theme UI until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-border bg-card text-card-foreground">
        <h1 className="text-lg font-semibold">ShadCN Demo</h1>
        <Button
          variant="outline"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "☀️Light" : " Dark"}
        </Button>
      </nav>

      {/* Content */}
      <main
        className="flex flex-1 items-center justify-center bg-background text-foreground transition-colors"
      >
        <Card className="p-8 w-full max-w-sm space-y-4">
          <h2
            className="text-xl font-semibold text center">
            Welcome!
          </h2>
          <Input
            placeholder="Enter your name"
          />
          <Button
            className="w-full"
          >
            Submit
          </Button>
        </Card>
      </main>
    </div>
  );
}
