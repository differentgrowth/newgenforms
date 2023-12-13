import { HeartIcon } from "@radix-ui/react-icons";

import { buttonVariants } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="mt-34 md:mt-36 border-t">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8">
        <p className="mt-10 text-center">
          &copy; { new Date().getFullYear() } Different Growth.
        </p>
      </div>

      <div className="p-2 flex flex-row justify-end items-end">
        <a
          href="https://www.differentgrowth.com"
          className={ buttonVariants( { variant: 'link' } ) }
        >
          Designed by DifferentGrowth with <HeartIcon className="ml-1.5 h-4 w-4" />
        </a>
      </div>
    </footer>
  );
};