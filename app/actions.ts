'use server';

import { redirect, RedirectType } from "next/navigation";
import { revalidatePath } from "next/cache";

import { z } from 'zod';
import { compare } from "bcrypt";
import { compareDesc, setHours, setMinutes } from 'date-fns';

import { signIn, signOut } from "@/auth";
import { DefaultTemplateState, HydratedTemplateState } from "@/definitions/action-states";
import { LANGUAGES } from "@/definitions/customer";
import {
  addSurveyFeatures,
  createSurvey,
  getCustomerPassword,
  getSurvey,
  insertAnswer,
  markAsPublic,
  markAsReady,
  removeAnswer,
  removeQuestion,
  removeSurvey,
  updateCustomer,
  updateCustomerPassword,
  updateQuestionOrders,
  upsertQuestion
} from "@/lib/db";
import { SURVEY_STATUS, SURVEY_THEME } from "@/definitions/survey";
import { CreateQuestion, QUESTION_TYPE } from "@/definitions/question";

const signupSchema = z.object( {
                                 email: z.string()
                                         .email(),
                                 password: z.string()
                                            .min( 8 ),
                                 repeat_password: z.string(),
                                 terms: z.string()
                                         .refine( data => data === 'on', {
                                           path: [ 'terms' ]
                                         } )
                               } );

export const signup = async ( _prevState: DefaultTemplateState, formData: FormData ) => {
  const parsed = signupSchema.safeParse( Object.fromEntries( formData.entries() ) as z.infer<typeof signupSchema> );

  if ( !parsed.success ) {
    return {
      error: parsed.error.errors.some( item => item.path.includes( 'terms' ) )
             ? 'You must accept the terms of use'
             : parsed.error.errors.some( item => item.code === 'too_small' && item.path.includes( 'password' ) )
               ? 'Password too small!'
               : 'Invalid data!'
    };
  }

  if ( parsed.data.password !== parsed.data.repeat_password ) {
    return {
      error: 'Passwords don\'t match'
    };
  }

  try {
    await signIn( 'credentials', { redirect: false, email: parsed.data.email, password: parsed.data.password } );
  } catch ( error: any ) {
    if ( error.type === 'CredentialsSignin' ) {
      return {
        error: 'Invalid Credentials'
      };
    }
  }

  redirect( `/login`, RedirectType.replace );
};

export const authenticate = async ( _prevState: DefaultTemplateState, formData: FormData ) => {
  try {
    const { email, password } = Object.fromEntries( formData.entries() );
    await signIn( 'credentials', { redirect: false, password, email } );
  } catch ( error: any ) {
    if ( error.type === 'CredentialsSignin' ) {
      return {
        error: 'Invalid Credentials!'
      };
    }
  }

  redirect( `/login`, RedirectType.replace );
};

export const logout = async () => {
  await signOut( { redirect: true, redirectTo: '/' } );
};

const updateAccountSchema = z.object(
  {
    id: z.string()
         .uuid(),
    email: z.string()
            .email(),
    language: z.nativeEnum( LANGUAGES ),
    commercial_communications: z.string()
                                .transform( data => data === 'on' )
  }
);

export const updateAccount = async ( _prevState: HydratedTemplateState, formData: FormData ) => {
  const parsed = updateAccountSchema.safeParse( Object.fromEntries( formData.entries() ) as unknown as z.infer<typeof updateAccountSchema> );
  if ( !parsed.success ) {
    return {
      error: true,
      success: false,
      message: 'Invalid data!'
    };
  }

  try {
    await updateCustomer( {
                            id: parsed.data.id,
                            email: parsed.data.email,
                            language: parsed.data.language,
                            commercial_communications: parsed.data.commercial_communications
                          } );

    return {
      error: false,
      success: true,
      message: 'Updated successfully!'
    };
  } catch ( e ) {
    return {
      error: true,
      success: false,
      message: 'Something went wrong!'
    };
  }
};

const updatePasswordSchema = z.object(
  {
    id: z.string()
         .uuid(),
    password: z.string(),
    new_password: z.string()
                   .min( 8 ),
    repeat_new_password: z.string()
  }
);

export const updatePassword = async ( _prevState: HydratedTemplateState, formData: FormData ) => {
  const parsed = updatePasswordSchema.safeParse( Object.fromEntries( formData.entries() ) as z.infer<typeof updatePasswordSchema> );

  if ( !parsed.success ) {
    return {
      error: true,
      success: false,
      message: parsed.error.errors.some( item => item.code === 'too_small' && item.path.includes( 'password' ) )
               ? 'Password too small!'
               : 'Invalid data!'
    };
  }

  if ( parsed.data.new_password !== parsed.data.repeat_new_password ) {
    return {
      error: true,
      success: false,
      message: 'Passwords don\'t match'
    };
  }

  const customer = await getCustomerPassword( parsed.data.id );
  if ( !customer ) {
    return {
      error: true,
      success: false,
      message: 'Invalid credentials!'
    };
  }
  const passwordsMatch = await compare( parsed.data.password, customer.password );
  if ( !passwordsMatch ) {
    return {
      error: true,
      success: false,
      message: 'Invalid password!'
    };
  }

  try {
    await updateCustomerPassword( { id: parsed.data.id, new_password: parsed.data.new_password } );

    return {
      error: false,
      success: true,
      message: 'Updated successfully!'
    };
  } catch ( e ) {
    return {
      error: true,
      success: false,
      message: 'Something went wrong!'
    };
  }
};

const createSurveySchema = z.object(
  {
    id: z.string()
         .uuid(),
    name: z.string()
  }
);

export const newSurvey = async ( _prevState: DefaultTemplateState, formData: FormData ) => {
  const parsed = createSurveySchema.safeParse( Object.fromEntries( formData.entries() ) as z.infer<typeof createSurveySchema> );

  if ( !parsed.success ) {
    return {
      error: 'Invalid data!'
    };
  }

  let surveyId = undefined;
  try {
    const { id } = await createSurvey( {
                                         customerId: parsed.data.id,
                                         name: parsed.data.name
                                       } );
    surveyId = id;
  } catch ( error: any ) {
    return {
      error: 'Something went wrong!'
    };
  }

  redirect( `/dashboard/${ parsed.data.id }/edit-survey/${ surveyId }`, RedirectType.replace );
};

const surveyFeaturesSchema = z
  .object( {
             id: z.string()
                  .uuid(),
             name: z.string(),
             theme: z.nativeEnum( SURVEY_THEME ),
             from: z.string()
                    .transform( data => new Date( data ) ),
             to: z.string()
                  .transform( data => new Date( data ) ),
             start_hour: z.string(),
             start_minute: z.string(),
             end_hour: z.string(),
             end_minute: z.string(),
             timezone: z.string(),
             redirect: z.string()
                        .url()
                        .nullable()
                        .transform( data => data || null ),
             final_message: z.string()
           } )
  .refine( data => !!compareDesc( data.from, data.to ), {
    message: 'Finish date greater than start date',
    path: [ 'to' ]
  } );
export const editSurveyFeatures = async ( _prevState: DefaultTemplateState, formData: FormData ) => {
  const parsed = surveyFeaturesSchema.safeParse( Object.fromEntries( formData.entries() ) as unknown as z.infer<typeof surveyFeaturesSchema> );

  if ( !parsed.success ) {
    return {
      error: `There is an error in the ${ parsed.error.errors.at( 0 )?.path } field`
    };
  }

  const from = setMinutes( setHours( parsed.data.from, +parsed.data.start_hour ), +parsed.data.start_minute );
  const to = setMinutes( setHours( parsed.data.to, +parsed.data.end_hour ), +parsed.data.end_minute );

  try {
    await addSurveyFeatures( parsed.data.id, {
      status: SURVEY_STATUS.PENDING,
      name: parsed.data.name,
      theme: parsed.data.theme,
      from,
      to,
      timezone: parsed.data.timezone,
      redirect: parsed.data.redirect,
      final_message: parsed.data.final_message
    } );
  } catch ( error: any ) {
    return {
      error: 'Something went wrong!'
    };
  }

  revalidatePath( `/dashboard/${ parsed.data.id }/edit-survey/${ parsed.data.id }` );
};

const questionSchema = z
  .object( {
             survey_id: z.string(),
             customer_id: z.string(),
             id: z.string()
                  .uuid(),
             type: z.nativeEnum( QUESTION_TYPE ),
             register_name: z.string()
                             .refine( data => !!data ),
             order: z.string()
                     .transform( data => +data )
                     .refine( data => data >= 0, { path: [ 'order' ] } ),
             label: z.string()
                     .refine( data => !!data ),
             submit_label: z.string(),
             is_unique: z.boolean()
                         .default( false ),
             max: z.string()
                   .nullable()
                   .transform( data => !!data
                                       ? isNaN( +data )
                                         ? null
                                         : +data
                                       : null )
                   .default( null ),
             min: z.string()
                   .nullable()
                   .transform( data => !!data
                                       ? isNaN( +data )
                                         ? null
                                         : +data
                                       : null )
                   .default( null ),
             step: z.string()
                    .nullable()
                    .transform( data => !!data
                                        ? +data
                                        : null )
                    .default( null ),
             options: z.string()
                       .default( '' )
                       .transform( data => data.split( 'ngf|-|ngf' ) )
           } )
  .transform( data => (
    {
      ...data,
      is_unique: data.type !== QUESTION_TYPE.EMAIL && data.type !== QUESTION_TYPE.PHONE
                 ? false
                 : data.is_unique,
      max: data.type ===
           QUESTION_TYPE.MULTIPLE_SELECTION ||
           data.type ===
           QUESTION_TYPE.NUMBER ||
           data.type ===
           QUESTION_TYPE.RANGE ||
           data.type ===
           QUESTION_TYPE.SLIDER
           ? data.type ===
             QUESTION_TYPE.RANGE ||
             data.type ===
             QUESTION_TYPE.SLIDER
             ? Math.min( 100, data.max || 100 )
             : data.max
           : null,
      min: data.type ===
           QUESTION_TYPE.MULTIPLE_SELECTION ||
           data.type ===
           QUESTION_TYPE.NUMBER ||
           data.type ===
           QUESTION_TYPE.RANGE ||
           data.type ===
           QUESTION_TYPE.SLIDER
           ? data.type ===
             QUESTION_TYPE.RANGE ||
             data.type ===
             QUESTION_TYPE.SLIDER
             ? Math.max( 0, data.min || 0 )
             : data.min
           : null,
      step: data.type ===
            QUESTION_TYPE.MULTIPLE_SELECTION ||
            data.type ===
            QUESTION_TYPE.NUMBER ||
            data.type ===
            QUESTION_TYPE.RANGE ||
            data.type ===
            QUESTION_TYPE.SLIDER
            ? ( data.step !== null && +data.step > 0 )
              ? data.step
              : 1
            : null,
      options: data.type ===
               QUESTION_TYPE.BUTTONS_GROUP ||
               data.type ===
               QUESTION_TYPE.DROPDOWN_LIST ||
               data.type ===
               QUESTION_TYPE.MULTIPLE_SELECTION ||
               data.type ===
               QUESTION_TYPE.SINGLE_SELECTION
               ? data.options
                     .filter( item => !!item )
                     .map( item => ( {
                       value: item
                     } ) )
               : []
    }
  ) )
  .refine( data => ( data.max || 100 ) > ( data.min || 0 ), {
    path: [ 'max' ]
  } )
  .refine( data => {
    switch ( data.type ) {
      case QUESTION_TYPE.BUTTONS_GROUP:
      case QUESTION_TYPE.DROPDOWN_LIST:
      case QUESTION_TYPE.MULTIPLE_SELECTION:
      case QUESTION_TYPE.SINGLE_SELECTION:
        return data.options.length > 0;
      default:
        return true;
    }
  } );
export const upsertSurveyQuestion = async ( _prevState: DefaultTemplateState, formData: FormData ) => {
  const parsed = questionSchema.safeParse( Object.fromEntries( formData.entries() ) as unknown as z.infer<typeof questionSchema> );

  if ( !parsed.success ) {
    return {
      error: `There is an error in the ${ parsed.error.errors.at( 0 )?.path } field`
    };
  }

  try {
    await upsertQuestion( {
                            data: parsed.data as unknown as CreateQuestion,
                            customerId: parsed.data.customer_id,
                            surveyId: parsed.data.survey_id
                          } );
    await updateQuestionOrders( parsed.data.survey_id );
  } catch ( e ) {
    return {
      error: 'Something went wrong'
    };
  }

  revalidatePath( `/dashboard/${ parsed.data.customer_id }/edit-survey/${ parsed.data.survey_id }` );
  // to update state and remove newQuestionForm
  return {
    error: null
  };
};

const removeQuestionSchema = z.object(
  {
    survey_id: z.string()
                .uuid(),
    customer_id: z.string()
                  .uuid(),
    question_id: z.string()
                  .uuid()
  }
);
export const removeSurveyQuestion = async ( _prevState: DefaultTemplateState, formData: FormData ) => {
  const parsed = removeQuestionSchema.safeParse( Object.fromEntries( formData.entries() ) as z.infer<typeof removeQuestionSchema> );

  if ( !parsed.success ) {
    return {
      error: `Invalid data!`
    };
  }

  try {
    await removeQuestion( parsed.data.question_id );
    await updateQuestionOrders( parsed.data.survey_id );
  } catch ( e ) {
    return {
      error: 'Something went wrong'
    };
  }

  revalidatePath( `/dashboard/${ parsed.data.customer_id }/edit-survey/${ parsed.data.survey_id }` );
  return {
    error: null
  };
};

const markAsReadySchema = z.object(
  {
    survey_id: z.string()
                .uuid()
  }
);

const allowReadyStatusSchema = z
  .object(
    {
      status: z.enum( [ SURVEY_STATUS.PENDING ] ),
      from: z.date(),
      to: z.date(),
      questions: z
        .array(
          z.object(
            {
              id: z.string()
                   .uuid(),
              type: z.nativeEnum( QUESTION_TYPE ),
              label: z.string(),
              submit_label: z.string()
            }
          )
        )
        .min( 1 )
    }
  )
  .refine( data => !!compareDesc( data.from, data.to ), {
    message: 'Finish date greater than start date',
    path: [ 'to' ]
  } );

export const markSurveyAsReady = async ( _prevState: DefaultTemplateState, formData: FormData ) => {
  const parsed = markAsReadySchema.safeParse( Object.fromEntries( formData.entries() ) as z.infer<typeof markAsReadySchema> );

  if ( !parsed.success ) {
    return {
      error: `Invalid data!`
    };
  }

  const survey = await getSurvey( { surveyId: parsed.data.survey_id } );
  const surveyParsed = allowReadyStatusSchema.safeParse( survey as unknown as z.infer<typeof allowReadyStatusSchema> );

  if ( !surveyParsed.success || !survey ) {
    return {
      error: `Invalid survey data!`
    };
  }

  try {
    await markAsReady( parsed.data.survey_id );
  } catch ( e ) {
    return {
      error: 'Something went wrong'
    };
  }

  revalidatePath( `/dashboard/${ survey.customerId }/edit-survey/${ parsed.data.survey_id }` );
};

const markAsPublicSchema = z.object(
  {
    survey_id: z.string()
                .uuid(),
    status: z.enum( [ SURVEY_STATUS.READY ] )
  }
);

export const markSurveyAsPublic = async ( _prevState: DefaultTemplateState, formData: FormData ) => {
  const parsed = markAsPublicSchema.safeParse( Object.fromEntries( formData.entries() ) as z.infer<typeof markAsReadySchema> );

  if ( !parsed.success ) {
    return {
      error: `Invalid data!`
    };
  }

  let customer_id = undefined;
  try {
    const { customerId } = await markAsPublic( parsed.data.survey_id );
    customer_id = customerId;
  } catch ( e ) {
    return {
      error: 'Something went wrong'
    };
  }
  redirect( `/dashboard/${ customer_id }`, RedirectType.replace );
};

const deleteSchema = z.object(
  {
    survey_id: z.string()
                .uuid(),
    name: z.string(),
    delete: z.enum( [ "delete" ] )
  }
);
export const deleteSurvey = async ( _prevState: DefaultTemplateState, formData: FormData ) => {
  const parsed = deleteSchema.safeParse( Object.fromEntries( formData.entries() ) as z.infer<typeof deleteSchema> );

  if ( !parsed.success ) {
    return {
      error: `Invalid data!`
    };
  }

  let customer_id = undefined;
  try {
    const { customerId } = await removeSurvey( parsed.data.survey_id );
    customer_id = customerId;
  } catch ( e ) {
    return {
      error: 'Something went wrong'
    };
  }
  revalidatePath( `/dashboard/${ customer_id }` );
};

const answerSchema = z
  .object(
    {
      type: z.nativeEnum( QUESTION_TYPE ),
      client: z.string()
               .uuid(),
      max: z.string()
            .nullable()
            .transform( data => !!data
                                ? isNaN( +data )
                                  ? null
                                  : +data
                                : null )
            .default( null ),
      min: z.string()
            .nullable()
            .transform( data => !!data
                                ? isNaN( +data )
                                  ? null
                                  : +data
                                : null ),
      value: z.string()
              .transform( data => data
                .split( 'ngf|-|ngf' )
                .filter( item => !!item ) )
              .refine( data => data.length > 0, {
                path: [ 'value' ]
              } ),
      next_question: z.string()
                      .transform( data => data || null ),
      questionId: z.string()
                   .uuid(),
      surveyId: z.string()
                 .uuid()
    }
  )
  .refine(
    data => {
      switch ( data.type ) {
        case QUESTION_TYPE.NUMBER:
        case QUESTION_TYPE.RANGE:
        case QUESTION_TYPE.SLIDER:
        case QUESTION_TYPE.RATING:
        case QUESTION_TYPE.FEEDBACK:
          return !data.value.some( val => isNaN( +val ) );
        default:
          return true;
      }
    },
    {
      message: 'coerce type to number failed',
      path: [ 'value' ]
    }
  )
  .refine( data => {
    if ( data.type === QUESTION_TYPE.MULTIPLE_SELECTION ) return true;
    if ( data.type === QUESTION_TYPE.RANGE ) return data.value.length === 2;
    return data.value.length === 1;
  }, {
             message: 'invalid value length',
             path: [ 'value' ]
           } )
  .refine(
    data => {
      if ( data.type !== QUESTION_TYPE.MULTIPLE_SELECTION ) {
        return true;
      }
      return data.value.length < ( data.min ?? 1 ) || data.value.length > ( data.max ?? Infinity );
    }, data => ( {
      path: [ 'value' ],
      message: `Select between ${ data.min } and ${ data.max } options`
    } ) )
  .refine(
    data => {
      switch ( data.type ) {
        case QUESTION_TYPE.RANGE:
          return +data.value[ 0 ] > ( data.min ?? 0 ) && +data.value[ 1 ] < ( data.max ?? 100 );
        case QUESTION_TYPE.SLIDER:
          return +data.value[ 0 ] < ( data.max ?? 100 );
        case QUESTION_TYPE.NUMBER:
          return +data.value[ 0 ] > ( data.min ?? 0 ) && +data.value[ 0 ] < ( data.max ?? 100 );
        default:
          return true;
      }
    }, data => ( {
      path: [ 'value' ],
      message: data.type === QUESTION_TYPE.RANGE || data.type === QUESTION_TYPE.NUMBER
               ? `Answer must be between ${ data.min } and ${ data.max ?? 100 }.`
               : `Answer must be between 0 and ${ data.max ?? 100 }.`
    } ) )
  .refine(
    data => {
      if ( data.type !== QUESTION_TYPE.FEEDBACK && data.type !== QUESTION_TYPE.RATING ) {
        return true;
      }
      return +data.value[ 0 ] > 0 && +data.value[ 0 ] < 6;
    }, {
      path: [ 'value' ],
      message: 'Value not allowed'
    } )
  .refine(
    data => {
      if ( data.type !== QUESTION_TYPE.CHECKBOX ) {
        return true;
      }
      return data.value[ 0 ] === 'on' || data.value[ 0 ] === 'off';
    }, {
      path: [ 'value' ],
      message: 'Value not allowed'
    }
  )
  .refine(
    data => {
      if ( data.type !== QUESTION_TYPE.EMAIL ) return true;
      return z.string()
              .email()
              .safeParse( data.value[ 0 ] ).success;
    },
    {
      path: [ 'value' ],
      message: 'Invalid email format'
    }
  );

export const addAnswer = async ( _prevState: DefaultTemplateState, formData: FormData ) => {
  const parsed = answerSchema.safeParse( Object.fromEntries( formData.entries() ) as unknown as z.infer<typeof answerSchema> );

  if ( !parsed.success ) {
    // console.log(parsed.error.errors[0])
    if ( parsed.error.errors.at( 0 )
               ?.message
               .startsWith( 'Select between' ) ||
         parsed.error.errors.at( 0 )
               ?.message
               .startsWith( 'Answer must be' ) ||
         parsed.error.errors.at( 0 )?.message === 'Value not allowed' ||
         parsed.error.errors.at( 0 )?.message === 'Invalid email format' ) {
      return {
        error: parsed.error.errors.at( 0 )?.message || `Invalid data received!`
      };
    }
    return {
      error: `Invalid data!`
    };
  }

  let isClientDuplicate = false;
  let isUniqueValueDuplicate = false;
  try {
    const { error, message } = await insertAnswer(
      {
        client: parsed.data.client,
        value: parsed.data.value,
        questionId: parsed.data.questionId,
        surveyId: parsed.data.surveyId
      }
    );

    isClientDuplicate = error && message === 'previous response with same client';
    isUniqueValueDuplicate = error && message === 'previous response with same value on is_unique field';
  } catch ( e ) {
    return {
      error: 'Something went wrong'
    };
  }

  if ( isUniqueValueDuplicate ) {
    return {
      error: 'This question requires a unique answer and this one has already been answered.'
    };
  }

  isClientDuplicate
  ? redirect( `/${ parsed.data.surveyId }`, RedirectType.replace )
  : parsed.data.next_question
    ? redirect( `/${ parsed.data.surveyId }/${ parsed.data.next_question }?c=${ parsed.data.client }`, RedirectType.replace )
    : redirect( `/${ parsed.data.surveyId }/final`, RedirectType.replace );
};

const deleteAnswerSchema = z.object(
  {
    surveyId: z.string()
               .uuid(),
    customerId: z.string()
                 .uuid(),
    clientIds: z.array( z.string()
                         .uuid() )
  }
);
export const deleteAnswerByClientId = async ( clientIds: string[], formData: FormData ) => {
  const parsed = deleteAnswerSchema.safeParse( {
                                                 ...Object.fromEntries( formData.entries() ),
                                                 clientIds
                                               } as unknown as z.infer<typeof deleteAnswerSchema> );

  if ( !parsed.success ) {
    return {
      error: `Invalid data!`
    };
  }

  try {
    await Promise.all( parsed.data.clientIds.map( clientId => removeAnswer( clientId ) ) );
  } catch ( e ) {
    return {
      error: 'Something went wrong'
    };
  }

  revalidatePath( `/dashboard/${ parsed.data.customerId }/${ parsed.data.surveyId }` );
};

const refreshTableSchema = z.object(
  {
    surveyId: z.string()
               .uuid(),
    customerId: z.string()
                 .uuid()
  }
);

export const refreshAnswerTable = ( formData: FormData ) => {
  const parsed = refreshTableSchema.safeParse( Object.fromEntries( formData.entries() ) as unknown as z.infer<typeof refreshTableSchema> );

  if ( !parsed.success ) {
    return {
      error: `Invalid data!`
    };
  }

  revalidatePath( `/dashboard/${ parsed.data.customerId }/${ parsed.data.surveyId }` );
};