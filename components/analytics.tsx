'use client';

import { Analytics } from '@vercel/analytics/react';
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const AnalyticsWrapper = () => {
  return <Analytics
    beforeSend={
      ( event ) => {
        if ( window?.localStorage.getItem( 'cookies-consent' ) === 'va-disable' ) {
          return null;
        }

        return event;
      } }
  />;
};

export const CookiesBanner = () => {
  const [ isOpen, setIsOpen ] = useState( false );

  const onClick = ( val: 'va-available' | 'va-disable' ) => {
    window?.localStorage.setItem( 'cookies-consent', val );
    setIsOpen( false );
  };

  useEffect( () => {
    if ( window?.localStorage.getItem( 'cookies-consent' ) ) {
      return;
    }
    setIsOpen( true );
  }, [] );

  return (
    <Sheet
      defaultOpen={ false }
      onOpenChange={ setIsOpen }
      open={ isOpen }
    >
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>
            We use cookies
          </SheetTitle>
        </SheetHeader>

        <SheetDescription>
          Cookies help us deliver the best experience on our website. By using our website, you agree to the use of
          cookies. You can also reject it.
        </SheetDescription>

        <SheetFooter
          className={ cn(
            'flex flex-col items-center justify-end space-y-1.5',
            'sm:flex-row sm:space-x-1.5 sm:space-y-0'
          ) }
        >
          <SheetClose asChild>
            <Button
              variant="outline"
              onClick={ () => onClick( 'va-disable' ) }
            >
              Reject
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              autoFocus
              variant="outline"
              onClick={ () => onClick( 'va-available' ) }
            >
              Accept
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};