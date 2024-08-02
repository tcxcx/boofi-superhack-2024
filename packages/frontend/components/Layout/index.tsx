"use client";

import React, { useState, useEffect, useRef } from "react";
import Footer from "@/components/Footer";

const Layout: React.FC<{}> = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <>
      <Footer isPlaying={isPlaying} togglePlay={togglePlay} />
      <audio ref={audioRef} src="/audio/lofi-song.mp3" loop />
    </>
  );
};

export default Layout;
