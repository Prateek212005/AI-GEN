import React, { useState, useEffect } from 'react';
import { getGallery, deleteGeneration } from '../services/api';
import { Loader2, ImageIcon, VideoIcon, Download, Trash2, X, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const loadGallery = async () => {
      setLoading(true);
      try {
        const filterType = filter === 'all' ? null : filter;
        const data = await getGallery(filterType);
        setGenerations(data);
      } catch (error) {
        toast.error('Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [filter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this generation?')) return;

    try {
      await deleteGeneration(id);
      setGenerations(generations.filter(g => g.id !== id));
      toast.success('Deleted successfully');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleDownload = async (item) => {
    try {
      toast.info('Downloading...');
      const response = await fetch(item.result_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-gen-${item.type}-${item.id}.${item.type === 'image' ? 'png' : 'mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download complete!');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const filters = [
    { value: 'all', label: 'All', icon: null },
    { value: 'image', label: 'Images', icon: ImageIcon },
    { value: 'video', label: 'Videos', icon: VideoIcon }
  ];

  return (
    <div className="min-h-screen bg-black pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2" data-testid="gallery-title">Gallery</h1>
            <p className="text-[#9CA3AF]">Your AI-generated creations</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            {filters.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${filter === f.value
                    ? 'bg-gradient-to-r from-[#A855F7] to-[#3B82F6] text-white'
                    : 'bg-[#111827] text-[#9CA3AF] hover:text-white border border-[#1F2937]'
                    }`}
                  data-testid={`filter-${f.value}`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20" data-testid="gallery-loading">
            <Loader2 className="w-12 h-12 text-[#A855F7] animate-spin" />
          </div>
        ) : generations.length === 0 ? (
          <div className="text-center py-20" data-testid="gallery-empty">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#111827] rounded-full mb-4">
              <ImageIcon className="w-10 h-10 text-[#9CA3AF]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No generations yet</h3>
            <p className="text-[#9CA3AF]">Start creating amazing content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="gallery-grid">
            {generations.map((item) => (
              <div
                key={item.id}
                className="group bg-[#0B0F19] rounded-xl border border-[#1F2937] overflow-hidden hover:border-[#A855F7] transition-all"
                data-testid={`gallery-item-${item.type}`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-[#111827] cursor-pointer" onClick={() => setSelectedItem(item)}>
                  {item.type === 'image' ? (
                    <img
                      src={item.result_url}
                      alt={item.prompt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <video
                        src={item.result_url}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          <VideoIcon className="w-8 h-8 text-black" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="flex items-center space-x-2 w-full">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item);
                        }}
                        className="flex-1 py-2 bg-white/90 text-black rounded-lg hover:bg-white transition-colors flex items-center justify-center space-x-1"
                        data-testid="gallery-download-button"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Download</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                        className="p-2 bg-white/90 text-black rounded-lg hover:bg-white transition-colors"
                        data-testid="gallery-view-button"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {item.type === 'image' ? (
                      <ImageIcon className="w-4 h-4 text-[#A855F7]" />
                    ) : (
                      <VideoIcon className="w-4 h-4 text-[#3B82F6]" />
                    )}
                    <span className="text-[#9CA3AF] text-sm capitalize">{item.type}</span>
                    {item.style && (
                      <span className="text-[#9CA3AF] text-sm">• {item.style}</span>
                    )}
                  </div>
                  <p className="text-white text-sm line-clamp-2 mb-3">{item.prompt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280] text-xs">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-[#EF4444] hover:text-[#DC2626] transition-colors"
                      data-testid="gallery-delete-button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" data-testid="gallery-modal">
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 p-2 bg-[#111827] rounded-lg hover:bg-[#1F2937] transition-colors"
            data-testid="gallery-modal-close"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-5xl w-full">
            {selectedItem.type === 'image' ? (
              <img
                src={selectedItem.result_url}
                alt={selectedItem.prompt}
                className="w-full rounded-lg"
              />
            ) : (
              <video
                src={selectedItem.result_url}
                controls
                autoPlay
                className="w-full rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            )}

            <div className="mt-4 bg-[#0B0F19] rounded-lg p-4">
              <p className="text-white mb-2">{selectedItem.prompt}</p>
              <div className="flex items-center justify-between text-[#9CA3AF] text-sm">
                <span>{new Date(selectedItem.created_at).toLocaleString()}</span>
                <button
                  onClick={() => handleDownload(selectedItem)}
                  className="flex items-center space-x-1 text-[#A855F7] hover:text-[#3B82F6] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;