import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* NAVBAR */}
      <Navbar />

      <main className="bg-black text-white">

        {/* HERO */}
        <section className="text-center py-32 px-6">
          <span className="px-4 py-1 text-sm rounded-full bg-gray-800 text-purple-400">
            NEXT-GEN NEURAL ENGINES
          </span>

          <h1 className="mt-6 text-5xl md:text-6xl font-extrabold leading-tight">
            Create Stunning <span className="text-blue-500">AI</span><br />
            <span className="text-blue-500">Visuals</span> in Seconds
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-gray-400">
            The ultimate creative playground powered by next-gen neural networks.
            Transform simple text descriptions into cinematic masterpieces instantly.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <Link to="/generate">
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500">
                Generate Image
              </button>
            </Link>
            <Link to="/generatevideo">
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500">
                Generate Video
              </button>
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-500 flex justify-center gap-6">
            <span>4K Export</span>
            <span>Real-time Rendering</span>
            <span>No GPU Required</span>
          </div>
        </section>

        {/* TOOLS */}
        <section className="px-10 py-20">
          <h2 className="text-3xl font-bold mb-10">Powerful Creative Tools</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800">
              <h3 className="text-xl font-semibold mb-3">Text-to-Image</h3>
              <p className="text-gray-400 mb-4">
                Turn any thought into a high-resolution masterpiece instantly.
              </p>
              <div className="h-48 rounded-xl bg-gray-800"></div>
              <p className="mt-4 text-purple-400 cursor-pointer">
                Learn More →
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800">
              <h3 className="text-xl font-semibold mb-3">Text-to-Video</h3>
              <p className="text-gray-400 mb-4">
                Generate cinematic video clips with realistic motion.
              </p>
              <div className="h-48 rounded-xl bg-gray-800 flex items-center justify-center">
                ▶
              </div>
              <p className="mt-4 text-blue-400 cursor-pointer">
                Try Preview →
              </p>
            </div>
          </div>
        </section>

        {/* STEPS */}
        <section className="py-20 text-center">
          <h2 className="text-3xl font-bold mb-14">
            Three Steps to Creation
          </h2>

          <div className="grid md:grid-cols-3 gap-10 px-10">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                01 Describe Your Vision
              </h3>
              <p className="text-gray-400">
                Simply type what you want to see.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                02 Refine with Tools
              </h3>
              <p className="text-gray-400">
                Adjust styles, lighting, motion, and realism.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">
                03 Generate & Export
              </h3>
              <p className="text-gray-400">
                Export up to 8K or cinematic 60FPS videos.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-black p-16 rounded-3xl text-center border border-gray-800">
            <h2 className="text-4xl font-bold">
              Ready to redefine your{" "}
              <span className="text-purple-500">workflow?</span>
            </h2>

            <p className="mt-4 text-gray-400">
              Join over 500,000 creators. Free credits on sign up.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Link to="/signup">
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500">
                  Create Free Account
                </button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default Home;
