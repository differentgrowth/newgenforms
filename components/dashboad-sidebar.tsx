'use client';

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link, { LinkProps } from "next/link";

import { PersonIcon, ViewVerticalIcon } from "@radix-ui/react-icons";

import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mark } from "@/components/logo";
import { cn } from "@/lib/utils";
import { navigation } from "@/lib/navigation";

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const params = useParams();
  const [ isOpen, setIsOpen ] = useState( false );

  useEffect( () => {
    isOpen && setIsOpen( false );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ pathname ] );

  return (
    <Sheet
      open={ isOpen }
      onOpenChange={ setIsOpen }
    >
      <SheetTrigger asChild>
        <Button variant="ghost">
          <ViewVerticalIcon className="size-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex max-w-xs flex-col items-stretch overflow-y-scroll sm:max-w-xs"
      >
        <SheetHeader>
          <Mark />
        </SheetHeader>

        <ScrollArea className="my-4 grow p-0">
          <div className="flex flex-col space-y-3">
            { navigation.map(
              ( item ) =>
                <MobileLink
                  key={ item.path || 'dashboard' }
                  href={ item.path === ''
                         ? `/dashboard/${ params.customer_id }`
                         : `/dashboard/${ params.customer_id }/${ item.path }` }
                  onOpenChange={ setIsOpen }
                >
                  { item.label }
                  <item.icon className="ml-1.5 size-4" />
                </MobileLink>
            ) }
          </div>
        </ScrollArea>

        <div className="my-4 p-0">
          <MobileLink
            href={ `/dashboard/${ params.customer_id }/account` }
            className="w-full"
            onOpenChange={ setIsOpen }
          >
            Account
            <PersonIcon className="ml-1.5 size-4" />
          </MobileLink>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface MobileLinkProps extends LinkProps {
  onOpenChange?: ( open: boolean ) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink( {
                       href,
                       onOpenChange,
                       className,
                       children,
                       ...props
                     }: MobileLinkProps ) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Link
      href={ href }
      onClick={ () => {
        router.push( href.toString() );
        onOpenChange?.( false );
      } }
      className={ cn(
        buttonVariants( {
                          variant: pathname === href
                                   ? 'default'
                                   : 'outline',
                          className: 'justify-between'
                        } ),
        className
      ) }
      { ...props }
    >
      { children }
    </Link>
  );
}