import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BankCard from "./BankCard";
import { countTransactionCategories } from "@/utils";
import Category from "./Category";
import { useWindowSize } from "@/hooks/use-window-size";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils";
import BlurFade from "@/components/magicui/blur-fade";
import { RightSidebarProps, CategoryCount } from "@/lib/types";

const RightSidebar = ({ user, transactions, banks }: RightSidebarProps) => {
  const { width } = useWindowSize();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  const categories: CategoryCount[] = transactions
    ? countTransactionCategories(transactions)
    : [];

  if (width && width < 1024) {
    return null;
  }

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed top-16 hover:animate-pulse right-12 z-1 p-2 group bg-gradient-to-br animate-shimmer from-indigo-200 via-cyan-200 to-purple-300 hover:text-accent-foreground text-cyan-900 dark:text-primary active:text-opacity-75 rounded-full shadow-md",
          isExpanded ? "hidden" : "block"
        )}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <aside
        className={cn(
          "no-scrollbar h-screen max-h-screen flex-col border-l border-gray-200 dark:border-white xl:overflow-y-scroll transition-all duration-300",
          isExpanded ? "w-[355px]" : "w-0 overflow-hidden"
        )}
      >
        <BlurFade delay={0.1} inView>
          <section className="flex flex-col pb-8">
            <div className="profile-banner relative">
              <button
                onClick={toggleSidebar}
                className="absolute bottom-2 left-2 text-white hover:text-gray-700 dark:hover:text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="profile">
              <div className="profile-img">
                {user.ens?.avatar ? (
                  <Image
                    src={user.ens.avatar}
                    alt="ENS Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <span className="text-5xl font-bold text-indigo-400 dark:text-primary">
                    {user.firstName ? user.firstName[0] : ""}
                  </span>
                )}
              </div>

              <div className="profile-details">
                <h1 className="profile-name">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="profile-email">{user.email}</p>
              </div>
            </div>
          </section>
        </BlurFade>

        {banks && banks.length > 0 && (
          <BlurFade delay={0.2} inView>
            <section className="banks">
              <div className="flex w-full justify-between">
                <h2 className="header-2">My Banks</h2>
                <Link href="/" className="flex gap-2">
                  <Image
                    src="/icons/plus.svg"
                    width={20}
                    height={20}
                    alt="plus"
                  />
                  <h2 className="text-14 font-semibold text-gray-600">
                    Add Bank
                  </h2>
                </Link>
              </div>

              <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
                <div className="relative z-1">
                  <BankCard
                    key={banks[0].$id}
                    account={banks[0]}
                    userName={`${user.firstName} ${user.lastName}`}
                    showBalance={false}
                  />
                </div>
                {banks[1] && (
                  <div className="absolute right-0 top-8 z-1 w-[90%]">
                    <BankCard
                      key={banks[1].$id}
                      account={banks[1]}
                      userName={`${user.firstName} ${user.lastName}`}
                      showBalance={false}
                    />
                  </div>
                )}
              </div>

              {categories.length > 0 && (
                <BlurFade delay={0.2} inView>
                  <div className="mt-10 flex flex-1 flex-col gap-6">
                    <h2 className="header-2">Top Spending Categories</h2>

                    <div className="space-y-5">
                      {categories.map((category, index) => (
                        <Category key={category.name} category={category} />
                      ))}
                    </div>
                  </div>
                </BlurFade>
              )}
            </section>
          </BlurFade>
        )}
      </aside>
    </>
  );
};

export default RightSidebar;
