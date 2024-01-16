import { Suspense } from "react";
import { SurveysList } from "@/components/surveys-list";
import { GearIcon } from "@radix-ui/react-icons";

type PageProps = {
  params: {
    customer_id: string;
  };
  searchParams: {};
}
const Page = async ( { params: { customer_id } }: PageProps ) => {
  return (
    <main>
      <div className="container mb-6">
        <h2>Dashboard</h2>
      </div>
      <Suspense fallback={ <GearIcon className="mx-auto size-16 animate-spin" /> }>
        <SurveysList customerId={ customer_id } />
      </Suspense>
    </main>
  );
};

export default Page;