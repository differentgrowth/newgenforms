import { notFound, redirect } from "next/navigation";

import { getHours, getMinutes, setHours, setMinutes } from "date-fns";

import {
  AddSurveyFeaturesForm,
  MarkSurveyAsReadyForm,
  NewQuestionForm,
  SurveyQuestionForm
} from "@/components/forms-survey";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange, PickerTheme, PickerTime, PickerTimezone } from "@/components/pickers";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getSurvey } from "@/lib/db";
import { CreateQuestion } from "@/definitions/question";
import { SURVEY_STATUS } from "@/definitions/survey";
import { SubmitButton } from "@/components/buttons";

type PageProps = {
  params: {
    customer_id: string;
    survey_id: string;
  };
  searchParams: {}
}
const Page = async ( { params: { survey_id, customer_id } }: PageProps ) => {
  const survey = await getSurvey( { surveyId: survey_id, customerId: customer_id } );

  if ( !survey ) {
    notFound();
  }

  if ( survey.status !== SURVEY_STATUS.EMPTY && survey.status !== SURVEY_STATUS.PENDING ) {
    redirect( `/dashboard/${ customer_id }` );
  }

  return (
    <main>
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <AddSurveyFeaturesForm className="mx-auto w-full max-w-xl lg:max-w-none">
            <Card>
              <CardHeader>
                <CardTitle>
                  Survey Features
                </CardTitle>
                <CardContent className="mt-3 flex flex-col space-y-3">
                  <input
                    type="hidden"
                    id="id"
                    name="id"
                    value={ survey_id }
                  />
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Survey name"
                      defaultValue={ survey.name }
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <p className="text-sm font-medium leading-none">Theme</p>
                    <PickerTheme defaultValue={ survey.theme } />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="redirect">Redirect to</Label>
                    <Input
                      id="redirect"
                      name="redirect"
                      type="text"
                      placeholder="https://..."
                      defaultValue={ survey.redirect || '' }
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="final_message">Final message</Label>
                    <Input
                      id="final_message"
                      name="final_message"
                      type="text"
                      placeholder="Thank you for your answer!"
                      defaultValue={ survey.final_message || '' }
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <p className="text-sm font-medium leading-none">Survey timezone</p>
                    <PickerTimezone defaultValue={ survey.Customer.timezone } />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <p className="text-sm font-medium leading-none">From / To</p>
                    <DatePickerWithRange
                      defaultValue={ {
                        from: survey.from?.toString(),
                        to: survey.to?.toISOString()
                      } }
                    />
                  </div>
                  <div className="flex flex-row space-x-1.5">
                    <div className="flex grow flex-col space-y-1.5">
                      <p className="text-sm font-medium leading-none">Start time</p>
                      <div className="flex flex-row items-center space-x-1">
                        <PickerTime
                          name="start_hour"
                          defaultValue={ getHours( survey.from || setHours( new Date(), 0 ) )
                            .toString()
                            .padStart( 2, '0' ) }
                          type="hours"
                        />
                        <span>:</span>
                        <PickerTime
                          name="start_minute"
                          defaultValue={ getMinutes( survey.from || setMinutes( new Date(), 0 ) )
                            .toString()
                            .padStart( 2, '0' ) }
                          type="minutes"
                        />
                      </div>
                    </div>
                    <div className="flex grow flex-col space-y-1.5">
                      <p className="text-sm font-medium leading-none">End time</p>
                      <div className="flex flex-row items-center space-x-1">
                        <PickerTime
                          name="end_hour"
                          defaultValue={ getHours( survey.to || setHours( new Date(), 0 ) )
                            .toString()
                            .padStart( 2, '0' ) }
                          type="hours"
                        />
                        <span>:</span>
                        <PickerTime
                          name="end_minute"
                          defaultValue={ getMinutes( survey.to || setMinutes( new Date(), 0 ) )
                            .toString()
                            .padStart( 2, '0' ) }
                          type="minutes"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <SubmitButton className="ml-auto">
                    Update
                  </SubmitButton>
                </CardFooter>
              </CardHeader>
            </Card>
          </AddSurveyFeaturesForm>
        </div>

        <Card className="flex w-full max-w-xs flex-col">
          <CardHeader>
            <CardTitle>
              More data
            </CardTitle>
          </CardHeader>
          <CardContent className="flex grow flex-col space-y-8">
            <div className="flex flex-col space-y-1.5">
              <CardDescription>
                Status
              </CardDescription>
              <Badge className="w-full justify-center uppercase">
                { survey.status }
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-1.5">
            { survey.status === SURVEY_STATUS.PENDING
              ? <MarkSurveyAsReadyForm surveyId={ survey_id } />
              : null }
          </CardFooter>
        </Card>
      </section>

      <Separator className="mx-auto my-12 w-2/3 max-w-3xl" />

      <h3 className="mx-auto mb-8 w-full max-w-7xl">Questions:</h3>
      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2 2xl:grid-cols-3">
        <NewQuestionForm
          customerId={ customer_id }
          surveyId={ survey_id }
          lastOrderValue={ survey.questions[ 0 ]?.order }
        />
        { survey.questions.map( ( question ) => (
          <SurveyQuestionForm
            key={ question.id }
            customerId={ customer_id }
            surveyId={ survey_id }
            lastOrderValue={ survey.questions[ 0 ]?.order }
            defaultValue={ question as CreateQuestion }
          />
        ) ) }
      </section>
    </main>
  );
};

export default Page;