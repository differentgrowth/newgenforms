import { Metadata } from 'next';
import Link from "next/link";

import { EyeOpenIcon, HeartFilledIcon } from "@radix-ui/react-icons";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

const Page = () => {
  return (
    <main>
      <h1 className="mx-auto text-center sm:w-3/4 md:w-2/3">
        Elevate Insights with Micro Surveys by NewGenForms
      </h1>

      <section
        className={ cn(
          'grid grid-cols-1 items-center justify-items-center lg:grid-cols-3 xl:grid-cols-4'
        ) }
      >
        <div
          className={ cn(
            "py-24 sm:py-32",
            'lg:col-span-2 xl:col-span-3'
          ) }
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <p className="text-base font-semibold leading-7">Get the help you need</p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight sm:text-6xl">
                Seamless, Intuitive, and Powerful
              </h2>
              <h3 className="mt-1.5">
                Your Ultimate Micro Survey Solution
              </h3>
              <p className="text-muted-foreground mt-6 text-lg leading-8">
                Welcome to the future of feedback with NewGenForms, where micro-surveys transform how you connect with
                your audience.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/login?value=signup"
          className={ buttonVariants( { variant: 'default', className: 'lg:justify-self-start' } ) }
        >
          Get Started
          <HeartFilledIcon className="ml-1.5 size-4" />
        </Link>
      </section>

      <div className="flex justify-center">
        <Link
          href="/3ae6b73b-1ad9-436d-83a6-cd7aeb9c0fbe"
          className={ cn(
            buttonVariants( { variant: 'outline' } )
          ) }
        >
          View demo survey
          <EyeOpenIcon className="ml-1.5 size-4" />
        </Link>
      </div>
    </main>
  );
};

export default Page;