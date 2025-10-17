"use client";

export default function About() {
  return (
    <section id="about" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            About Me
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            I’m a developer with a passion for creating digital experiences that
            blend design and functionality. I specialize in building responsive,
            user-centered web applications using modern technologies like
            <span className="font-medium text-blue-600">
              {" "}
              React, Next.js, and Tailwind CSS.
            </span>{" "}
            I enjoy collaborating with teams to bring ideas to life and
            constantly explore new tools to improve my workflow.
          </p>
        </div>
      </section>
    
  );
}