import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateVideo } from '../services/api';
import { Loader2, Sparkles, Download, VideoIcon } from 'lucide-react';
import { toast } from 'sonner';

const VideoGeneration = () => {
  const { user, updateCredits } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(3);
  const [generating, setGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(null);



  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (user.credits < 10) {
      toast.error('Insufficient credits. You need 10 credits for video generation.');
      return;
    }

    setGenerating(true);
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('duration', duration);

      const result = await generateVideo(formData);
      setGeneratedVideo(result);
      updateCredits(user.credits - 10);
      toast.success('Video generated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to generate video');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedVideo) return;

    const link = document.createElement('a');
    link.href = generatedVideo.result_url;
    link.download = `ai-gen-video-${generatedVideo.id}.mp4`;
    link.click();
    toast.success('Video downloaded!');
  };

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2" data-testid="video-gen-title">
            AI Video Generation
          </h1>
          <p className="text-[#9CA3AF]">Create cinematic videos from text and images</p>
          <div className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-[#111827] rounded-lg border border-[#1F2937]">
            <Sparkles className="w-4 h-4 text-[#22D3EE]" />
            <span className="text-[#9CA3AF] text-sm">Cost: 10 credits per video</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="bg-[#0B0F19] rounded-xl border border-[#1F2937] p-6">
              <label className="block text-white text-sm font-medium mb-3">
                Video Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-32 px-4 py-3 bg-[#111827] border border-[#1F2937] rounded-lg text-white placeholder-[#6B7280] focus:outline-none focus:border-[#A855F7] transition-colors resize-none"
                placeholder="A serene ocean sunset with waves gently rolling onto the beach..."
                data-testid="video-prompt-input"
              />
            </div>



            {/* Duration */}
            <div className="bg-[#0B0F19] rounded-xl border border-[#1F2937] p-6">
              <label className="block text-white text-sm font-medium mb-3">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-3 bg-[#111827] border border-[#1F2937] rounded-lg text-white focus:outline-none focus:border-[#A855F7] transition-colors"
                data-testid="duration-select"
              >
                <option value={3}>3 seconds</option>
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="w-full py-4 bg-gradient-to-r from-[#A855F7] to-[#3B82F6] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              data-testid="generate-video-button"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <VideoIcon className="w-5 h-5" />
                  <span>Generate Video</span>
                </>
              )}
            </button>
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-[#0B0F19] rounded-xl border border-[#1F2937] p-6">
            <h3 className="text-white text-lg font-semibold mb-4">Preview</h3>

            {!generatedVideo && !generating && (
              <div className="aspect-video bg-[#111827] rounded-lg flex items-center justify-center border-2 border-dashed border-[#1F2937]" data-testid="video-preview-empty">
                <div className="text-center">
                  <VideoIcon className="w-16 h-16 text-[#9CA3AF] mx-auto mb-4" />
                  <p className="text-[#9CA3AF]">Your generated video will appear here</p>
                </div>
              </div>
            )}

            {generating && (
              <div className="aspect-video bg-[#111827] rounded-lg flex items-center justify-center" data-testid="video-generating">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-[#A855F7] animate-spin mx-auto mb-4" />
                  <p className="text-white font-semibold mb-2">Creating your video...</p>
                  <p className="text-[#9CA3AF] text-sm">This may take 30-60 seconds</p>
                  <div className="mt-6 w-64 mx-auto">
                    <div className="h-2 bg-[#1F2937] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#A855F7] to-[#3B82F6] animate-pulse" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {generatedVideo && !generating && (
              <div className="space-y-4" data-testid="video-result">
                <video
                  src={generatedVideo.result_url}
                  controls
                  className="w-full rounded-lg"
                  style={{ maxHeight: '280px', objectFit: 'contain' }}
                  data-testid="generated-video"
                >
                  Your browser does not support the video tag.
                </video>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 py-3 bg-gradient-to-r from-[#A855F7] to-[#3B82F6] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                    data-testid="download-video-button"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                </div>

                <div className="bg-[#111827] rounded-lg p-4">
                  <p className="text-[#9CA3AF] text-sm mb-1">Prompt:</p>
                  <p className="text-white text-sm">{generatedVideo.prompt}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGeneration;
