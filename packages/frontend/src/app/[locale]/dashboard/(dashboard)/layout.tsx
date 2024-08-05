import MobileNav from "@/components/bank/MobileNav";
import Image from "next/image";
import DashboardSidebar from "@/components/bank/DashboardSidebar";
import GridPattern from "@/components/magicui/grid-pattern";
import { cn } from "@/utils";
import AltContainer from "@/components/Container/alternate-bg";
import WalletHeader from "@/components/dashboard/wallet-header";
import {
  useDynamicContext,
  useIsLoggedIn,
  DynamicNav,
} from "@dynamic-labs/sdk-react-core";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full border border-black rounded-r-lg">
      <div className="flex-shrink-0">
        <AltContainer>
          <DashboardSidebar />
        </AltContainer>
      </div>
      <div className="flex flex-grow flex-col bg-white dark:bg-indigo-100 relative overflow-hidden">
        <div className="root-layout z-10">
          <Image
            src="/images/BooFi-icon.png"
            width={30}
            height={30}
            alt="logo"
          />
          <div>
            <MobileNav />
          </div>
        </div>
        <GridPattern
          width={40}
          height={40}
          x={-1}
          y={-1}
          className={cn(
            "absolute inset-0 [mask-image:linear-gradient(to_bottom_right,black,transparent,transparent)]"
          )}
        />
        <WalletHeader />
        <div className="flex-grow overflow-auto z-10">{children}</div>
      </div>
    </div>
  );
}
