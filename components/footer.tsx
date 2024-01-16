import { HeartIcon } from "@radix-ui/react-icons";

import { buttonVariants } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="mt-34 border-t md:mt-36">
      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8">
        <p className="mt-10 text-center">
          &copy; { new Date().getFullYear() } Different Growth.
        </p>
      </div>

      <div className="flex flex-row items-end justify-end p-2">
        <a
          href="https://www.differentgrowth.com"
          className={ buttonVariants( { variant: 'link' } ) }
        >
          Designed by DifferentGrowth with <HeartIcon className="ml-1.5 size-4" />
        </a>
      </div>
    </footer>
  );
};