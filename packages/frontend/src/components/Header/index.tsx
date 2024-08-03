"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./mobile-menu";
import LocalSwitcher from "@/components/locale-switcher";
import { ModeToggle } from "@/components/theme-toggle";
import { useWindowSize } from "@/hooks/use-window-size";
import { WidgetContainer } from "../dynamic-content/WidgetContainer";
import SparklesText from "@/components/magicui/sparkles-text";

const Header: React.FC = () => {
  const { width } = useWindowSize();

  return (
    <header className="bg-transparent relative">
      <div className="container mx-auto grid grid-cols-3 items-center">
        <div className="flex items-center">
          <ModeToggle />
          <LocalSwitcher />
          <span className="h-px flex-1 bg-black"></span>
        </div>
        <div className="flex justify-center">
          <Link href="/">
            <div className="flex items-center">
              <SparklesText>
                <Image
                  src="/images/BooFi-icon.png"
                  alt="Logo"
                  width={100}
                  height={100}
                />
              </SparklesText>{" "}
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-end">
          <span className="h-px flex-grow bg-black"></span>
          {width && width >= 1024 ? <WidgetContainer /> : <MobileMenu />}
        </div>
      </div>
    </header>
  );
};

export default Header;
