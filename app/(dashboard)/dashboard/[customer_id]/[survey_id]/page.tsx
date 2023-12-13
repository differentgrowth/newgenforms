import { Suspense } from "react";

import { GearIcon, ReloadIcon } from "@radix-ui/react-icons";

import { getAnswers, getClientIds } from "@/lib/db";
import { DataTable } from "./data-table";
import { refreshAnswerTable } from "@/app/actions";
import { QUESTION_TYPE } from "@/definitions/question";
import { AnswerInTable } from "@/definitions/answer";
import { cn } from "@/lib/utils";
import { CopySurveyUrlButton, SubmitButton } from "@/components/buttons";

type PageProps = {
  params: {
    customer_id: string;
    survey_id: string;
  };
  searchParams: {};
}

const getData = async ( props: {
  survey_id: string;
  customer_id: string;
} ) => {
  const [ hydratedSurvey, clientIds ] = await Promise.all( [
                                                             getAnswers( props ),
                                                             getClientIds( props.survey_id )
                                                           ] );
  const columns: AnswerInTable[] = [];

  if ( !hydratedSurvey ) {
    return {
      data: [],
      columns: []
    };
  }

  hydratedSurvey.questions.forEach( question => {
    columns.push(
      {
        id: question.id,
        created_at: '',
        timezone: hydratedSurvey.timezone,
        client: '',
        value: '',
        register_name: question.register_name,
        type: question.type as QUESTION_TYPE,
        order: question.order,
        customerId: hydratedSurvey.customerId,
        questionId: question.id,
        surveyId: hydratedSurvey.id
      }
    );
  } );

  const answers: AnswerInTable[] = hydratedSurvey.questions
                                                 .map( question => question.answers.map( answer => ( {
                                                   id: answer.id,
                                                   created_at: answer.created_at.toISOString(),
                                                   timezone: hydratedSurvey.timezone,
                                                   client: answer.client,
                                                   value: answer.value.join( ' | ' ),
                                                   register_name: question.register_name,
                                                   type: question.type as QUESTION_TYPE,
                                                   order: question.order,
                                                   customerId: question.customerId,
                                                   questionId: question.id,
                                                   surveyId: hydratedSurvey.id,
                                                   [ question.register_name ]: answer.value.join( ' | ' )
                                                 } ) ) )
                                                 .flat();

  const data: AnswerInTable[] = Object.values( clientIds.reduce( ( acc, curr ) => ( {
    ...acc,
    [ curr.client ]: answers
      .filter( answer => answer.client === curr.client )
      .reduce( ( ac, cur ) => ( {
        ...ac,
        ...cur,
        [ cur.register_name ]: cur[ cur.register_name ]
      } ), {} )
  } ), {} ) );

  return {
    data,
    columns
  };
};

const Page = async ( { params: { survey_id, customer_id } }: PageProps ) => {
  const { data, columns } = await getData( { survey_id, customer_id } );

  return (
    <main className="container mx-auto py-10 flex flex-col space-y-3">
      <div
        className={ cn(
          "w-full flex flex-col space-y-1.5",
          "sm:max-w-sm sm:ml-auto sm:flex-row sm:space-y-0 sm:space-x-1.5"
        ) }
      >
        <CopySurveyUrlButton
          className="grow"
          surveyId={ survey_id }
        />
        <form
          action={ refreshAnswerTable }
          className="grow"
        >
          <input
            type="hidden"
            name="surveyId"
            value={ survey_id }
          />
          <input
            type="hidden"
            name="customerId"
            value={ customer_id }
          />
          <SubmitButton
            variant="secondary"
            className="w-full"
            icon={ <ReloadIcon /> }
          >
            Refresh
          </SubmitButton>
        </form>
      </div>
      <Suspense fallback={ <GearIcon className="w-16 h-16 animate-spin mt-12 mx-auto" /> }>
        <DataTable
          columns={ columns }
          data={ data }
        />
      </Suspense>
    </main>
  );
};

export default Page;