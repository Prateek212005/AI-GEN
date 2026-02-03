import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const [billing, setBilling] = useState("monthly");
  const [openFAQ, setOpenFAQ] = useState(null);
  const navigate = useNavigate();

  // 🔥 PRICING CONFIG (ChatGPT-like)
  const pricing = {
    free: {
      monthly: 0,
      annual: 0,
    },
    pro: {
      monthly: 29,
      annual: 290, // 2 months free
    },
    proMax: {
      monthly: 199,
      annual: 1999,
    },
  };

  const faqs = [
    {
      q: "How do credits work?",
      a: "Credits are consumed when generating images or videos. Higher quality and longer outputs consume more credits.",
    },
    {
      q: "Do credits roll over to the next month?",
      a: "No. Credits reset at the beginning of each billing cycle.",
    },
    {
      q: "Can I upgrade or downgrade anytime?",
      a: "Yes, you can change plans anytime from your dashboard.",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white">
        {/* TITLE */}
        <section className="text-center py-20 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Unlock Your Creative Potential
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-gray-400">
            Choose the perfect credit-based plan for your image and video
            generation needs. Scale without limits.
          </p>

          {/* BILLING TOGGLE */}
          <div className="mt-8 flex justify-center">
            <div className="bg-gray-900 p-1 rounded-xl flex">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-5 py-2 rounded-lg text-sm transition ${
                  billing === "monthly"
                    ? "bg-purple-600"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("annual")}
                className={`px-5 py-2 rounded-lg text-sm transition ${
                  billing === "annual"
                    ? "bg-purple-600"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Annual (2 months free)
              </button>
            </div>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section className="px-10 grid md:grid-cols-3 gap-8">
          {/* FREE */}
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 hover:scale-[1.03] hover:border-purple-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] transition-all duration-300">
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <p className="text-3xl font-bold">
              $0
              <span className="text-sm text-gray-400">
                /{billing === "monthly" ? "month" : "year"}
              </span>
            </p>

            <ul className="mt-6 space-y-3 text-gray-300">
              <li>✔ 10 Credits / month</li>
              <li>✔ Standard Speed</li>
              <li>✔ Basic Models</li>
              <li>✔ Community Support</li>
            </ul>

            <button
              onClick={() => navigate("/signup")}
              className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition"
            >
              Get Started
            </button>
          </div>

          {/* PRO */}
          <div className="relative bg-gradient-to-br from-purple-900/40 to-black p-8 rounded-2xl border-2 border-purple-600 scale-105 hover:scale-[1.08] hover:shadow-[0_0_60px_rgba(168,85,247,0.45)] transition-all duration-300">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 px-4 py-1 rounded-full text-sm">
              MOST POPULAR
            </span>

            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-4xl font-bold">
              ${pricing.pro[billing]}
              <span className="text-sm text-gray-400">
                /{billing === "monthly" ? "month" : "year"}
              </span>
            </p>

            {billing === "annual" && (
              <p className="text-green-400 text-sm mt-1">
                Save $58 yearly 🎉
              </p>
            )}

            <ul className="mt-6 space-y-3 text-gray-300">
              <li>✔ 1,000 Credits / month</li>
              <li>✔ Turbo Speed</li>
              <li>✔ Commercial License</li>
              <li>✔ Private Generations</li>
            </ul>

            <button
              onClick={() =>
                navigate("/payment", {
                  state: {
                    plan: "pro",
                    price: pricing.pro[billing],
                    billingCycle: billing,
                  },
                })
              }
              className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition"
            >
              Buy Now
            </button>
          </div>

          {/* PRO MAX */}
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 hover:scale-[1.03] hover:border-purple-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] transition-all duration-300">
            <h3 className="text-xl font-semibold mb-2">Pro Max</h3>
            <p className="text-4xl font-bold">
              ${pricing.proMax[billing]}
              <span className="text-sm text-gray-400">
                /{billing === "monthly" ? "month" : "year"}
              </span>
            </p>

            {billing === "annual" && (
              <p className="text-green-400 text-sm mt-1">
                Best value for power users 💎
              </p>
            )}

            <ul className="mt-6 space-y-3 text-gray-300">
              <li>✔ Unlimited Credits</li>
              <li>✔ Ultra-fast Generation</li>
              <li>✔ All Premium Models</li>
              <li>✔ API + Priority Access</li>
              <li>✔ Dedicated Support</li>
            </ul>

            <button
              onClick={() =>
                navigate("/payment", {
                  state: {
                    plan: "pro_max",
                    price: pricing.proMax[billing],
                    billingCycle: billing,
                  },
                })
              }
              className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 transition"
            >
              Buy Now
            </button>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-10 py-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>

          {faqs.map((item, i) => (
            <div
              key={i}
              onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
              className="mb-4 cursor-pointer rounded-xl border border-gray-800 bg-gray-900/70 hover:bg-gray-800 hover:border-purple-500 transition-all duration-300"
            >
              <div className="p-5 flex justify-between items-center">
                <span className="font-medium">{item.q}</span>
                <span
                  className={`transform transition-transform duration-300 ${
                    openFAQ === i ? "rotate-180 text-purple-400" : ""
                  }`}
                >
                  ⌄
                </span>
              </div>

              {openFAQ === i && (
                <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Pricing;
