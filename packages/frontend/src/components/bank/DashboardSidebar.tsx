"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import SparklesText from "@/components/magicui/sparkles-text";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import {
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Home,
  DollarSign,
  History as HistoryIcon,
  Send as SendIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

interface SidebarLink {
  icon: React.ReactNode;
  route: string;
  label: string;
}

interface LinkComponentProps {
  item: SidebarLink;
  active: boolean;
  isExpanded: boolean;
}

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const MotionLink = motion(Link);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const isActive = (route: string) => {
    return pathname === route;
  };

  const sidebarLinks: SidebarLink[] = [
    {
      icon: <Home />,
      route: "/en/dashboard",
      label: "Home",
    },
    {
      icon: <DollarSign />,
      route: "/en/dashboard/my-banks",
      label: "My Banks",
    },
    {
      icon: <HistoryIcon />,
      route: "/en/dashboard/transaction-history",
      label: "Transaction History",
    },
    {
      icon: <SendIcon />,
      route: "/en/dashboard/payment-transfer",
      label: "Transfer Funds",
    },
  ];

  const LinkComponent = ({ item, active, isExpanded }: LinkComponentProps) => {
    const linkContent = (
      <>
        <div className={cn("relative size-6", { "text-white": active })}>
          {item.icon}
        </div>
        {isExpanded && (
          <p className={cn("text-16 font-semibold", { "text-white": active })}>
            {item.label}
          </p>
        )}
      </>
    );

    return isExpanded ? (
      <Link
        href={`${item.route}?userId=${userId}`}
        className={cn(
          "flex gap-3 items-center py-1 md:p-3 2xl:p-4 rounded-lg",
          "justify-start",
          "hover:bg-secondary/50",
          { "bg-indigo-600": active }
        )}
      >
        {linkContent}
      </Link>
    ) : (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`${item.route}?userId=${userId}`}
              className={cn(
                "flex gap-4 items-center py-1 md:p-1 2xl:p-2 rounded-lg",
                "justify-center",
                "hover:bg-secondary/50",
                { "bg-indigo-400": active }
              )}
            >
              {linkContent}
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <section
      className={cn(
        "sticky left-0 top-0 flex h-screen flex-col justify-between border-black border rounded-r-lg pt-4 transition-all duration-300 bg-white/10 z-10",
        isExpanded ? "w-64 sm:p-4 xl:p-6" : "w-20 p-2",
        "max-md:hidden" // Hide on mobile devices
      )}
    >
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-white"
        >
          {isExpanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>
      <nav className="flex flex-col gap-4 flex-grow">
        <MotionLink
          href="/"
          whileHover={{ scale: 1.15, rotate: 6 }}
          whileTap={{ scale: 1.05, rotate: 2 }}
          className="group flex flex-col items-center justify-center w-full py-2 text-sm font-medium text-gray-500 rounded-lg hover:text-gray-700 dark:hover:text-white relative"
        >
          <div className="flex items-center">
            <SparklesText>
              <Image
                src="/images/BooFi-icon.png"
                alt="Logo"
                width={isExpanded ? 120 : 100}
                height={isExpanded ? 120 : 100}
              />
            </SparklesText>
          </div>
          {isExpanded && (
            <span className="absolute mt-20 text-xs text-white opacity-0 group-hover:opacity-100 group-hover:-rotate-12 font-basement uppercase transition-all duration-300">
              Go to Main Page
            </span>
          )}
        </MotionLink>

        {sidebarLinks.map((item) => (
          <LinkComponent
            key={item.label}
            item={item}
            active={isActive(item.route)}
            isExpanded={isExpanded}
          />
        ))}
      </nav>

      <div className="sticky inset-x-0 bottom-0">
        {isExpanded ? (
          <button
            onClick={toggleTheme}
            className="flex items-center justify-start w-full py-2 px-4 text-sm font-medium rounded-lg hover:bg-secondary/50 hover:text-gray-700 dark:hover:text-white"
          >
            <div className="relative size-6 mr-2">
              {theme === "dark" ? <Sun /> : <Moon />}
            </div>
            <p className="text-16 font-semibold">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </p>
          </button>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleTheme}
                  className="flex items-center justify-center w-full py-2 text-sm font-medium rounded-lg hover:bg-secondary/50 hover:text-gray-700 dark:hover:text-white"
                >
                  <div className="relative size-6">
                    {theme === "dark" ? <Sun /> : <Moon />}
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{theme === "dark" ? "Light Mode" : "Dark Mode"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </section>
  );
};

export default Sidebar;
