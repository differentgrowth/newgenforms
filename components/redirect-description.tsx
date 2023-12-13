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
  }, [] );

  return (
    <CardDescription className="ml-auto text-muted-foreground">
      <ReloadIcon className="inline-flex mr-2 w-4 h-4 animate-spin" />
      { new URL( redirectTo ).host }
    </CardDescription>
  );
};