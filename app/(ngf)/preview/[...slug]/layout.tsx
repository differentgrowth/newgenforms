import { notFound } from "next/navigation";

import { ReloadButton } from "@/components/buttons";
import { getSurveyTheme } from "@/lib/db";
import { cn } from "@/lib/utils";

type LayoutProps = {
  children: React.ReactNode;
  params: {
    slug: string[];
  }
}

export const dynamic = 'force-dynamic';

const Layout = async ( { params: { slug }, children }: LayoutProps ) => {
  if ( slug.length !== 2 ) {
    notFound();
  }

  const data = await getSurveyTheme( slug[ 0 ] );
  if ( !data ) {
    notFound();
  }

  return (
    <>
      <header className="bg-muted flex items-center p-2">
        <p className="text-muted-foreground grow text-center font-mono text-xs">This is a preview</p>
        <ReloadButton />
      </header>
      <main
        className={ cn(
          "bg-background text-foreground mb-0 p-0",
          data?.theme
        ) }
      >
        { children }
      </main>
    </>
  );
};

export default Layout;