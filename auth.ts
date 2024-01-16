import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { compare, hash } from 'bcrypt';

import { authConfig } from './auth.config';
import { createCustomer, getCustomerByEmail } from '@/lib/db';

export const {
  auth,
  signIn,
  signOut
} = NextAuth(
  {
    ...authConfig,
    providers: [
      Credentials(
        {
          async authorize( credentials ) {
            const parsedCredentials = z
              .object( {
                         email: z.string()
                                 .email(),
                         password: z.string()
                                    .min( 8 )
                       } )
              .safeParse( credentials );

            if ( parsedCredentials.success ) {
              const {
                email,
                password
              } = parsedCredentials.data;
              let customer = await getCustomerByEmail( email );

              if ( !customer ) {
                const encryptPassword = await hash( password, 10 );
                customer = await createCustomer( { email, password: encryptPassword } );

                if ( !customer ) return null;

                return {
                  id: customer.id,
                  name: customer.id,
                  role: 'customer'
                };
              }

              const passwordsMatch = await compare( password, customer.password );
              if ( passwordsMatch ) {
                return {
                  id: customer.id,
                  name: customer.id,
                  role: customer.role
                };
              }
            }

            return null;
          }
        } )
    ]
  } );