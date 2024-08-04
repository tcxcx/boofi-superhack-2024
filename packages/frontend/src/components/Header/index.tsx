"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "./mobile-menu";
import LocalSwitcher from "@/components/locale-switcher";
import { ModeToggle } from "@/components/theme-toggle";
import { useWindowSize } from "@/hooks/use-window-size";
import { WidgetContainer } from "../dynamic-content/WidgetContainer";
import SparklesText from "@/components/magicui/sparkles-text";
import { motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";
const Header: React.FC = () => {
  const { width } = useWindowSize();
  const MotionLink = motion(Link);

  return (
    <header className="bg-transparent relative">
      <div className="container mx-auto grid grid-cols-3 items-center">
        <div className="flex items-center space-x-2">
          <Suspense fallback={<Skeleton className="h-4 w-[250px]" />}>
            <ModeToggle />
            <LocalSwitcher />
          </Suspense>

          <span className="h-px flex-1 bg-black"></span>
        </div>
        <div className="flex justify-center">
          <MotionLink
            href="/"
            whileHover={{ scale: 1.15, rotate: 4 }}
            whileTap={{ scale: 1.05, rotate: 2 }}
          >
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
          </MotionLink>
        </div>
        <div className="flex items-center justify-end">
          <span className="h-px flex-grow bg-black"></span>
          <Suspense fallback={<Skeleton className="h-4 w-[250px]" />}>
            {width && width >= 1024 ? <WidgetContainer /> : <MobileMenu />}
          </Suspense>
        </div>
      </div>
    </header>
  );
};

export default Header;
