import { PrismaClient } from '@prisma/client';
import { CreateQuestion } from "@/definitions/question";
import { SURVEY_STATUS } from "@/definitions/survey";
import { AnswerInsert } from "@/definitions/answer";

const prisma = new PrismaClient();

export const createCustomer = async ( { email, password }: {
  email: string;
  password: string
} ) => {
  return prisma.customer.create( {
                                   data: {
                                     email,
                                     password
                                   }
                                 } );
};
export const getCustomerByEmail = async ( email: string ) => {
  return prisma.customer.findUnique( {
                                       where: { email },
                                       select: {
                                         id: true,
                                         email: true,
                                         password: true,
                                         role: true
                                       }
                                     } );
};

export const getCustomerById = async ( id: string ) => {
  return prisma.customer.findUnique( {
                                       where: { id },
                                       select: {
                                         id: true,
                                         email: true,
                                         language: true,
                                         timezone: true,
                                         commercial_communications: true
                                       }
                                     } );
};

export const getCustomerPassword = async ( customerId: string ) => {
  return prisma.customer.findUnique( {
                                       where: { id: customerId },
                                       select: {
                                         password: true
                                       }
                                     } );
};

export const updateCustomer = async ( { id, email, language, commercial_communications }: {
  id: string;
  email: string;
  language: string;
  commercial_communications: boolean
} ) => {
  return prisma.customer.update( {
                                   where: { id },
                                   data: {
                                     email,
                                     language,
                                     commercial_communications
                                   }
                                 } );
};

export const updateCustomerPassword = ( { id, new_password }: {
  id: string;
  new_password: string
} ) => {
  return prisma.customer.update( {
                                   where: { id },
                                   data: {
                                     password: new_password
                                   }
                                 } );
};

export const createSurvey = async ( { customerId, name }: {
  customerId: string;
  name: string;
} ) => {
  return prisma.survey.create( {
                                 data: {
                                   customerId,
                                   name
                                 },
                                 select: {
                                   id: true
                                 }
                               } );
};

export const getSurvey = async ( { surveyId, customerId }: {
  surveyId: string;
  customerId?: string;
} ) => {
  return prisma.survey.findUnique(
    {
      where: {
        id: surveyId,
        customerId: customerId
      },
      include: {
        Customer: {
          select: {
            timezone: true
          }
        },
        questions: {
          select: {
            id: true,
            type: true,
            register_name: true,
            order: true,
            label: true,
            submit_label: true,
            is_unique: true,
            max: true,
            min: true,
            step: true,
            options: true
          },
          orderBy: {
            order: 'desc'
          }
        }
      }
    }
  );
};

export const addSurveyFeatures = async ( surveyId: string, features: {
  status: string;
  name: string;
  theme: string;
  from: Date;
  to: Date;
  timezone: string;
  redirect: string | null;
  final_message: string;
} ) => {
  return prisma.survey.update( {
                                 where: { id: surveyId },
                                 data: { ...features },
                                 select: { id: true }
                               } );
};

export const getCustomerSurveys = async ( customerId: string ) => {
  return prisma.survey.findMany(
    {
      where: { customerId: customerId },
      select: {
        id: true,
        theme: true,
        name: true,
        status: true,
        from: true,
        to: true,
        timezone: true
      },
      orderBy: [
        {
          status: 'asc'
        },
        {
          from: 'desc'
        }
      ]
    }
  );
};

export const upsertQuestion = async ( { data, customerId, surveyId }: {
  data: CreateQuestion;
  customerId: string;
  surveyId: string;
} ) => {
  return prisma.question.upsert(
    {
      where: {
        id: data.id
      },
      update: {
        id: data.id,
        type: data.type,
        register_name: data.register_name,
        order: data.order,
        label: data.label,
        submit_label: data.submit_label,
        is_unique: data.is_unique,
        max: data.max,
        min: data.min,
        step: data.step,
        options: {
          deleteMany: {},
          create: data.options.map( item => ( {
            value: item.value
          } ) )
        }
      },
      create: {
        id: data.id,
        type: data.type,
        register_name: data.register_name,
        order: data.order,
        label: data.label,
        submit_label: data.submit_label,
        is_unique: data.is_unique,
        max: data.max,
        min: data.min,
        step: data.step,
        surveyId,
        customerId,
        options: {
          create: data.options.map( item => ( {
            value: item.value
          } ) )
        }
      },
      select: {
        id: true
      }
    }
  );
};

export const removeQuestion = async ( id: string ) => {
  return prisma.question.delete( { where: { id } } );
};

export const updateQuestionOrders = async ( surveyId: string ) => {
  const questions = await prisma.question.findMany(
    {
      where: { surveyId },
      orderBy: { order: 'asc' }
    }
  );

  return Promise.all( questions.map( ( item, index ) => prisma.question.update(
    {
      where: { id: item.id },
      data: {
        order: index,
        next_question: questions[ index + 1 ]?.id || null
      }
    }
  ) ) );
};

export const markAsReady = async ( id: string ) => {
  const questions = await prisma.question.findMany(
    {
      where: {
        surveyId: id
      },
      orderBy: {
        order: 'asc'
      }
    }
  );

  await Promise.all( [
                       ...questions.map( item => prisma.question.update(
                         {
                           where: { id: item.id },
                           data: {
                             next_question: questions.find( i => i.order === item.order + 1 )?.id || null
                           }
                         }
                       ) ),
                       prisma.survey.update( { where: { id }, data: { status: SURVEY_STATUS.READY } } )
                     ] );
};

export const markAsPublic = async ( id: string ) => {
  return prisma.survey.update( {
                                 where: { id, status: SURVEY_STATUS.READY },
                                 data: { status: SURVEY_STATUS.PUBLISHED, from: new Date() },
                                 select: { customerId: true }
                               } );
};

export const removeSurvey = async ( id: string ) => {
  return prisma.survey.delete( { where: { id } } );
};

export const getAnswers = async ( { survey_id, customer_id }: {
  survey_id: string;
  customer_id: string;
} ) => {
  return prisma.survey.findUnique(
    {
      where: { id: survey_id, customerId: customer_id },
      include: {
        questions: {
          include: {
            answers: {
              select: {
                id: true,
                created_at: true,
                client: true,
                value: true
              }
            }
          }
        }
      }
    } );
};

export const getClientIds = async ( survey_id: string ) => {
  return prisma.answer.findMany(
    {
      where: { surveyId: survey_id },
      select: {
        client: true
      }
    }
  );
};

export const getSurveyTheme = async ( id: string ) => {
  return prisma.survey.findUnique(
    {
      where: { id },
      select: {
        id: true,
        theme: true
      }
    }
  );
};

export const getSurveyStatus = async ( id: string ) => {
  return prisma.survey.findUnique(
    {
      where: {
        id,
        status: {
          in: [
            SURVEY_STATUS.READY,
            SURVEY_STATUS.PUBLISHED,
            SURVEY_STATUS.FINISHED
          ]
        }
      },
      select: {
        id: true,
        status: true
      }
    }
  );
};

export const getSurveyDates = async ( id: string ) => {
  return prisma.survey.findUnique(
    {
      where: {
        id,
        status: {
          in: [
            SURVEY_STATUS.READY,
            SURVEY_STATUS.PUBLISHED
          ]
        }
      },
      select: {
        id: true,
        status: true,
        name: true,
        from: true,
        to: true
      }
    }
  );
};

export const automaticPublish = () => {
  return prisma.survey.updateMany(
    {
      where: {
        status: SURVEY_STATUS.READY,
        from: {
          lte: new Date()
        }
      },
      data: { status: SURVEY_STATUS.PUBLISHED }
    }
  );
};
export const automaticFinish = () => {
  return prisma.survey.updateMany(
    {
      where: {
        status: SURVEY_STATUS.PUBLISHED,
        to: {
          lte: new Date()
        }
      },
      data: { status: SURVEY_STATUS.FINISHED }
    }
  );
};

export const getFirstQuestion = async ( id: string ) => {
  return prisma.survey.findUnique(
    {
      where: { id },
      include: {
        questions: {
          where: {
            order: 0
          }
        }
      }
    }
  );
};

export const getQuestion = async ( id: string ) => {
  return prisma.question.findUnique(
    {
      where: { id },
      include: {
        Survey: {
          select: {
            name: true
          }
        },
        options: {
          select: {
            id: true,
            value: true
          }
        }
      }
    }
  );
};

export const getFinalMessage = async ( id: string ) => {
  return prisma.survey.findUnique(
    {
      where: { id },
      select: {
        id: true,
        name: true,
        final_message: true,
        redirect: true,
        status: true
      }
    }
  );
};

export const insertAnswer = async ( answer: AnswerInsert ) => {
  const previousResponse = prisma.answer.findFirst(
    {
      where: {
        surveyId: answer.surveyId,
        questionId: answer.questionId,
        client: answer.client
      },
      select: {
        id: true
      }
    }
  );

  const isUniqueValueDuplicate = prisma.answer.findFirst(
    {
      where: {
        questionId: answer.questionId,
        Question: {
          is_unique: true
        },
        value: {
          has: answer.value[ 0 ]
        }
      },
      select: {
        id: true
      }
    }
  );

  const [ dataPrevious, dataDuplicate ] = await Promise.all( [
                                                               previousResponse,
                                                               isUniqueValueDuplicate
                                                             ] );


  if ( dataPrevious ) {
    return {
      error: true,
      message: 'previous response with same client'
    };
  }
  if ( dataDuplicate ) {
    return {
      error: true,
      message: 'previous response with same value on is_unique field'
    };
  }

  await prisma.answer.create(
    {
      data: { ...answer },
      select: {
        id: true
      }
    }
  );

  return {
    error: false,
    message: 'success'
  };
};

export const removeAnswer = ( client: string ) => {
  return prisma.answer.deleteMany(
    {
      where: { client }
    }
  );
};

export const getAnswerByClient = async ( client: string ) => {
  return prisma.answer.findMany(
    {
      where: {
        client
      },
      include: {
        Question: {
          include: {
            Survey: {
              select: {
                name: true,
                timezone: true
              }
            }
          }
        }
      }
    }
  );
};
