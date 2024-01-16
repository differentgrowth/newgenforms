import { DashboardHeader } from "@/components/headers";

type LayoutProps = {
  params: {
    customer_id: string;
  };
  children: React.ReactNode;
}

export const dynamic = 'force-dynamic';

const Layout = async ( { children }: LayoutProps ) => {
  return (
    <>
      <DashboardHeader />
      { children }
    </>
  );
};

export default Layout;