'use client';

import { useEffect, useMemo, useState } from "react";
import { useFormState } from "react-dom";

import {
  ExclamationTriangleIcon,
  ExternalLinkIcon,
  FilePlusIcon,
  LapTimerIcon,
  PlusCircledIcon,
  ResetIcon,
  TrashIcon
} from "@radix-ui/react-icons";
import { v4 } from "uuid";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  deleteSurvey,
  editSurveyFeatures,
  markSurveyAsPublic,
  markSurveyAsReady,
  newSurvey,
  removeSurveyQuestion,
  upsertSurveyQuestion
} from "@/app/actions";
import { cn } from "@/lib/utils";
import { CreateQuestion, QUESTION_TYPE, questionTypes } from "@/definitions/question";
import { SURVEY_STATUS } from "@/definitions/survey";
import { SubmitButton } from "@/components/buttons";
import { Textarea } from "@/components/ui/textarea";

export const NewSurveyForm = ( { className, children }: {
  className?: string;
  children: React.ReactNode;
} ) => {
  const [ state, action ] = useFormState( newSurvey, undefined );

  return (
    <>
      <form
        action={ action }
        noValidate
        spellCheck={ false }
        className={ className }
      >
        { children }
      </form>

      { !!state?.error
        ? (
          <Card
            className={ cn(
              'mx-auto mt-4 w-full max-w-lg',
              'border-destructive bg-destructive/10'
            ) }
          >
            <CardContent className="pt-6">
              <CardDescription className="text-destructive">
                <ExclamationTriangleIcon className="mr-1.5 inline-flex" />
                { state.error }
              </CardDescription>
            </CardContent>
          </Card>
        )
        : null }
    </>
  );
};
export const AddSurveyFeaturesForm = ( { className, children }: {
  className?: string;
  children: React.ReactNode;
} ) => {
  const [ state, action ] = useFormState( editSurveyFeatures, undefined );

  return (
    <>
      <form
        action={ action }
        noValidate
        spellCheck={ false }
        className={ className }
      >
        { children }
      </form>

      { !!state?.error
        ? (
          <Card
            className={ cn(
              'mx-auto mt-4 w-full max-w-lg lg:max-w-none',
              'border-destructive bg-destructive/10'
            ) }
          >
            <CardContent className="pt-6">
              <CardDescription className="text-destructive">
                <ExclamationTriangleIcon className="mr-1.5 inline-flex" />
                { state.error }
              </CardDescription>
            </CardContent>
          </Card>
        )
        : null }
    </>
  );
};

export const SurveyQuestionForm = ( { defaultValue, lastOrderValue, customerId, surveyId, handleNewQuestion }: {
  defaultValue: CreateQuestion | null;
  lastOrderValue: number | undefined;
  customerId: string;
  surveyId: string;
  handleNewQuestion?: () => void;
} ) => {
  const id = useMemo( () => v4(), [] );
  const [ state, action ] = useFormState( upsertSurveyQuestion, undefined );
  const [ isDirty, setIsDirty ] = useState( false );
  const [ question, setQuestion ] = useState<CreateQuestion>(
    defaultValue || {
      id,
      type: QUESTION_TYPE.TEXT,
      register_name: id.slice( 0, 5 ),
      order: lastOrderValue === undefined
             ? 0
             : lastOrderValue + 1,
      label: 'Wh...',
      submit_label: 'Next',
      max: 100,
      min: 0,
      step: 1,
      is_unique: false,
      options: []
    }
  );

  const handleReset = () => {
    setQuestion( defaultValue || {
      id,
      type: QUESTION_TYPE.TEXT,
      register_name: id.slice( 0, 5 ),
      order: lastOrderValue === undefined
             ? 0
             : lastOrderValue + 1,
      label: 'Wh...',
      submit_label: 'Next',
      max: 100,
      min: 0,
      step: 1,
      is_unique: false,
      options: []
    } );
  };

  useEffect( () => {
    if ( JSON.stringify( defaultValue ) !== JSON.stringify( question ) ) {
      setIsDirty( true );
    } else {
      setIsDirty( false );
    }
  }, [ question, defaultValue ] );

  useEffect( () => {
    if ( state?.error === null ) {
      setIsDirty( false );
      handleNewQuestion && handleNewQuestion();
    }
  }, [ state, handleNewQuestion ] );

  return (
    <article className="relative flex w-full flex-col self-stretch">
      { !handleNewQuestion
        ? (
          <RemoveQuestionForm
            customerId={ customerId }
            surveyId={ surveyId }
            questionId={ question.id }
          /> )
        : null }

      <form
        action={ action }
        noValidate
        spellCheck={ false }
        className="grow"
      >
        <Card
          className={ cn(
            "flex h-full flex-col"
          ) }
        >
          <CardHeader>
            <CardTitle className="font-mono">
              { question.order + 1 }. { question.register_name }
            </CardTitle>
          </CardHeader>
          <CardContent
            className={ cn(
              "mt-3 grid grow grid-cols-1 content-start gap-4",
              "sm:grid-cols-2"
            ) }
          >
            <input
              type="hidden"
              id={ `${ id }-customer_id` }
              name="customer_id"
              value={ customerId }
            />
            <input
              type="hidden"
              id={ `${ id }-survey_id` }
              name="survey_id"
              value={ surveyId }
            />
            <input
              type="hidden"
              id={ `${ id }-id` }
              name="id"
              value={ question.id }
            />
            <input
              type="hidden"
              id={ `${ id }-order` }
              name="order"
              value={ question.order }
            />
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <input
                type="hidden"
                id={ `${ id }-type` }
                name="type"
                value={ question.type }
              />
              <p className="text-sm font-medium leading-none">Type</p>
              <Select
                onValueChange={ value => setQuestion( prev => ( { ...prev, type: value as QUESTION_TYPE } ) ) }
                value={ question.type }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Question type" />
                </SelectTrigger>
                <SelectContent>
                  { questionTypes
                    .map( item => (
                      <SelectItem
                        key={ item.value }
                        value={ item.value }
                      >
                        { item.label }
                      </SelectItem>
                    ) ) }
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={ `${ id }-register_name` }>Register name</Label>
              <Input
                id={ `${ id }-register_name` }
                name="register_name"
                type="text"
                placeholder={ id }
                value={ question.register_name }
                onChange={ ( event ) => setQuestion( prev => ( {
                  ...prev,
                  [ event.target.name ]: event.target.value
                } ) ) }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={ `${ id }-submit_label` }>Submit button</Label>
              <Input
                id={ `${ id }-submit_label` }
                name="submit_label"
                type="text"
                placeholder="Next"
                value={ question.submit_label }
                onChange={ ( event ) => setQuestion( prev => ( {
                  ...prev,
                  [ event.target.name ]: event.target.value
                } ) ) }
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label htmlFor={ `${ id }-label` }>Question text</Label>
              <Textarea
                id={ `${ id }-label` }
                name="label"
                placeholder="Wh..."
                value={ question.label }
                rows={ 4 }
                onChange={ ( event ) => setQuestion( prev => ( {
                  ...prev,
                  [ event.target.name ]: event.target.value
                } ) ) }
              />
            </div>
            { question.type === QUESTION_TYPE.EMAIL || question.type === QUESTION_TYPE.PHONE
              ? (
                <div className="flex h-9 items-center gap-1.5 rounded border px-3 py-1 md:col-span-2">
                  <Switch
                    checked={ question.is_unique }
                    id={ `${ id }-is_unique` }
                    name="is_unique"
                    onCheckedChange={ ( checked ) => setQuestion( prev => ( {
                      ...prev,
                      is_unique: checked
                    } ) ) }
                  />
                  <Label id={ `${ id }-is_unique` }>Must be unique</Label>
                </div>
              )
              : null }
            { question.type ===
              QUESTION_TYPE.MULTIPLE_SELECTION ||
              question.type ===
              QUESTION_TYPE.NUMBER ||
              question.type ===
              QUESTION_TYPE.RANGE ||
              question.type ===
              QUESTION_TYPE.SLIDER
              ? (
                <div className="grid grid-cols-3 gap-1.5 md:col-span-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={ `${ id }-min` }>Min</Label>
                    <Input
                      id={ `${ id }-min` }
                      name="min"
                      type="number"
                      inputMode="numeric"
                      value={ question.min ?? undefined }
                      onChange={ ( event ) => setQuestion( prev => ( {
                        ...prev,
                        [ event.target.name ]: event.target.value
                      } ) ) }
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={ `${ id }-max` }>Max</Label>
                    <Input
                      id={ `${ id }-max` }
                      name="max"
                      type="number"
                      inputMode="numeric"
                      value={ question.max ?? undefined }
                      onChange={ ( event ) => setQuestion( prev => ( {
                        ...prev,
                        [ event.target.name ]: event.target.value
                      } ) ) }
                    />
                  </div>
                  { question.type !== QUESTION_TYPE.MULTIPLE_SELECTION
                    ? (
                      <div className="flex flex-col gap-1.5">
                        <Label htmlFor={ `${ id }-step` }>Step</Label>
                        <Input
                          id={ `${ id }-step` }
                          name="step"
                          type="number"
                          inputMode="numeric"
                          value={ question.step ?? undefined }
                          onChange={ ( event ) => setQuestion( prev => ( {
                            ...prev,
                            [ event.target.name ]: event.target.value
                          } ) ) }
                        />
                      </div>
                    )
                    : null }
                </div>
              )
              : null }
            { question.type ===
              QUESTION_TYPE.BUTTONS_GROUP ||
              question.type ===
              QUESTION_TYPE.DROPDOWN_LIST ||
              question.type ===
              QUESTION_TYPE.MULTIPLE_SELECTION ||
              question.type ===
              QUESTION_TYPE.SINGLE_SELECTION
              ? (
                <div className="grid grid-cols-2 gap-1.5 md:col-span-2">
                  <p className="col-span-2 text-sm font-medium leading-none">Options</p>
                  <input
                    type="hidden"
                    name="options"
                    value={ question.options.map( item => item.value )
                                    .join( 'ngf|-|ngf' ) }
                  />
                  { question.options.map( ( item, index ) => (
                    <div
                      key={ item.id }
                      className="flex gap-1"
                    >
                      <Input
                        id={ `${ id }-option-${ item.id }` }
                        className="grow"
                        type="text"
                        value={ item.value }
                        onChange={ ( event ) => {
                          const updatedOptions = [ ...question.options ];
                          updatedOptions[ index ].value = event.target.value;
                          setQuestion( prev => ( { ...prev, options: updatedOptions } ) );
                        } }
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        onClick={ () => setQuestion( prev => (
                          {
                            ...prev,
                            options: prev.options.filter( ( _, idx ) => index !== idx )
                          } ) ) }
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  ) ) }
                  <Button
                    type="button"
                    className="col-span-2"
                    variant="secondary"
                    onClick={ () => setQuestion( prev => ( {
                      ...prev, options: [
                        ...prev.options,
                        {
                          id: id + prev.options.length + 1,
                          questionId: id,
                          value: ''
                        }
                      ]
                    } ) ) }
                  >
                    Add option
                  </Button>
                </div>
              )
              : null }
          </CardContent>
          <CardFooter className="mt-3 flex flex-col space-y-1.5">
            {
              !!defaultValue
              ? (
                <a
                  target="_blank"
                  href={ `/preview/${ surveyId }/${ question.id }` }
                  className={ buttonVariants( { variant: 'secondary', className: 'w-full' } ) }
                >
                  Preview this question
                  <ExternalLinkIcon className="ml-1.5 size-4" />
                </a>
              )
              : null }
            <div className="flex w-full space-x-1.5">
              <Button
                type="button"
                variant="outline"
                className="grow"
                onClick={ handleReset }
              >
                Reset
                <ResetIcon className="ml-1.5 size-4" />
              </Button>
              <SubmitButton className="grow">
                Update Question
              </SubmitButton>
            </div>
          </CardFooter>
        </Card>
      </form>
      { isDirty
        ? (
          <Card
            className={ cn(
              'bg-muted mx-auto mt-4 w-full max-w-xl'
            ) }
          >
            <CardContent className="pt-6">
              <CardDescription>
                <ExclamationTriangleIcon className="mr-1.5 inline-flex" />
                There are unsaved changes
              </CardDescription>
            </CardContent>
          </Card>
        )
        : null }
      { !!state?.error
        ? (
          <Card
            className={ cn(
              'mx-auto mt-4 w-full max-w-xl',
              'border-destructive bg-destructive/10'
            ) }
          >
            <CardContent className="pt-6">
              <CardDescription className="text-destructive">
                <ExclamationTriangleIcon className="mr-1.5 inline-flex" />
                { state.error }
              </CardDescription>
            </CardContent>
          </Card>
        )
        : null }
    </article>
  );
};

export const NewQuestionForm = ( { lastOrderValue, customerId, surveyId }: {
  lastOrderValue: number | undefined;
  customerId: string;
  surveyId: string;
} ) => {
  const [ newQuestion, setNewQuestion ] = useState( false );

  return (
    <>
      <Button
        onClick={ () => setNewQuestion( prev => !prev ) }
        type="button"
        variant="outline"
        className="w-full lg:col-span-2 2xl:col-span-3"
      >
        { newQuestion
          ? 'Delete the unsaved question'
          : 'Add question' }
        { newQuestion
          ? <TrashIcon className="ml-1.5 size-4" />
          : <PlusCircledIcon className="ml-1.5 size-4" />
        }
      </Button>
      { newQuestion
        ? (
          <SurveyQuestionForm
            customerId={ customerId }
            surveyId={ surveyId }
            lastOrderValue={ lastOrderValue }
            defaultValue={ null }
            handleNewQuestion={ () => setNewQuestion( false ) }
          />
        )
        : null }
    </>
  );
};

export const RemoveQuestionForm = ( { customerId, surveyId, questionId }: {
  customerId: string;
  surveyId: string;
  questionId: string;
} ) => {
  const [ _state, action ] = useFormState( removeSurveyQuestion, undefined );

  return (
    <form
      action={ action }
      noValidate
    >
      <input
        type="hidden"
        name="customer_id"
        value={ customerId }
      />
      <input
        type="hidden"
        name="survey_id"
        value={ surveyId }
      />
      <input
        type="hidden"
        name="question_id"
        value={ questionId }
      />
      <SubmitButton
        size="icon"
        variant="outline"
        icon={ <TrashIcon /> }
        className="absolute right-2.5 top-2.5"
      />
    </form>
  );
};

export const MarkSurveyAsReadyForm = async ( { surveyId }: {
  surveyId: string;
} ) => {
  const [ state, action ] = useFormState( markSurveyAsReady, undefined );

  return (
    <>
      <form
        action={ action }
        noValidate
        className="w-full"
      >
        <input
          type="hidden"
          name="survey_id"
          value={ surveyId }
        />
        <SubmitButton
          className="w-full"
          variant="outline"
          icon={ <LapTimerIcon /> }
        >
          Mark as ready
        </SubmitButton>
      </form>
      { !!state?.error
        ? (
          <Card
            className={ cn(
              'mt-3 w-full rounded-sm',
              'border-destructive bg-destructive/10'
            ) }
          >
            <CardContent className="p-2">
              <CardDescription className="text-destructive">
                <ExclamationTriangleIcon className="mr-1.5 inline-flex" />
                { state.error }
              </CardDescription>
            </CardContent>
          </Card>
        )
        : null }
    </>
  );
};

export const MarkSurveyAsPublicForm = async ( { surveyId, status }: {
  surveyId: string;
  status: SURVEY_STATUS;
} ) => {
  const [ state, action ] = useFormState( markSurveyAsPublic, undefined );

  return (
    <>
      <form
        action={ action }
        noValidate
        className="w-full"
      >
        <input
          type="hidden"
          name="survey_id"
          value={ surveyId }
        />
        <input
          type="hidden"
          name="status"
          value={ status }
        />
        <SubmitButton
          className="w-full"
          variant="default"
          icon={ <FilePlusIcon /> }
        >
          Public Now
        </SubmitButton>
      </form>
      { !!state?.error
        ? (
          <Card
            className={ cn(
              'mt-3 w-full rounded-sm',
              'border-destructive bg-destructive/10'
            ) }
          >
            <CardContent className="p-2">
              <CardDescription className="text-destructive">
                <ExclamationTriangleIcon className="mr-1.5 inline-flex" />
                { state.error }
              </CardDescription>
            </CardContent>
          </Card>
        )
        : null }
    </>
  );
};

export const DeleteSurveyForm = async ( { surveyId, name }: {
  surveyId: string;
  name: string;
} ) => {
  const [ state, action ] = useFormState( deleteSurvey, undefined );

  return (
    <>
      <form
        action={ action }
        noValidate
        className="w-full"
      >
        <div className="mt-4 flex flex-col space-y-3">
          <input
            type="hidden"
            name="survey_id"
            value={ surveyId }
          />
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Confirm deletion by typing <i>{ '"' }{ name }{ '"' }</i></Label>
            <Input
              type="text"
              id="name"
              name="name"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="delete">Confirm deletion by typing <i>{ '"' }delete{ '"' }</i></Label>
            <Input
              type="text"
              id="delete"
              name="delete"
            />
          </div>
          <SubmitButton
            className="w-full"
            variant="default"
            icon={ <TrashIcon /> }
          >
            Delete
          </SubmitButton>
        </div>
      </form>
      { !!state?.error
        ? (
          <Card
            className={ cn(
              'mt-3 w-full rounded-sm',
              'border-destructive bg-destructive/10'
            ) }
          >
            <CardContent className="p-2">
              <CardDescription className="text-destructive">
                <ExclamationTriangleIcon className="mr-1.5 inline-flex" />
                { state.error }
              </CardDescription>
            </CardContent>
          </Card>
        )
        : null }
    </>
  );
};