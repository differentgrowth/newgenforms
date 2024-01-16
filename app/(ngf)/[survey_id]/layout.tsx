import { notFound } from "next/navigation";

import { cn } from "@/lib/utils";
import { automaticFinish, automaticPublish, getSurveyTheme } from "@/lib/db";

type LayoutProps = {
  children: React.ReactNode;
  params: {
    survey_id: string;
  }
}

export const dynamic = 'force-dynamic';

const Layout = async ( { params: { survey_id }, children }: LayoutProps ) => {
  const [ data ] = await Promise.all( [
                                        getSurveyTheme( survey_id ),
                                        automaticPublish(),
                                        automaticFinish()
                                      ] );

  if ( !data ) {
    notFound();
  }

  return (
    <main
      className={ cn(
        "bg-background text-foreground mb-0 p-0",
        data?.theme
      ) }
    >
      { children }
    </main>
  );
};

export default Layout;