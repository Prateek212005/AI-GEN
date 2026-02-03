import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ fullScreen = true, message = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" data-testid="loading-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#A855F7] animate-spin mx-auto mb-4" />
          <p className="text-[#9CA3AF]">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8" data-testid="loading-component">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-[#A855F7] animate-spin mx-auto mb-2" />
        <p className="text-[#9CA3AF] text-sm">{message}</p>
      </div>
    </div>
  );
};

export default Loading;