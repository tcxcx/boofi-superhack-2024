"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Translations } from "@/lib/types/translations";

interface HomeContentProps {
  translations: Translations["Home"];
}

export const HomeContent: React.FC<HomeContentProps> = ({ translations }) => {
  const [hoveredCharacter, setHoveredCharacter] = useState<string | null>(null);

  const renderSlogan = () => (
    <p className="text-lg mb-8">
      <span className="text-purple-400">{translations.slogan.part1}</span>{" "}
      <span className="text-purple-400">{translations.slogan.part2}</span>
      {translations.slogan.part3}{" "}
      <span className="text-purple-400">{translations.slogan.part4}</span>.
    </p>
  );

  return (
    <div className="p-4 overflow-hidden min-h-screen flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center justify-center w-full max-w-4xl">
        <div className="absolute inset-0 flex flex-col sm:flex-row w-full h-full items-center justify-center">
          <div
            className={`relative w-full sm:w-1/2 h-1/2 sm:h-full transition-opacity duration-300 ${
              hoveredCharacter === "Ezequiel" ? "opacity-70" : "opacity-30"
            }`}
          >
            <Image
              src="/images/neo-matrix.webp"
              alt={translations.neoMatrixAlt}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div
            className={`relative w-full sm:w-1/2 h-1/2 sm:h-full transition-opacity duration-300 ${
              hoveredCharacter === "Teresa" ? "opacity-70" : "opacity-30"
            }`}
          >
            <Image
              src="/images/boofi-matrix.webp"
              alt={translations.boofiMatrixAlt}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="relative z-10 text-center bg-background dark:bg-background rounded-lg shadow-lg p-8 max-w-md w-full border-2 border-black dark:border-white">
          <h1 className="text-4xl font-bold m-4 text-primary dark:text-white">
            {translations.welcome}
          </h1>
          <p className="text-lg mb-8">
            {translations.to}
            <br />
            <span className="inline-block bg-gradient-to-r text-xl from-indigo-300 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
              BooFi
            </span>
            .
          </p>
          {renderSlogan()}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/situaciones/Ezequiel">
              <div
                className="group relative inline-block focus:outline-none focus:ring w-full"
                onMouseEnter={() => setHoveredCharacter("Ezequiel")}
                onMouseLeave={() => setHoveredCharacter(null)}
              >
                <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-indigo-200 transition-transform group-hover:translate-x-0 group-hover:translate-y-0 rounded-lg"></span>
                <span className="relative inline-block border-2 border-current px-6 py-3 text-sm font-bold uppercase tracking-widest text-black group-hover:bg-opacity-50 group-active:text-opacity-75 w-full rounded-lg">
                  Opcion 1
                </span>
              </div>
            </Link>
            <Link href="/situaciones/Teresa">
              <div
                className="group relative inline-block focus:outline-none focus:ring w-full"
                onMouseEnter={() => setHoveredCharacter("Teresa")}
                onMouseLeave={() => setHoveredCharacter(null)}
              >
                <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-indigo-200 transition-transform group-hover:translate-x-0 group-hover:translate-y-0 rounded-lg"></span>
                <span className="relative inline-block border-2 border-current px-6 py-3 text-sm font-bold uppercase tracking-widest text-black group-hover:bg-opacity-50 group-active:text-opacity-75 w-full rounded-lg">
                  Opcion 2
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
