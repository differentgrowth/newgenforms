import { Header } from "@/components/headers";
import { Footer } from "@/components/footer";

type LayoutProps = {
  params: {};
  children: React.ReactNode;
}

const Layout = ( { children }: LayoutProps ) => {
  return (
    <>
      <Header />
      { children }
      <Footer />
    </>
  );
};

export default Layout;