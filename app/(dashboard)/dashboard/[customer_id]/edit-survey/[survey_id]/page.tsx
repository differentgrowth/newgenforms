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
  searchParams: {
    theme?: string;
    timezone?: string;
    from?: string;
    to?: string;
    start_hour?: string;
    start_minute?: string;
    end_hour?: string;
    end_minute?: string;
  }
}
const Page = async ( {
                       params: { survey_id, customer_id },
                       searchParams: { theme, timezone, from, to, start_hour, start_minute, end_hour, end_minute }
                     }: PageProps ) => {
  const survey = await getSurvey( { surveyId: survey_id, customerId: customer_id } );

  if ( !survey ) {
    notFound();
  }

  if ( survey.status !== SURVEY_STATUS.EMPTY && survey.status !== SURVEY_STATUS.PENDING ) {
    redirect( `/dashboard/${ customer_id }` );
  }

  return (
    <main>
      <section className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <AddSurveyFeaturesForm className="w-full max-w-xl lg:max-w-none mx-auto">
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
                    <input
                      type="hidden"
                      id="timezone"
                      name="timezone"
                      value={ timezone || survey.timezone || survey.Customer.timezone }
                    />
                    <p className="text-sm font-medium leading-none">Survey timezone</p>
                    <PickerTimezone defaultValue={ survey.Customer.timezone } />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <input
                      type="hidden"
                      id="from"
                      name="from"
                      value={ from || survey.from?.toISOString() || '' }
                    />
                    <input
                      type="hidden"
                      id="to"
                      name="to"
                      value={ to || survey.to?.toISOString() || '' }
                    />
                    <p className="text-sm font-medium leading-none">From / To</p>
                    <DatePickerWithRange
                      defaultValue={ {
                        from: survey.from?.toString(),
                        to: survey.to?.toISOString()
                      } }
                    />
                  </div>
                  <div className="flex flex-row space-x-1.5">
                    <div className="grow flex flex-col space-y-1.5">
                      <input
                        type="hidden"
                        id="start_hour"
                        name="start_hour"
                        value={ start_hour || getHours( survey.from || setHours( new Date(), 0 ) ) }
                      />
                      <input
                        type="hidden"
                        id="start_minute"
                        name="start_minute"
                        value={ start_minute || getMinutes( survey.from || setMinutes( new Date(), 0 ) ) }
                      />
                      <p className="text-sm font-medium leading-none">Start time</p>
                      <div className="flex flex-row items-center space-x-1">
                        <PickerTime
                          name="start_hour"
                          defaultValue={ start_hour ||
                                         getHours( survey.from || setHours( new Date(), 0 ) )
                                           .toString()
                                           .padStart( 2, '0' ) }
                          type="hours"
                        />
                        <span>:</span>
                        <PickerTime
                          name="start_minute"
                          defaultValue={ start_minute ||
                                         getMinutes( survey.from || setMinutes( new Date(), 0 ) )
                                           .toString()
                                           .padStart( 2, '0' ) }
                          type="minutes"
                        />
                      </div>
                    </div>
                    <div className="grow flex flex-col space-y-1.5">
                      <input
                        type="hidden"
                        id="end_hour"
                        name="end_hour"
                        value={ end_hour || getHours( survey.to || setHours( new Date(), 0 ) ) }
                      />
                      <input
                        type="hidden"
                        id="end_minute"
                        name="end_minute"
                        value={ end_minute || getHours( survey.to || setMinutes( new Date(), 0 ) ) }
                      />
                      <p className="text-sm font-medium leading-none">End time</p>
                      <div className="flex flex-row items-center space-x-1">
                        <PickerTime
                          name="end_hour"
                          defaultValue={ end_hour ||
                                         getHours( survey.to || setHours( new Date(), 0 ) )
                                           .toString()
                                           .padStart( 2, '0' ) }
                          type="hours"
                        />
                        <span>:</span>
                        <PickerTime
                          name="end_minute"
                          defaultValue={ end_minute ||
                                         getMinutes( survey.to || setMinutes( new Date(), 0 ) )
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

        <Card className="w-full max-w-xs flex flex-col">
          <CardHeader>
            <CardTitle>
              More data
            </CardTitle>
          </CardHeader>
          <CardContent className="grow flex flex-col space-y-8">
            <div className="flex flex-col space-y-1.5">
              <CardDescription>
                Status
              </CardDescription>
              <Badge className="uppercase justify-center w-full">
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

      <Separator className="my-12 mx-auto w-2/3 max-w-3xl" />

      <h3 className="w-full max-w-7xl mx-auto mb-8">Questions:</h3>
      <section className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
        <NewQuestionForm
          customerId={ customer_id }
          surveyId={ survey_id }
          lastOrderValue={ survey.questions.at( -1 )?.order }
        />
        { survey.questions.map( question => (
          <SurveyQuestionForm
            key={ question.id }
            customerId={ customer_id }
            surveyId={ survey_id }
            lastOrderValue={ survey.questions.at( -1 )?.order }
            defaultValue={ question as CreateQuestion }
          />
        ) ) }
      </section>
    </main>
  );
};

export default Page;