export type CreateQuestion = {
  id: string;
  type: QUESTION_TYPE;
  register_name: string;
  order: number;
  label: string;
  submit_label: string;
  is_unique: boolean;
  max: number | null;
  min: number | null;
  step: number | null;
  options: CreateOption[];
}

export type CreateOption = {
  id: string;
  value: string;
  questionId: string;
}

export type OptionInQuestion = {
  id: string;
  value: string;
}

export enum QUESTION_TYPE {
  BUTTONS_GROUP = 'buttons-group',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'date-picker',
  DROPDOWN_LIST = 'dropdown-list',
  EMAIL = 'email',
  FEEDBACK = 'feedback',
  LONG_TEXT = 'long-text',
  MULTIPLE_SELECTION = 'multiple-selection',
  NUMBER = 'number',
  PHONE = 'phone',
  RANGE = 'range',
  RATING = 'rating',
  SINGLE_SELECTION = 'single-selection',
  SLIDER = 'slider',
  TEXT = 'text',
  TIME_PICKER = 'time-picker'
}

export const questionTypes = [
  {
    value: QUESTION_TYPE.BUTTONS_GROUP,
    label: 'Buttons Group'
  },
  {
    value: QUESTION_TYPE.CHECKBOX,
    label: 'Checkbox'
  },
  {
    value: QUESTION_TYPE.DATE_PICKER,
    label: 'Date Picker'
  },
  {
    value: QUESTION_TYPE.DROPDOWN_LIST,
    label: 'Dropdown List'
  },
  {
    value: QUESTION_TYPE.EMAIL,
    label: 'Email'
  },
  {
    value: QUESTION_TYPE.FEEDBACK,
    label: 'Feedback'
  },
  {
    value: QUESTION_TYPE.LONG_TEXT,
    label: 'Long Text'
  },
  {
    value: QUESTION_TYPE.MULTIPLE_SELECTION,
    label: 'Multiple Selection'
  },
  {
    value: QUESTION_TYPE.NUMBER,
    label: 'Number'
  },
  {
    value: QUESTION_TYPE.PHONE,
    label: 'Phone'
  },
  {
    value: QUESTION_TYPE.RANGE,
    label: 'Range'
  },
  {
    value: QUESTION_TYPE.RATING,
    label: 'Rating'
  },
  {
    value: QUESTION_TYPE.SINGLE_SELECTION,
    label: 'Single Selection'
  },
  {
    value: QUESTION_TYPE.SLIDER,
    label: 'Slider'
  },
  {
    value: QUESTION_TYPE.TEXT,
    label: 'Text'
  },
  {
    value: QUESTION_TYPE.TIME_PICKER,
    label: 'Time Picker'
  }
];