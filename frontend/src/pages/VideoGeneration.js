import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateVideo } from '../services/api';
import { Loader2, Sparkles, Download, Upload, X, VideoIcon } from 'lucide-react';
import { toast } from 'sonner';

const VideoGeneration = () => {
  const { user, updateCredits } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [motionIntensity, setMotionIntensity] = useState('medium');
  const [duration, setDuration] = useState(3);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [referenceImage, setReferenceImage] = useState(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const fileInputRef = useRef(null);

  const motionLevels = [
    { value: 'low', label: 'Low', description: 'Subtle movement' },
    { value: 'medium', label: 'Medium', description: 'Moderate motion' },
    { value: 'high', label: 'High', description: 'Dynamic action' }
  ];

  const aspectRatios = [
    { value: '16:9', label: 'Landscape (16:9)' },
    { value: '9:16', label: 'Portrait (9:16)' },
    { value: '1:1', label: 'Square (1:1)' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReferenceImage = () => {
    setReferenceImage(null);
    setReferenceImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      formData.append('motion_intensity', motionIntensity);
      formData.append('duration', duration);
      formData.append('aspect_ratio', aspectRatio);
      if (referenceImage) {
        formData.append('reference_image', referenceImage);
      }

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

        <div className="grid lg:grid-cols-2 gap-8">
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

            {/* Reference Image Upload */}
            <div className="bg-[#0B0F19] rounded-xl border border-[#1F2937] p-6">
              <label className="block text-white text-sm font-medium mb-3">
                Reference Image (Optional)
              </label>

              {!referenceImagePreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#1F2937] rounded-lg p-8 text-center cursor-pointer hover:border-[#A855F7] transition-colors"
                  data-testid="image-upload-area"
                >
                  <Upload className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
                  <p className="text-white font-medium mb-1">Upload Reference Image</p>
                  <p className="text-[#9CA3AF] text-sm">Generate video from an existing image</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    data-testid="image-upload-input"
                  />
                </div>
              ) : (
                <div className="relative" data-testid="image-preview">
                  <img
                    src={referenceImagePreview}
                    alt="Reference"
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={removeReferenceImage}
                    className="absolute top-2 right-2 p-2 bg-[#EF4444] rounded-lg hover:bg-[#DC2626] transition-colors"
                    data-testid="remove-image-button"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>

            {/* Motion Intensity */}
            <div className="bg-[#0B0F19] rounded-xl border border-[#1F2937] p-6">
              <label className="block text-white text-sm font-medium mb-3">
                Motion Intensity
              </label>
              <div className="grid grid-cols-3 gap-3">
                {motionLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setMotionIntensity(level.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${motionIntensity === level.value
                      ? 'border-[#A855F7] bg-[#A855F7]/10'
                      : 'border-[#1F2937] hover:border-[#A855F7]/50'
                      }`}
                    data-testid={`motion-${level.value}`}
                  >
                    <p className="text-white font-semibold text-sm">{level.label}</p>
                    <p className="text-[#9CA3AF] text-xs mt-1">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration and Aspect Ratio */}
            <div className="grid grid-cols-2 gap-4">
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

              <div className="bg-[#0B0F19] rounded-xl border border-[#1F2937] p-6">
                <label className="block text-white text-sm font-medium mb-3">
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-4 py-3 bg-[#111827] border border-[#1F2937] rounded-lg text-white focus:outline-none focus:border-[#A855F7] transition-colors"
                  data-testid="aspect-ratio-select"
                >
                  {aspectRatios.map((ar) => (
                    <option key={ar.value} value={ar.value}>
                      {ar.label}
                    </option>
                  ))}
                </select>
              </div>
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
