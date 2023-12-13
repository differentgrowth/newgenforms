import { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import { AnalyticsWrapper, CookiesBanner } from "@/components/analytics";
import { Providers } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { cn } from '@/lib/utils';

import '@/app/globals.css';

type LayoutProps = {
  params: {};
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: {
    default: 'NewGenForms | Simple surveys for important decisions',
    template: '%s | NewGenForms'
  },
  description: `NewGenForms is the online survey platform you need to make informed decisions and improve your business. Create surveys in minutes, get responses in real time, and discover valuable insights with our data visualization and analysis tools. Our intuitive and customizable platform adapts to your needs, giving you the flexibility to get the information you need. Sign up today and start getting simple feedback for important decisions!`,
  generator: 'Next.js',
  applicationName: 'NewGenForms',
  referrer: 'origin-when-cross-origin',
  creator: 'DifferentGrowth',
  publisher: 'DifferentGrowth',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  metadataBase: new URL( 'https://www.newgenforms.com' ),
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en'
    }
  },
  openGraph: {
    title: 'NewGenForms | Simple surveys for important decisions',
    description: `NewGenForms is the online survey platform you need to make informed decisions and improve your business. Create surveys in minutes, get responses in real time, and discover valuable insights with our data visualization and analysis tools. Our intuitive and customizable platform adapts to your needs, giving you the flexibility to get the information you need. Sign up today and start getting simple feedback for important decisions!`,
    url: 'https://www.newgenforms.com',
    siteName: 'NewGenForms',
    locale: 'en',
    type: 'website'
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0a09' }
  ]
};


const RootLayout = ( { children }: LayoutProps ) => {
  return (
    <html
      lang="en"
      className={ cn( GeistSans.variable, GeistMono.variable ) }
    >
    <body>
    <Providers>
      { children }
      <AnalyticsWrapper />
      <CookiesBanner />
      <TailwindIndicator />
    </Providers>
    </body>
    </html>
  );
};

export default RootLayout;