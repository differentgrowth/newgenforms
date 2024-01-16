import { notFound } from "next/navigation";

import { format } from "date-fns-tz";

import { getAnswerByClient } from "@/lib/db";
import { DateFormatter } from "@/components/date-formatter";
import { QUESTION_TYPE } from "@/definitions/question";

type PageProps = {
  params: {
    customer_id: string;
    survey_id: string;
    client: string;
  };
  searchParams: {};
}

const Page = async ( { params: { client } }: PageProps ) => {
  const data = await getAnswerByClient( client );

  if ( !data ) {
    notFound();
  }

  return (
    <main className="container mx-auto py-10">
      <h1>{ data[ 0 ].Question.Survey.name }</h1>
      <div className="mt-6 border-t">
        <dl className="divide-y">
          { data.map( item => (
            <div
              className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 lg:grid-cols-5"
              key={ item.id }
            >
              <dt className="text-sm font-medium leading-6 first-letter:uppercase">
                { item.Question.register_name }
              </dt>

              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 lg:col-span-4">
                <div className="flex flex-col gap-y-1.5">
                  <DateFormatter
                    date={ item.created_at }
                    timezone={ item.Question.Survey.timezone }
                    className="mr-auto grow-0"
                  />
                  <p className="max-w-prose font-semibold">
                    { item.Question.label }
                  </p>
                  <p className="max-w-prose">
                    { item.Question.type === QUESTION_TYPE.FEEDBACK || item.Question.type === QUESTION_TYPE.RATING
                      ? ' / 5'
                      : null }
                    { item.Question.type === QUESTION_TYPE.DATE_PICKER
                      ? format( new Date( item.value[ 0 ] ), "LLL dd, y - h:mm a zzz", { timeZone: item.Question.Survey.timezone } )
                      : item.value.join( ' | ' ) }
                  </p>
                </div>
              </dd>
            </div>
          ) ) }
        </dl>
      </div>

    </main>
  );
};

export default Page;