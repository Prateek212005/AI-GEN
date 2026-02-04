import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Image, Sliders, Zap, Download, Brain, Palette } from "lucide-react";
import Footer from "../components/Footer";

const TextToImageLearnMore = () => {
    const features = [
        {
            icon: Image,
            title: "High-Resolution",
            description: "Generate crystal clear imagery up to 8K resolution with unmatched detail and sharpness for any use case.",
        },
        {
            icon: Palette,
            title: "Custom Styles",
            description: "Choose from over 50+ unique artistic aesthetics including Cyberpunk, Oil Painting, and 3D Render.",
        },
        {
            icon: Sliders,
            title: "Prompt Control",
            description: "Fine-tuned engine for precise results. Use negative prompts and weight modifiers to guide the AI exactly where you want.",
        },
        {
            icon: Download,
            title: "Batch Export",
            description: "Efficiency at scale. Process up to 100 images simultaneously and download them in a single archive.",
        },
        {
            icon: Brain,
            title: "Neural Filters",
            description: "Enhance your generated images with smart AI filters for texture, lighting, and depth-of-field adjustments.",
        },
        {
            icon: Zap,
            title: "Creative Freedom",
            description: "No limits to your imagination. Our engine is trained on diverse datasets to support any concept or world you create.",
        },
    ];

    const steps = [
        {
            number: "1",
            title: "Enter Prompt",
            description: "Describe your image in natural language. Be as specific as you like.",
        },
        {
            number: "2",
            title: "Choose Style",
            description: "Select from our preset styles or customize your own parameters.",
        },
        {
            number: "3",
            title: "Magic Happens",
            description: "Our AI generates your masterpiece in seconds. Download and share.",
        },
    ];

    const examplePrompts = [
        {
            prompt: "A futuristic cyberpunk marketplace with neon signs and flying cars, hyper-realistic, 8k",
            color: "from-purple-500 to-blue-500",
        },
        {
            prompt: "Oil painting of a lone astronaut standing on a purple desert planet with three moons",
            color: "from-blue-500 to-cyan-500",
        },
        {
            prompt: "Minimalist 3D render of a floating organic glass shape, soft pastel lighting, studio background",
            color: "from-purple-500 to-blue-500",
        },
        {
            prompt: "Portrait of a mechanical owl with emerald eyes, intricate clockwork details, renaissance aesthetic",
            color: "from-blue-500 to-cyan-500",
        },
    ];

    return (
        <>
            <main className="bg-black text-white pt-20">
                {/* HERO SECTION */}
                <section className="py-16 px-6 lg:px-20">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        {/* Hero Image */}
                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-purple-500/20">
                                <img
                                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop"
                                    alt="AI Generated Art"
                                    className="w-full h-auto"
                                />
                            </div>
                            {/* Floating badge */}
                            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded-xl text-sm font-semibold">
                                AI Generated
                            </div>
                        </div>

                        {/* Hero Content */}
                        <div>
                            <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">
                                Powerful AI Generation
                            </span>
                            <h1 className="mt-4 text-4xl lg:text-5xl font-bold leading-tight">
                                Text to Image{" "}
                                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                    Generation
                                </span>
                            </h1>
                            <p className="mt-6 text-gray-400 text-lg leading-relaxed">
                                Transform your wildest ideas into stunning visual masterpieces with our state-of-the-art
                                neural engine. From photorealism to abstract surrealism, creativity knows no bounds.
                            </p>
                            <Link to="/generate">
                                <button className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Generate Image Now
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* POWERFUL FEATURES */}
                <section className="py-20 px-6 lg:px-20 bg-gradient-to-b from-black to-gray-900">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
                            Powerful Features
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-colors"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                                        <feature.icon className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section className="py-20 px-6 lg:px-20">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
                            How It Works
                        </h2>

                        <div className="grid md:grid-cols-3 gap-10">
                            {steps.map((step, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-14 h-14 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xl font-bold mb-6">
                                        {step.number}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                    <p className="text-gray-400 text-sm">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* EXAMPLE PROMPTS */}
                <section className="py-20 px-6 lg:px-20 bg-gradient-to-b from-gray-900 to-black">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-12">
                            Example Prompts
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {examplePrompts.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-[#0B0F19] border border-gray-800 rounded-xl p-5 flex items-start gap-4 hover:border-purple-500/50 transition-colors"
                                >
                                    <p className="text-gray-300 text-sm flex-1">"{item.prompt}"</p>
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${item.color} flex-shrink-0`}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA SECTION */}
                <section className="py-24 px-6 lg:px-20">
                    <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-3xl p-12 lg:p-16 text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            Ready to visualize the future?
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Join thousands of artists and creators who are already using AI-GEN to push the
                            boundaries of visual expression.
                        </p>
                        <Link to="/generate">
                            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                                Start Creating Images
                            </button>
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default TextToImageLearnMore;
