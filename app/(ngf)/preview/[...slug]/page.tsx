import { notFound } from "next/navigation";

import { getQuestion } from "@/lib/db";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ButtonsGroupQuestion,
  CheckboxQuestion,
  DatePickerQuestion,
  DropdownListQuestion,
  EmailQuestion,
  FeedbackQuestion,
  LongTextQuestion,
  MultipleSelectionQuestion,
  NumberQuestion,
  PhoneQuestion,
  RangeQuestion,
  RatingQuestion,
  SingleSelectionQuestion,
  SliderQuestion,
  TextQuestion,
  TimePickerQuestion
} from "@/components/ngf";
import { QUESTION_TYPE } from "@/definitions/question";
import { SubmitButton } from "@/components/buttons";

type PageProps = {
  params: {
    slug: string[];
  },
  searchParams: {}
}

const Page = async ( { params: { slug } }: PageProps ) => {
  const question = await getQuestion( slug[ 1 ] );

  if ( !question ) {
    notFound();
  }

  return (
    <section className="container mx-auto mt-12 px-2">
      <form>
        <Card>
          <CardHeader>
            <CardTitle>
              { question.Survey.name }
            </CardTitle>
          </CardHeader>

          <CardContent className="mt-3 flex flex-col space-y-3">
            {
              question.type === QUESTION_TYPE.BUTTONS_GROUP
              ? <ButtonsGroupQuestion
                label={ question.label }
                options={ question.options }
              />
              : null
            }
            {
              question.type === QUESTION_TYPE.DROPDOWN_LIST
              ? <DropdownListQuestion
                label={ question.label }
                options={ question.options }
              />
              : null
            }
            {
              question.type === QUESTION_TYPE.CHECKBOX
              ? <CheckboxQuestion label={ question.label } />
              : null
            }
            {
              question.type === QUESTION_TYPE.DATE_PICKER
              ? <DatePickerQuestion label={ question.label } />
              : null
            }
            {
              question.type === QUESTION_TYPE.EMAIL
              ? <EmailQuestion label={ question.label } />
              : null
            }
            {
              question.type === QUESTION_TYPE.FEEDBACK
              ? <FeedbackQuestion label={ question.label } />
              : null
            }
            {
              question.type === QUESTION_TYPE.LONG_TEXT
              ? <LongTextQuestion label={ question.label } />
              : null
            }
            {
              question.type === QUESTION_TYPE.MULTIPLE_SELECTION
              ? <MultipleSelectionQuestion
                label={ question.label }
                options={ question.options }
              />
              : null
            }
            {
              question.type === QUESTION_TYPE.NUMBER
              ? <NumberQuestion
                label={ question.label }
                min={ question.min }
                max={ question.max }
                step={ question.step }
              />
              : null
            }
            {
              question.type === QUESTION_TYPE.PHONE
              ? <PhoneQuestion label={ question.label } />
              : null
            }
            {
              question.type === QUESTION_TYPE.RANGE
              ? <RangeQuestion
                label={ question.label }
                min={ question.min }
                max={ question.max }
                step={ question.step }
              />
              : null
            }
            {
              question.type === QUESTION_TYPE.RATING
              ? <RatingQuestion label={ question.label } />
              : null
            }
            {
              question.type === QUESTION_TYPE.SINGLE_SELECTION
              ? <SingleSelectionQuestion
                label={ question.label }
                options={ question.options }
              />
              : null
            }
            {
              question.type === QUESTION_TYPE.SLIDER
              ? <SliderQuestion
                label={ question.label }
                min={ question.min }
                max={ question.max }
                step={ question.step }
              />
              : null
            }
            {
              question.type === QUESTION_TYPE.TEXT
              ? <TextQuestion label={ question.label } />
              : null
            }
            {
              question.type === QUESTION_TYPE.TIME_PICKER
              ? <TimePickerQuestion label={ question.label } />
              : null
            }
          </CardContent>

          <CardFooter className="mt-6">
            <SubmitButton className="ml-auto">
              { question.submit_label }
            </SubmitButton>
          </CardFooter>
        </Card>
      </form>
    </section>
  );
};

export default Page;