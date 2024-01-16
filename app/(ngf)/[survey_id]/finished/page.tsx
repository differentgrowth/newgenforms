import { notFound, redirect } from "next/navigation";

import { formatDistanceToNow } from "date-fns";

import { getSurveyDates } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SURVEY_STATUS } from "@/definitions/survey";

type PageProps = {
  params: {
    survey_id: string;
  };
  searchParams: {};
}

const Page = async ( { params: { survey_id } }: PageProps ) => {
  const survey = await getSurveyDates( survey_id );

  if ( !survey || !survey.to ) {
    notFound();
  }

  if ( survey.status !== SURVEY_STATUS.FINISHED ) {
    redirect( `/${ survey_id }` );
  }

  return (
    <section className="container mx-auto mt-12 px-2">
      <Card>
        <CardHeader>
          <CardTitle>
            { survey.name }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            { formatDistanceToNow(
              survey.to,
              { addSuffix: true }
            ) }
          </CardDescription>
        </CardContent>
      </Card>
    </section>
  );
};

export default Page;