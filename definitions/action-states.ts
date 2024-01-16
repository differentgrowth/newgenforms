export type DefaultTemplateState =
  | {
    error: string | null;
  }
  | undefined

export type HydratedTemplateState =
  | {
    error: boolean;
    success: boolean;
    message: string | null;
  }
  | undefined
