import { notFound, redirect } from "next/navigation";

import { GearIcon } from "@radix-ui/react-icons";
import { v4 } from "uuid";

import { getFirstQuestion } from "@/lib/db";
import { SURVEY_STATUS } from "@/definitions/survey";

type PageProps = {
  params: {
    survey_id: string;
  };
  searchParams: {};
}

const Page = async ( { params: { survey_id } }: PageProps ) => {
  const survey = await getFirstQuestion( survey_id );
  const c = v4();

  if ( !survey?.questions ) {
    notFound();
  }

  if ( survey.status === SURVEY_STATUS.FINISHED ) {
    redirect( `/${ survey_id }/finished` );
  }

  if ( survey.status === SURVEY_STATUS.READY ) {
    redirect( `/${ survey_id }/ready` );
  }

  if ( survey.status === SURVEY_STATUS.PUBLISHED ) {
    redirect( `/${ survey_id }/${ survey.questions.at( 0 )!.id }?c=${ c }` );
  }

  return (
    <section className="container mx-auto px-2">
      <GearIcon className="mx-auto mt-12 size-24 animate-spin" />
    </section>
  );
};

export default Page;