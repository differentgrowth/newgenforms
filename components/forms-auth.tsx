'use client';

import { useFormState } from 'react-dom';

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { authenticate, signup } from "@/app/actions";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const SignUpForm = ( { className, children }: {
  className?: string;
  children: React.ReactNode;
} ) => {
  const [ state, action ] = useFormState( signup, undefined );

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
              'mt-4 w-full max-w-lg mx-auto',
              'border-destructive bg-destructive/10'
            ) }
          >
            <CardContent className="pt-6">
              <CardDescription className="text-destructive">
                <ExclamationTriangleIcon className="inline-flex mr-1.5" />
                { state.error }
              </CardDescription>
            </CardContent>
          </Card>
        )
        : null }
    </>
  );
};
export const LogInForm = ( { className, children }: {
  className?: string;
  children: React.ReactNode;
} ) => {
  const [ state, action ] = useFormState( authenticate, undefined );

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
              'mt-4 w-full max-w-lg mx-auto',
              'border-destructive bg-destructive/10'
            ) }
          >
            <CardContent className="pt-6">
              <CardDescription className="text-destructive">
                <ExclamationTriangleIcon className="inline-flex mr-1.5" />
                { state.error }
              </CardDescription>
            </CardContent>
          </Card>
        )
        : null }
    </>
  );
};