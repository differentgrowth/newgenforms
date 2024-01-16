import Link from "next/link";

import { ExitIcon, PersonIcon } from "@radix-ui/react-icons";

import { ToggleTheme } from "@/components/toggles";
import { Logo } from "@/components/logo";
import { DashboardSidebar } from "@/components/dashboad-sidebar";
import { SubmitButton } from "@/components/buttons";
import { buttonVariants } from "@/components/ui/button";
import { logout } from "@/app/actions";
import { cn } from "@/lib/utils";

export const Header = () => {
  return (
    <header className="mb-12 flex items-center justify-between px-2 py-4">
      <Link
        href="/"
        className={ cn(
          buttonVariants( { variant: 'ghost' } )
        ) }
      >
        <Logo />
      </Link>

      <div className="flex items-center space-x-1.5">
        <Link
          href={ '/login' }
          className={ cn(
            buttonVariants( { variant: 'ghost', size: 'icon' } )
          ) }
        >
          <PersonIcon />
          <span className="sr-only">Login</span>
        </Link>
        <ToggleTheme />
      </div>
    </header>
  );
};

export const DashboardHeader = () => {
  return (
    <header className="mb-12 flex items-center justify-between px-2 py-4">
      <DashboardSidebar />

      <div className="flex items-center justify-end space-x-1.5">
        <form action={ logout }>
          <SubmitButton
            variant="ghost"
            icon={ <ExitIcon /> }
          >
          <span className="hidden sm:inline-flex">
            Sign Out
          </span>
          </SubmitButton>
        </form>
        <ToggleTheme />
      </div>
    </header>
  );
};
