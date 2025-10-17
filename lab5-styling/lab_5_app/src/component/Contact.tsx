"use client";

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
          Get In Touch
        </h2>
        <p className="text-gray-600 mb-8">
          Whether you want to collaborate or just say hello, feel free to drop
          me a message.
        </p>
        <a
          href="#"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Say Hello
        </a>
      </div>
    </section>
  );
}
