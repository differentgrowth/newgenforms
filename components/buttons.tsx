'use client';

import { useEffect, useState } from "react";

import { ArrowRightIcon, CheckCircledIcon, CopyIcon, ReloadIcon } from "@radix-ui/react-icons";

import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";

export const CopySurveyUrlButton = ( { surveyId, className }: {
  surveyId: string;
  className?: string
} ) => {
  const [ isCopied, setIsCopied ] = useState( false );

  const handleCopy = async ( url: string ) => {
    const blob = new Blob( [ url ], { type: 'text/plain' } );
    const data = [ new ClipboardItem( { [ 'text/plain' ]: blob } ) ];

    try {
      await navigator.clipboard.write( data );
    } catch ( e ) {
      console.error( e );
    }
  };

  useEffect( () => {
    if ( !isCopied ) return;
    const timeout = setTimeout( () => setIsCopied( false ), 2000 );

    return () => clearTimeout( timeout );
  }, [ isCopied ] );

  return (
    <Button
      variant="secondary"
      className={ cn(
        className
      ) }
      onClick={ () => {
        setIsCopied( true );
        handleCopy( `${ location.origin }/${ surveyId }` );
      } }
    >
      Copy survey URL
      { isCopied
        ? <CheckCircledIcon className="ml-1.5 size-4" />
        : <CopyIcon className="ml-1.5 size-4" /> }
    </Button>
  );
};

type Props =
  &
  Omit<ButtonProps, 'children'>
  & {
  children?: React.ReactNode;
  icon?: React.ReactNode;
}
export const SubmitButton = ( { className, children, icon, ...props }: Props ) => {
  const { pending } = useFormStatus();

  return (
    <Button
      { ...props }
      className={ cn(
        '[&>svg]:size-4',
        props.size !== 'icon' && '[&>svg]:ml-1.5',
        className
      ) }
      type="submit"
      aria-disabled={ pending }
    >
      { children }

      { pending
        ? <ReloadIcon className="animate-spin" />
        : icon || <ArrowRightIcon />
      }
    </Button>
  );
};

export const ReloadButton = () => {
  const [ isClicking, setIsClicking ] = useState( false );
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={ () => {
        setIsClicking( true );
        location.reload();
      } }
      className="bg-background grow-0"
      aria-disabled={ isClicking }
    >
      Reload changes
      <ReloadIcon
        className={ cn(
          "ml-1.5 size-4",
          isClicking && 'animate-spin'
        ) }
      />
    </Button>
  );
};