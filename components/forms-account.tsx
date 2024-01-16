'use client';

import { useFormState } from "react-dom";

import { CheckIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { updateAccount, updatePassword } from "@/app/actions";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const AccountForm = ( { className, children }: {
  className?: string;
  children: React.ReactNode;
} ) => {
  const [ state, action ] = useFormState( updateAccount, undefined );

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

      { state?.error || state?.success
        ? (
          <Card
            className={ cn(
              'mx-auto mt-4 w-full max-w-lg',
              state.error && 'border-destructive bg-destructive/10'
            ) }
          >
            <CardContent className="pt-6">
              <CardDescription className={ cn( { "text-destructive": state.error } ) }>
                { state.error
                  ? <ExclamationTriangleIcon className="mr-1.5 inline-flex" />
                  : <CheckIcon className="mr-1.5 inline-flex" /> }
                { state.message }
              </CardDescription>
            </CardContent>
          </Card>
        )
        : null }
    </>
  );
};

export const UpdatePasswordForm = ( { className, children }: {
  className?: string;
  children: React.ReactNode;
} ) => {
  const [ state, action ] = useFormState( updatePassword, undefined );

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

      { state?.error || state?.success
        ? (
          <Card
            className={ cn(
              'mx-auto mt-4 w-full max-w-lg',
              state.error && 'border-destructive bg-destructive/10'
            ) }
          >
            <CardContent className="pt-6">
              <CardDescription className={ cn( { "text-destructive": state.error } ) }>
                { state.error
                  ? <ExclamationTriangleIcon className="mr-1.5 inline-flex" />
                  : <CheckIcon className="mr-1.5 inline-flex" /> }
                { state.message }
              </CardDescription>
            </CardContent>
          </Card>
        )
        : null }
    </>
  );
};