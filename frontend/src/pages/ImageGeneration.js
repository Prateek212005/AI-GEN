import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateImage } from '../services/api';
import { Loader2, Sparkles, Download, RefreshCw, Maximize2, X } from 'lucide-react';
import { toast } from 'sonner';

const ImageGeneration = () => {
  const { user, updateCredits } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const styles = [
    { value: 'realistic', label: 'Realistic', description: 'Photorealistic images' },
    { value: 'anime', label: 'Anime', description: 'Anime style artwork' },
    { value: 'cyberpunk', label: 'Cyberpunk', description: 'Futuristic sci-fi' }
  ];

  const aspectRatios = [
    { value: '1:1', label: 'Square (1:1)', icon: '□' },
    { value: '16:9', label: 'Landscape (16:9)', icon: '▭' },
    { value: '9:16', label: 'Portrait (9:16)', icon: '▯' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (user.credits < 5) {
      toast.error('Insufficient credits. Please upgrade your plan.');
      return;
    }

    setGenerating(true);
    try {
      const response = await generateImage(prompt, style, aspectRatio);
      // Backend now returns full URL, use it directly
      const imageData = {
        id: response.generation?.id,
        prompt: response.generation?.prompt || prompt,
        result_url: response.generation?.fileUrl,
        remainingCredits: response.remainingCredits
      };
      setGeneratedImage(imageData);
      if (response.remainingCredits !== undefined) {
        updateCredits(response.remainingCredits);
      } else {
        updateCredits(user.credits - 10);
      }
      toast.success('Image generated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate image');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;

    try {
      // Fetch the image as a blob to trigger actual download
      const response = await fetch(generatedImage.result_url);
      const blob = await response.blob();

      // Create a blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `ai-gen-image-${generatedImage.id || Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleRefresh = () => {
    handleGenerate();
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2" data-testid="image-gen-title">
            AI Image Generation
          </h1>
          <p className="text-[#9CA3AF]">Create stunning images from text prompts</p>
          <div className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-[#111827] rounded-lg border border-[#1F2937]">
            <Sparkles className="w-4 h-4 text-[#22D3EE]" />
            <span className="text-[#9CA3AF] text-sm">Cost: 5 credits per image</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="bg-[#0B0F19] rounded-xl border border-[#1F2937] p-6">
              <label className="block text-white text-sm font-medium mb-3">
                Describe your image
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 px-4 py-3 bg-[#111827] border border-[#1F2937] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#A855F7] transition-colors resize-none"
                placeholder="A majestic lion standing on a cliff at sunset, photorealistic..."
                data-testid="image-prompt-input"
              />
              <p className="text-[#6B7280] text-sm mt-2">
                Be specific and descriptive for best results
              </p>
            </div>

            {/* Style Selector */}
            <div className="bg-[#0B0F19] rounded-xl border border-[#1F2937] p-6">
              <label className="block text-white text-sm font-medium mb-3">
                Select Style
              </label>
              <div className="grid grid-cols-3 gap-3">
                {styles.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${style === s.value
                      ? 'border-[#A855F7] bg-[#A855F7]/10'
                      : 'border-[#1F2937] hover:border-[#A855F7]/50'
                      }`}
                    data-testid={`style-${s.value}`}
                  >
                    <p className="text-white font-semibold text-sm">{s.label}</p>
                    <p className="text-[#9CA3AF] text-xs mt-1">{s.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="bg-[#0B0F19] rounded-xl border border-[#1F2937] p-6">
              <label className="block text-white text-sm font-medium mb-3">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-3">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.value}
                    onClick={() => setAspectRatio(ar.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${aspectRatio === ar.value
                      ? 'border-[#A855F7] bg-[#A855F7]/10'
                      : 'border-[#1F2937] hover:border-[#A855F7]/50'
                      }`}
                    data-testid={`aspect-${ar.value}`}
                  >
                    <div className="text-2xl mb-1">{ar.icon}</div>
                    <p className="text-white text-sm">{ar.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="w-full py-4 bg-gradient-to-r from-[#A855F7] to-[#3B82F6] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              data-testid="generate-image-button"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Image</span>
                </>
              )}
            </button>
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-[#0B0F19] rounded-xl border border-[#1F2937] p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Preview</h3>

            {!generatedImage && !generating && (
              <div className="aspect-square bg-[#111827] rounded-lg flex items-center justify-center border-2 border-dashed border-[#1F2937]" data-testid="image-preview-empty">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
                  <p className="text-[#9CA3AF]">Your generated image will appear here</p>
                </div>
              </div>
            )}

            {generating && (
              <div className="aspect-square bg-[#111827] rounded-lg flex items-center justify-center" data-testid="image-generating">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-[#A855F7] animate-spin mx-auto mb-4" />
                  <p className="text-white font-semibold mb-2">Creating your image...</p>
                  <p className="text-[#9CA3AF] text-sm">This may take 10-30 seconds</p>
                </div>
              </div>
            )}

            {generatedImage && !generating && (
              <div className="space-y-4" data-testid="image-result">
                <div className="relative group">
                  <img
                    src={generatedImage.result_url}
                    alt="Generated"
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={() => setShowFullscreen(true)}
                    className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    data-testid="fullscreen-button"
                  >
                    <Maximize2 className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-3 bg-[#111827] border border-[#1F2937] text-white rounded-lg hover:border-[#A855F7] transition-colors flex items-center justify-center space-x-2"
                    data-testid="download-button"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="flex-1 py-3 bg-gradient-to-r from-[#A855F7] to-[#3B82F6] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                    data-testid="regenerate-button"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Regenerate</span>
                  </button>
                </div>

                <div className="bg-[#111827] rounded-lg p-4">
                  <p className="text-[#9CA3AF] text-sm mb-1">Prompt:</p>
                  <p className="text-white text-sm">{generatedImage.prompt}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && generatedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" data-testid="fullscreen-modal">
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 p-2 bg-[#111827] rounded-lg hover:bg-[#1F2937] transition-colors"
            data-testid="close-fullscreen-button"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={generatedImage.result_url}
            alt="Generated"
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ImageGeneration;