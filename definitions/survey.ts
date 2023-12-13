export enum SURVEY_STATUS {
  EMPTY = 'empty',
  PENDING = 'pending',
  READY = 'ready',
  PUBLISHED = 'published',
  FINISHED = 'finished',
}

export enum SURVEY_THEME {
  DARK = 'dark',
  FOREST = 'forest',
  ICELAND = 'iceland',
  LIGHT = 'light',
  OCEAN = 'ocean',
  SUNRISE = 'sunrise'
}

export const themes = [
  {
    value: SURVEY_THEME.DARK,
    label: 'Dark'
  },
  {
    value: SURVEY_THEME.FOREST,
    label: 'Forest'
  },
  {
    value: SURVEY_THEME.ICELAND,
    label: 'Iceland'
  },
  {
    value: SURVEY_THEME.LIGHT,
    label: 'Light'
  },
  {
    value: SURVEY_THEME.OCEAN,
    label: 'Ocean'
  },
  {
    value: SURVEY_THEME.SUNRISE,
    label: 'Sunrise'
  }
]