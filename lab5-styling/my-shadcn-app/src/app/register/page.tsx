"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", password: "" };

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
      valid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Trigger success toast
    toast.success("Registration successful!", {
      description: `Welcome, ${form.name}! 🎉`,
    });

    // Clear form
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <Card className="p-8 w-full max-w-sm space-y-6 shadow-lg">
        <h2 className="text-2xl font-semibold text-center">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
            />
            <p className="text-sm text-muted">
              Enter your full name as it appears on your ID.
            </p>
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
            <p className="text-sm text-muted">
              We’ll send a confirmation email here.
            </p>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
            <p className="text-sm text-muted">
              At least 8 characters required.
            </p>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </Card>
    </main>
  );
}
