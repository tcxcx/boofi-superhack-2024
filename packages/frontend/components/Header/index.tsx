"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import MobileMenu from "./mobile-menu";
import LocalSwitcher from "@/components/locale-switcher";
import { ModeToggle } from "@/components/theme-toggle";
import { useWindowSize } from "@/hooks/use-window-size";
import { WidgetContainer } from "../dynamic-content/WidgetContainer";

const Header: React.FC = () => {
  const { width } = useWindowSize();

  return (
    <header className="bg-transparent px-4 py-6 sm:px-6 lg:px-8 relative">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center w-full space-x-2">
          <ModeToggle />
          <LocalSwitcher />

          <span className="h-px flex-1 bg-black mx-6"></span>
          <Link href="/">
            <div className="flex items-center">
              <Image
                src="/images/BooFi-icon.png"
                alt="Logo"
                width={100}
                height={100}
              />
            </div>
          </Link>
          <span className="h-px flex-1 bg-black mx-6 block"></span>
        </div>
        {width && width >= 1024 ? (
          <>
            <WidgetContainer />
          </>
        ) : (
          <div className="space-x-2 inline-block">
            <MobileMenu />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
