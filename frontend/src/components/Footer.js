import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 px-10 py-8 text-gray-400">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <img src="/assets/logo.png" alt="logo" className="w-6 h-6" />
          <span>AI CREATOR STUDIO</span>
        </div>

        <div className="flex gap-6 text-sm">
          <span className="cursor-pointer hover:text-white">Privacy</span>
          <span className="cursor-pointer hover:text-white">Terms</span>
          <span className="cursor-pointer hover:text-white">Twitter</span>
          <span className="cursor-pointer hover:text-white">Discord</span>
        </div>
      </div>

      <p className="text-center text-xs mt-6">
        © 2024 AI Creator Studio. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
