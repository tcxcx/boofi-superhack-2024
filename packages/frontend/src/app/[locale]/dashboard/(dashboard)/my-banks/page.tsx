// /src/app/[locale]/dashboard/(dashboard)/my-banks/page.tsx

import WrapperMyBanks from "@/components/wrapper-client/wrapper-my-banks";

interface PageProps {
  searchParams: {
    userId: string;
  };
}

const Page = ({ searchParams }: PageProps) => {
  return <WrapperMyBanks searchParams={searchParams} />;
};

export default Page;
