"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import Contact from "@/component/Contact";
import Section from "@/component/Section";
import About from "@/component/About";
import Hero from "@/component/Hero";


export default function HomePage() {
  return (
    <div className="bg-gray-50 text-gray-900 flex flex-col min-h-screen">
      <Header />
      {/* ===== Hero Section ===== */}
      <Hero />
      {/* ===== About Section ===== */}
      <About />
      {/* ===== Projects Section ===== */}
      <Section />
      {/* ===== Contact Section ===== */}
      <Contact />
      {/* ===== Footer ===== */}
      <Footer />
    </div>
  );
}
