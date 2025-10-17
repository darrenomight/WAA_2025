"use client";
import Image from "next/image";
export default function Hero() {
  return (
    <section
      id="home"
      className="flex flex-col items-center justify-center text-center py-28 px-6 bg-gradient-to-b from-blue-50 to-white"
    >
      <Image
        src="/Sarah_Connor_(Linda_Hamilton).jpg"
        alt="Profile"
        width={128}
        height={128}
        className="rounded-full shadow-lg mb-6 border-4 border-white"
      />
      <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
        Hi, I’m <span className="text-blue-600">Sarah Connor</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
        A Frontend Developer passionate about building elegant and performant
        web experiences with Next.js, Tailwind CSS, and TypeScript.
      </p>
      <div className="flex gap-4">
        <a
          href="#projects"
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          View My Work
        </a>
        <a
          href="#contact"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition"
        >
          Contact Me
        </a>
      </div>
    </section>
  );
}
