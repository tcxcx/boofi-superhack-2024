import MobileNav from "@/components/bank/MobileNav";
import Sidebar from "@/components/bank/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import { redirect } from "next/navigation";

interface RootLayoutProps {
  children: React.ReactNode;
  userId: string;
}

export default async function RootLayout({
  children,
  userId,
}: RootLayoutProps) {
  const loggedIn = await getLoggedInUser(userId);

  if (!loggedIn) {
    redirect("/");
    return null; // To prevent further rendering
  }

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />

      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
          <div>
            <MobileNav user={loggedIn} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
