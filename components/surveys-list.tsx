import Link from "next/link";

import { EyeOpenIcon, Pencil1Icon } from "@radix-ui/react-icons";

import { getCustomerSurveys } from "@/lib/db";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DateFormatter } from "@/components/date-formatter";
import { DeleteDialog, MarkAsPublicDialog, MarkAsReadyDialog } from "@/components/dialogs-survey";
import { buttonVariants } from "@/components/ui/button";
import { SURVEY_STATUS } from "@/definitions/survey";
import { cn } from "@/lib/utils";
import { CopySurveyUrlButton } from "@/components/buttons";

type Props = {
  customerId: string;
}
export const SurveysList = async ( { customerId }: Props ) => {
  const surveys = await getCustomerSurveys( customerId );

  if ( !surveys.length ) {
    return (
      <section className="container">
        <h3>
          No surveys yet
        </h3>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-8">
      { surveys.map( survey => (
        <Card key={ survey.id }>
          <CardHeader className="flex flex-row flex-wrap justify-between">
            <CardTitle className="grow">
              { survey.name }
            </CardTitle>
            <Badge
              variant="secondary"
              className="ml-1.5 uppercase"
            >
              { survey.theme }
            </Badge>
            <Badge className="ml-1.5 uppercase">
              { survey.status }
            </Badge>
          </CardHeader>
          { !!survey.from && !!survey.to
            ? (
              <CardContent className="flex flex-row flex-wrap gap-1.5">
                <DateFormatter
                  date={ survey.from }
                  timezone={ survey.timezone }
                />
                <DateFormatter
                  date={ survey.to }
                  timezone={ survey.timezone }
                />
              </CardContent>
            )
            : null }
          <CardFooter className="grid grid-cols-2 space-x-1.5 sm:grid-cols-5">
            { survey.status === SURVEY_STATUS.READY || survey.status === SURVEY_STATUS.PUBLISHED
              ? (
                <CopySurveyUrlButton
                  surveyId={ survey.id }
                  className="col-span-2 mb-1.5 sm:col-span-5"
                />
              )
              : null }
            { survey.status === SURVEY_STATUS.EMPTY || survey.status === SURVEY_STATUS.PENDING
              ? (
                <Link
                  className={ cn(
                    buttonVariants( { variant: 'secondary' } ),
                    'grow sm:col-start-1'
                  ) }
                  href={ `/dashboard/${ customerId }/edit-survey/${ survey.id }` }
                >
                  Edit
                  <Pencil1Icon className="ml-1.5 size-4" />
                </Link>
              )
              : null }
            { survey.status === SURVEY_STATUS.PENDING
              ? <MarkAsReadyDialog surveyId={ survey.id } />
              : null }
            { survey.status === SURVEY_STATUS.READY
              ? <MarkAsPublicDialog
                surveyId={ survey.id }
                status={ survey.status }
              />
              : null }
            { survey.status ===
              SURVEY_STATUS.READY ||
              survey.status ===
              SURVEY_STATUS.PUBLISHED ||
              survey.status ===
              SURVEY_STATUS.FINISHED
              ? (
                <Link
                  className={ cn(
                    buttonVariants( { variant: 'secondary' } ),
                    'grow sm:col-start-4'
                  ) }
                  href={ `/dashboard/${ customerId }/${ survey.id }` }
                >
                  View
                  <EyeOpenIcon className="ml-1.5 size-4" />
                </Link>
              )
              : null }
            <DeleteDialog
              surveyId={ survey.id }
              name={ survey.name }
            />
          </CardFooter>
        </Card>
      ) ) }
    </section>
  );
};