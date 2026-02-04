import React from "react";
import { Link } from "react-router-dom";
import { Video, Camera, Waves, Palette, Maximize2, Play } from "lucide-react";
import Footer from "../components/Footer";

const TextToVideoLearnMore = () => {
    const capabilities = [
        {
            icon: Camera,
            title: "Camera Control",
            description: "Dynamic cinematic panning, zooming, and tracking with professional precision.",
        },
        {
            icon: Waves,
            title: "Motion Flow",
            description: "Advanced temporal consistency for hyper-realistic character and object motion.",
        },
        {
            icon: Palette,
            title: "Style Transfer",
            description: "Apply seamless layers from vintage film stock to futuristic synthwave vibes.",
        },
        {
            icon: Maximize2,
            title: "4K Upscaling",
            description: "Crystal clear outputs with AI-driven detail enhancement for production-ready assets.",
        },
    ];

    const steps = [
        {
            number: "1",
            title: "Describe your scene",
            description: "Enter a descriptive prompt including lighting, mood, and specific movements.",
        },
        {
            number: "2",
            title: "Select parameters",
            description: "Choose aspect ratio, frame rate, and motion intensity to fine-tune the output.",
        },
        {
            number: "3",
            title: "Generate & Refine",
            description: "Watch your video render in seconds and use our edit tools to polish the result.",
        },
    ];

    return (
        <>
            <main className="bg-black text-white pt-20">
                {/* HERO SECTION */}
                <section className="py-16 px-6 lg:px-20 text-center">
                    <span className="inline-block px-4 py-1 text-sm rounded-full bg-purple-500/20 text-purple-400 mb-6">
                        VIDEO PREVIEW
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                        Text to Video{" "}
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Generation
                        </span>
                    </h1>
                    <p className="mt-6 text-gray-400 text-lg max-w-2xl mx-auto">
                        Transform your imagination into cinematic 4K masterpieces with our
                        most advanced generative motion model yet.
                    </p>

                    <div className="mt-8 flex justify-center gap-4">
                        <Link to="/generatevideo">
                            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                                Generate Video
                            </button>
                        </Link>
                        <Link to="/gallery">
                            <button className="px-6 py-3 border border-gray-700 rounded-xl font-semibold hover:border-purple-500 transition-colors">
                                View Gallery
                            </button>
                        </Link>
                    </div>

                    {/* Video Preview */}
                    <div className="mt-12 max-w-4xl mx-auto">
                        <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900">
                            <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-sm text-gray-300">
                                "Cinematic drone sweep over Neo-Tokyo 2088, rainy night, neon reflections..."
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&h=600&fit=crop"
                                alt="Video Preview"
                                className="w-full h-auto opacity-80"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                                </div>
                            </div>
                            {/* Video Controls Bar */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                <div className="flex items-center gap-4">
                                    <Play className="w-5 h-5 text-white" />
                                    <div className="flex-1 h-1 bg-gray-600 rounded-full">
                                        <div className="w-1/3 h-full bg-purple-500 rounded-full"></div>
                                    </div>
                                    <span className="text-sm text-gray-300">2:15 / 6:30</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CORE CAPABILITIES */}
                <section className="py-20 px-6 lg:px-20">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
                            Core Capabilities
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {capabilities.map((cap, index) => (
                                <div
                                    key={index}
                                    className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-colors"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                                        <cap.icon className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{cap.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {cap.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FROM THOUGHT TO FRAME */}
                <section className="py-20 px-6 lg:px-20 bg-gradient-to-b from-black to-gray-900">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-16">
                            From Thought to{" "}
                            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                Frame
                            </span>
                        </h2>

                        <div className="grid lg:grid-cols-2 gap-12 items-start">
                            {/* Steps */}
                            <div className="space-y-8">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                            {step.number}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                                            <p className="text-gray-400 text-sm">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Creative Prompt Example */}
                            <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">
                                        Creative Prompt
                                    </span>
                                    <span className="text-gray-500 text-sm">14,000</span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                                    An astronaut walking slowly on the red dusty surface of Mars, dust storms in the background, cinematic low angle, highly detailed spacesuit, 8k resolution, photorealistic, epic sci-fi lighting.
                                </p>
                                <div className="flex gap-3 mb-6">
                                    <span className="px-3 py-1 bg-gray-800 rounded-lg text-xs text-gray-400">8 suff</span>
                                    <span className="px-3 py-1 bg-gray-800 rounded-lg text-xs text-gray-400">480 words</span>
                                    <span className="px-3 py-1 bg-gray-800 rounded-lg text-xs text-gray-400">6:40</span>
                                </div>
                                <Link to="/generatevideo">
                                    <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                        <Video className="w-5 h-5" />
                                        Generate Preview
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA SECTION */}
                <section className="py-24 px-6 lg:px-20">
                    <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-3xl p-12 lg:p-16 text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            Ready to direct your first AI film?
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Join our early preview and get exclusive access to our highest fidelity video models.
                        </p>
                        <Link to="/generatevideo">
                            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                                Try Video Generation
                            </button>
                        </Link>
                        <p className="mt-4 text-gray-500 text-sm">
                            ⭐ Premium Features • Early access pricing available
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
};

export default TextToVideoLearnMore;
