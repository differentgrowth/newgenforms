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
    <section className="px-2 container mx-auto">
      <GearIcon className="w-24 h-24 animate-spin mt-12 mx-auto" />
    </section>
  );
};

export default Page;