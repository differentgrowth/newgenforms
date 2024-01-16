import { notFound, redirect } from "next/navigation";

import { getFinalMessage } from "@/lib/db";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RedirectDescription } from "@/components/redirect-description";
import { SURVEY_STATUS } from "@/definitions/survey";

type PageProps = {
  params: {
    survey_id: string;
  };
  searchParams: {};
}

const Page = async ( { params: { survey_id } }: PageProps ) => {
  const data = await getFinalMessage( survey_id );

  if ( !data ) {
    notFound();
  }

  if(data.status === SURVEY_STATUS.FINISHED) {
    redirect( `/${ survey_id }/finished` );
  }

  return (
    <section className="container mx-auto mt-12 px-2">
      <Card>
        <CardHeader>
          <CardTitle>
            { data.name }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            { data.final_message }
          </CardDescription>
        </CardContent>
        { data.redirect
          ? (
            <CardFooter>
              <RedirectDescription redirectTo={ data.redirect } />
            </CardFooter>
          )
          : null }
      </Card>
    </section>
  );
};

export default Page;