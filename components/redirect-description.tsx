'use client';

import { useEffect } from "react";

import { ReloadIcon } from "@radix-ui/react-icons";

import { CardDescription } from "@/components/ui/card";

type Props = {
  redirectTo: string;
}
export const RedirectDescription = ( { redirectTo }: Props ) => {
  useEffect( () => {
    const timeout = setTimeout( () => {
      window.location.href = redirectTo;
    }, 2000 );

    return () => clearTimeout( timeout );
  }, [ redirectTo ] );

  return (
    <CardDescription className="text-muted-foreground ml-auto">
      <ReloadIcon className="mr-2 inline-flex size-4 animate-spin" />
      { new URL( redirectTo ).host }
    </CardDescription>
  );
};