import { notFound, redirect } from "next/navigation";

import { getQuestion } from "@/lib/db";
import { AnswerForm } from "@/components/forms-answer";
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
    survey_id: string;
    question_id: string;
  };
  searchParams: {
    c?: string;
  };
}

const Page = async ( { params: { survey_id, question_id }, searchParams: { c } }: PageProps ) => {
  const question = await getQuestion( question_id );
  if ( !question ) {
    notFound();
  }

  if ( !c ) {
    redirect( `/${ survey_id }` );
  }

  return (
    <section className="container mx-auto mt-12 px-2">
      <AnswerForm>
        <Card>
          <CardHeader>
            <CardTitle>
              { question.Survey.name }
            </CardTitle>
          </CardHeader>

          <CardContent className="mt-3 flex flex-col space-y-6">
            <input
              type="hidden"
              name="type"
              value={ question.type }
            />
            <input
              type="hidden"
              name="surveyId"
              value={ survey_id }
            />
            <input
              type="hidden"
              name="questionId"
              value={ question_id }
            />
            <input
              type="hidden"
              name="min"
              value={ question.min || '' }
            />
            <input
              type="hidden"
              name="max"
              value={ question.max || '' }
            />
            <input
              type="hidden"
              name="client"
              value={ c }
            />
            <input
              type="hidden"
              name="next_question"
              value={ question.next_question ?? undefined }
            />
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
      </AnswerForm>
    </section>
  );
};

export default Page;