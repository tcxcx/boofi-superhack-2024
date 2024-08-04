import Wrapper from "@/components/wrapper-client/wrapper-page";

interface PageProps {
  searchParams: {
    userId: string;
    page: string;
  };
}

const Page = ({ searchParams }: PageProps) => {
  return <Wrapper searchParams={searchParams} />;
};

export default Page;
