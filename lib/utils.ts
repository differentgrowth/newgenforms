import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn( ...inputs: ClassValue[] ) {
  return twMerge( clsx( inputs ) );
}

export const phoneRegex = /^[(]?[0-9]{1,3}[)]?[-\s./0-9]{8,14}$/g;
export const hours = Array.from( { length: 24 } )
                          .map( ( _, i ) => i.toString()
                                             .padStart( 2, '0' ) );
export const minutes = Array.from( { length: 60 } )
                            .map( ( _, i ) => i )
                            .filter( minute => minute % 5 === 0 )
                            .map( minute => minute.toString()
                                                  .padStart( 2, '0' ) );
