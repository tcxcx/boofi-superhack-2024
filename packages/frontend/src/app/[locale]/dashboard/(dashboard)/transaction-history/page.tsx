import WrapperTransactionHistory from "@/components/wrapper-client/wrapper-transaction-history";

interface PageProps {
  searchParams: {
    userId: string;
    page: string;
    id?: string;
  };
}

const Page = ({ searchParams }: PageProps) => {
  return <WrapperTransactionHistory searchParams={searchParams} />;
};

export default Page;
