"use client";

import { useState } from "react";

import { addDays, format } from "date-fns";
import { CalendarIcon, CheckIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { languages } from "@/definitions/customer";
import { cn, hours, minutes } from "@/lib/utils";
import { themes } from "@/definitions/survey";

type Props =
  Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'>
  & {
  defaultValue: {
    from: string | undefined;
    to: string | undefined;
  }
}
export const DatePickerWithRange = ( { className, defaultValue }: Props ) => {
  const [ date, setDate ] = useState<DateRange | undefined>( {
                                                               from: defaultValue.from
                                                                     ? new Date( defaultValue.from )
                                                                     : new Date(),
                                                               to: defaultValue.to
                                                                   ? new Date( defaultValue.to )
                                                                   : addDays( new Date(), 20 )
                                                             } );


  return (
    <div className={ cn( "grid gap-1.5", className ) }>
      <input
        type="hidden"
        id="from"
        name="from"
        value={ date?.from?.toISOString()
                    .split( 'T' )
                    .at( 0 ) }
      />
      <input
        type="hidden"
        id="to"
        name="to"
        value={ date?.to?.toISOString()
                    .split( 'T' )
                    .at( 0 ) }
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={ "outline" }
            className={ cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            ) }
          >
            <CalendarIcon className="mr-2 size-4" />
            { date?.from
              ? (
                date.to
                ? (
                  <>
                    { format( date.from, "LLL dd, y" ) } -{ " " }
                    { format( date.to, "LLL dd, y" ) }
                  </>
                )
                : (
                  format( date.from, "LLL dd, y" )
                )
              )
              : (
                <span>Pick a date</span>
              ) }
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={ date?.from }
            selected={ date }
            onSelect={ setDate }
            numberOfMonths={ 2 }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const PickerLanguage = ( { defaultValue }: {
  defaultValue: string
} ) => {
  const [ value, setValue ] = useState( defaultValue );

  return (
    <>
      <input
        type="hidden"
        id="language"
        name="language"
        value={ value }
      />
      <Select
        onValueChange={ setValue }
        value={ value || defaultValue }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          { languages
            .map( item => (
              <SelectItem
                key={ item.value }
                value={ item.value }
              >
                { item.label }
              </SelectItem>
            ) ) }
        </SelectContent>
      </Select>
    </>
  );
};

export const PickerTime = ( { defaultValue, name, type }: {
  name: string;
  defaultValue: string;
  type: 'hours' | 'minutes'
} ) => {
  const [ value, setValue ] = useState( defaultValue );

  return (
    <>
      <input
        type="hidden"
        id={ name }
        name={ name }
        value={ value }
      />
      <Select
        onValueChange={ setValue }
        value={ value || defaultValue }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          { type === 'hours'
            ? hours.map( item => (
              <SelectItem
                key={ item }
                value={ item }
              >
                { item }
              </SelectItem>
            ) )
            : minutes.map( item => (
              <SelectItem
                value={ item }
                key={ item }
              >
                { item }
              </SelectItem>
            ) ) }
        </SelectContent>
      </Select>
    </>
  );
};

const timezones = Intl.supportedValuesOf( 'timeZone' );
export const PickerTimezone = ( { defaultValue }: {
  defaultValue: string;
} ) => {
  const [ open, setOpen ] = useState( false );
  const [ value, setValue ] = useState( defaultValue );

  return (
    <>
      <input
        type="hidden"
        id="timezone"
        name="timezone"
        value={ value }
      />
      <Popover
        open={ open }
        onOpenChange={ setOpen }
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={ open }
            className="w-full justify-between"
          >
            { value || "Select timezone..." }
            <ChevronUpIcon className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search timezone..." />
            <CommandEmpty>No timezone found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-[300px] w-full p-0">
                { timezones.map( ( timezone ) => (
                  <CommandItem
                    key={ timezone }
                    value={ timezone }
                    onSelect={ ( currentValue ) => {
                      setValue( currentValue === value
                                ? ""
                                : currentValue );
                      setOpen( false );
                    } }
                  >
                    <CheckIcon
                      className={ cn(
                        "mr-2 size-4",
                        value === timezone
                        ? "opacity-100"
                        : "opacity-0"
                      ) }
                    />
                    { timezone }
                  </CommandItem>
                ) ) }
              </ScrollArea>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export const PickerTheme = ( { defaultValue }: {
  defaultValue: string
} ) => {
  const [ value, setValue ] = useState( defaultValue );

  return (
    <>
      <input
        type="hidden"
        id="theme"
        name="theme"
        value={ value }
      />
      <Select
        onValueChange={ setValue }
        value={ value || defaultValue }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          { themes
            .map( item => (
              <SelectItem
                key={ item.value }
                value={ item.value }
              >
                { item.label }
              </SelectItem>
            ) ) }
        </SelectContent>
      </Select>
    </>
  );
};
