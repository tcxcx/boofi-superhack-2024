import React from "react";
import { Play, Pause } from "lucide-react";

interface FooterProps {
  isPlaying: boolean;
  togglePlay: () => void;
}

const Footer: React.FC<FooterProps> = ({ isPlaying, togglePlay }) => {
  return (
    <>
      <span className="flex items-center mt-8 w-full">
        <span className="h-px flex-1 bg-black"></span>
        <button
          onClick={togglePlay}
          className="p-2 ml-4 rounded-full hover:bg-gray-100 transition-colors"
        >
          {isPlaying ? (
            <Pause size={24} className="text-black" />
          ) : (
            <Play size={24} className="text-black" />
          )}
        </button>
        <span className="relative z-10 text-indigo-500 px-6 text-lg font-bold">
          BooFi Finance 2024
        </span>
      </span>
    </>
  );
};

export default Footer;
