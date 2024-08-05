// /src/app/[locale]/dashboard/(dashboard)/payment-transfer/page.tsx

import WrapperPaymentTransfer from "@/components/wrapper-client/wrapper-payment-transfer";

interface PageProps {
  searchParams: {
    userId: string;
    page: string;
    id?: string;
  };
}

const Page = ({ searchParams }: PageProps) => {
  return <WrapperPaymentTransfer searchParams={searchParams} />;
};

export default Page;
