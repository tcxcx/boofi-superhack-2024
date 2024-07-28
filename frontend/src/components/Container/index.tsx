// src/components/Container.tsx

import React from "react";

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative justify-center items-center mx-auto w-full lg:max-w-7xl border border-black rounded-lg overflow-hidden">
      {children}
    </div>
  );
};

export default Container;
