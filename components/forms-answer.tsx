'use client'

import { useFormState } from "react-dom";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { addAnswer } from "@/app/actions";
import { cn } from "@/lib/utils";

export const AnswerForm = ( { className, children }: {
  className?: string;
  children: React.ReactNode;
} ) => {
  const [ state, action ] = useFormState( addAnswer, undefined );

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
              'container mx-auto mt-4 px-2',
              'bg-muted'
            ) }
          >
            <CardContent className="pt-6">
              <CardDescription>
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