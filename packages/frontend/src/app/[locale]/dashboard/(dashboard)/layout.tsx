import MobileNav from "@/components/bank/MobileNav";
import Sidebar from "@/components/bank/Sidebar";
import Image from "next/image";
import Header from "@/components/Header";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex h-screen w-full font-violet border border-black rounded-lg">
        <Sidebar />

        <div className="flex size-full flex-col">
          <div className="root-layout">
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
          {children}
        </div>
      </main>
    </>
  );
}
