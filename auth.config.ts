import { NextResponse } from "next/server";

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  providers: [],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    authorized( { auth, request: { nextUrl } } ) {
      const isLoggedIn = !!auth?.user;
      const isOnAuthentication = nextUrl.pathname.startsWith( '/login' );
      const isOnDashboard = nextUrl.pathname.startsWith( '/dashboard' );

      if ( isOnDashboard ) {
        // Redirect unauthenticated users to login page
        return isLoggedIn && nextUrl.pathname.startsWith( `/dashboard/${ auth?.user?.name }` );
      }
      if ( isLoggedIn && isOnAuthentication ) {
        return NextResponse.redirect( new URL( `/dashboard/${ auth.user!.name }`, nextUrl ) );
      }
      return true;
    }
  }
} satisfies NextAuthConfig;