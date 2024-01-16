'use client';

import { useState } from "react";
import { notFound } from "next/navigation";

import * as SliderPrimitive from '@radix-ui/react-slider';
import { CheckedState } from "@radix-ui/react-checkbox";
import { AnnoyedIcon, FrownIcon, LaughIcon, MehIcon, SmileIcon } from 'lucide-react';
import { CaretSortIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, hours, minutes } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { OptionInQuestion } from "@/definitions/question";
import { countries } from "@/lib/countries";

const feedbackOptions = [
  {
    id: 0,
    value: 1,
    icon: AnnoyedIcon
  },
  {
    id: 1,
    value: 2,
    icon: FrownIcon
  },
  {
    id: 2,
    value: 3,
    icon: LaughIcon
  },
  {
    id: 3,
    value: 4,
    icon: MehIcon
  },
  {
    id: 4,
    value: 5,
    icon: SmileIcon
  }
];

export const ButtonsGroupQuestion = ( { label, options }: {
  label: string;
  options: OptionInQuestion[]
} ) => {
  const [ value, setValue ] = useState( '' );

  if ( !options.length ) {
    notFound();
  }

  return (
    <>
      <input
        type="hidden"
        id="value"
        name="value"
        value={ value }
      />
      <Label htmlFor="value">{ label }</Label>
      <div
        className={ cn(
          "flex flex-row flex-wrap justify-center space-x-1.5"
        ) }
      >
        { options?.map( option => (
          <Button
            type="button"
            variant={ value === option.value
                      ? 'default'
                      : 'outline' }
            aria-label="option"
            onClick={ () => setValue( option.value ) }
            key={ option.id }
          >
            { option.value }
          </Button>
        ) ) }
      </div>
    </>
  );
};

export const CheckboxQuestion = ( { label }: {
  label: string
} ) => {
  const [ value, setValue ] = useState( false );
  return (
    <div className="flex items-center space-x-1.5">
      <input
        type="hidden"
        id="value"
        name="value"
        value={ value
                ? 'on'
                : 'off' }
      />
      <Switch
        id="value"
        name="switch"
        defaultChecked={ value }
        onCheckedChange={ setValue }
      />
      <Label htmlFor="switch">{ label }</Label>
    </div>
  );
};

export const DatePickerQuestion = ( { label }: {
  label: string
} ) => {
  const [ date, setDate ] = useState<Date | undefined>( new Date() );

  return (
    <>
      <input
        type="hidden"
        id="value"
        name="value"
        value={ date?.toISOString() }
      />
      <Label htmlFor="value">{ label }</Label>
      <Calendar
        mode="single"
        selected={ date }
        onSelect={ setDate }
        className="mx-auto rounded-md border"
      />
    </>
  );
};

export const DropdownListQuestion = ( { label, options }: {
  label: string;
  options: OptionInQuestion[]
} ) => {
  const [ value, setValue ] = useState( '' );

  return (
    <>
      <input
        type="hidden"
        id="value"
        name="value"
        value={ value }
      />
      <Label htmlFor="value">{ label }</Label>
      <Select
        onValueChange={ setValue }
        value={ value }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select one" />
        </SelectTrigger>
        <SelectContent>
          { options
            .map( item => (
              <SelectItem
                key={ item.id }
                value={ item.value }
              >
                { item.value }
              </SelectItem>
            ) ) }
        </SelectContent>
      </Select>
    </>
  );
};

export const EmailQuestion = ( { label }: {
  label: string;
} ) => {
  return (
    <>
      <Label htmlFor="value">{ label }</Label>
      <Input
        id="value"
        name="value"
        type="email"
        inputMode="email"
        placeholder="me@email.com"
      />
    </>
  );
};

export const FeedbackQuestion = ( { label }: {
  label: string
} ) => {
  const [ value, setValue ] = useState( 3 );
  return (
    <>
      <input
        type="hidden"
        id="value"
        name="value"
        value={ value }
      />
      <Label htmlFor="value">{ label }</Label>
      <div
        className={ cn(
          "flex justify-center space-x-1.5"
        ) }
      >
        { feedbackOptions.map( option => (
          <Button
            type="button"
            size="icon"
            variant={ value === option.value
                      ? 'default'
                      : 'outline' }
            aria-label="option"
            onClick={ () => setValue( option.value ) }
            key={ option.id }
          >
            <option.icon className="stroke-1.5 size-4" />
          </Button>
        ) ) }
      </div>
    </>
  );
};

export const LongTextQuestion = ( { label }: {
  label: string
} ) => {
  return (
    <>
      <Label htmlFor="value">{ label }</Label>
      <Textarea
        id="value"
        name="value"
        placeholder="..."
        rows={ 7 }
      />
    </>
  );
};

export const MultipleSelectionQuestion = ( { label, options }: {
  label: string;
  options: OptionInQuestion[];
} ) => {
  const [ value, setValue ] = useState<string[]>( [] );

  const handleValue = ( { checked, optionValue }: {
    checked: CheckedState,
    optionValue: string;
  } ) => {
    if ( checked ) {
      setValue( prev => ( [
        ...prev,
        optionValue
      ] ) );
    } else {
      setValue( prev => prev.filter( val => val !== optionValue ) );
    }
  };

  if ( !options.length ) {
    notFound();
  }

  return (
    <>
      <input
        type="hidden"
        id="value"
        name="value"
        value={ value.join( 'ngf|-|ngf' ) }
      />
      <Label htmlFor="value">{ label }</Label>
      <div
        className={ cn(
          "grid grid-cols-1 gap-1.5",
          "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        ) }
      >
        { options?.map( option => (
          <div
            className="flex items-center space-x-1.5"
            key={ option.id }
          >
            <Checkbox
              id={ option.id }
              onCheckedChange={ checked => handleValue( { checked, optionValue: option.value } ) }
            />
            <Label htmlFor={ option.id }>{ option.value }</Label>
          </div>
        ) ) }
      </div>
    </>
  );
};

export const NumberQuestion = ( { label, step, min, max }: {
  label: string;
  step: number | null;
  min: number | null;
  max: number | null;
} ) => {
  const [ value, setValue ] = useState( '0' );

  return (
    <>
      <Label htmlFor="value">{ label }</Label>
      <div className="flex w-full items-center space-x-1.5">
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={ () => setValue( prev => Math.max( +prev - ( step ?? 1 ), ( min ?? -Infinity ) )
                                                .toString() ) }
        >
          <ChevronDownIcon className="size-4" />
        </Button>
        <Input
          id="value"
          name="value"
          type="text"
          inputMode="numeric"
          min={ min ?? -Infinity }
          max={ max ?? Infinity }
          step={ step ?? 1 }
          placeholder="0..."
          value={ value }
          onChange={ ( event ) => setValue( event.target.value.replace( /\D/g, '' ) ) }
        />
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={ () => setValue( prev => Math.min( +prev + ( step ?? 1 ), ( max ?? Infinity ) )
                                                .toString() ) }
        >
          <ChevronUpIcon className="size-4" />
        </Button>
      </div>
    </>
  );
};

export const PhoneQuestion = ( { label }: {
  label: string;
} ) => {
  const [ open, setOpen ] = useState( false );
  const [ value, setValue ] = useState( { dial_code: '+34', phone: '' } );

  return (
    <>
      <input
        type="hidden"
        id="value"
        name="value"
        value={ `${ value.dial_code } ${ value.phone }` }
      />
      <Label htmlFor="value">{ label }</Label>
      <div className="mx-auto flex w-full max-w-lg space-x-1.5">
        <Popover
          open={ open }
          onOpenChange={ setOpen }
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={ open }
              className="w-[100px] justify-between"
            >
              { value.dial_code
                ? countries.find( ( country ) => country.dial_code === value.dial_code )?.name
                : "Select country..." }
              <CaretSortIcon className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                { countries.map( ( country ) => (
                  <CommandItem
                    key={ country.code }
                    value={ country.name }
                    onSelect={ () => {
                      setValue( prev => ( { ...prev, dial_code: country.dial_code } ) );
                      setOpen( false );
                    } }
                  >
                    <CheckIcon
                      className={ cn(
                        "mr-2 size-4",
                        value.dial_code === country.dial_code
                        ? "opacity-100"
                        : "opacity-0"
                      ) }
                    />
                    { country.name }
                  </CommandItem>
                ) ) }
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          placeholder="..."
          className="grow"
          onChange={ ( event ) => setValue( prev => ( { ...prev, phone: event.target.value } ) ) }
        />
      </div>
    </>
  );
};

export const RangeQuestion = ( { label, step, min, max }: {
  label: string;
  step: number | null;
  min: number | null;
  max: number | null;
} ) => {
  const [ value, setValue ] = useState<number[]>( [
                                                    Math.max( min ?? 0, 0 ),
                                                    Math.min( max ?? 100, 100 )
                                                  ] );

  return (
    <>
      <input
        type="hidden"
        id="value"
        name="value"
        value={ value.join( 'ngf|-|ngf' ) }
      />
      <Label htmlFor="value">
        { label }
      </Label>
      <SliderPrimitive.Root
        className="relative flex w-full touch-none select-none items-center"
        min={ Math.max( min ?? 0, 0 ) }
        max={ Math.min( max ?? 100, 100 ) }
        step={ step ?? 1 }
        value={ value }
        onValueChange={ ( values ) => setValue( values ) }
      >
        <SliderPrimitive.Track className="bg-primary/10 relative h-1.5 w-full grow overflow-hidden rounded-full">
          <SliderPrimitive.Range className="bg-primary absolute h-full" />
        </SliderPrimitive.Track>

        <TooltipProvider>
          <Tooltip
            defaultOpen
            open={ true }
          >
            <TooltipTrigger asChild>
              <SliderPrimitive.Thumb
                className={ cn(
                  'border-primary/50 bg-background focus-visible:ring-ring block size-4 rounded-full border shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50'
                ) }
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{ value[ 0 ] }</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip
            defaultOpen
            open={ true }
          >
            <TooltipTrigger asChild>
              <SliderPrimitive.Thumb
                className={ cn(
                  'border-primary/50 bg-background focus-visible:ring-ring block size-4 rounded-full border shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50'
                ) }
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{ value[ 1 ] }</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SliderPrimitive.Root>
    </>
  );
};

export const RatingQuestion = ( { label }: {
  label: string
} ) => {
  const [ value, setValue ] = useState( 3 );
  return (
    <>
      <input
        type="hidden"
        id="value"
        name="value"
        value={ value }
      />
      <Label htmlFor="value">{ label }</Label>
      <div
        className={ cn(
          "flex justify-center space-x-1.5"
        ) }
      >
        { Array.from( { length: 5 } )
               .map( ( _, index ) => (
                 <Button
                   type="button"
                   size="icon"
                   variant={ value === index + 1
                             ? 'default'
                             : 'outline' }
                   aria-label="option"
                   className="font-mono"
                   onClick={ () => setValue( index + 1 ) }
                   key={ index }
                 >
                   { index + 1 }
                 </Button>
               ) ) }
      </div>
    </>
  );
};

export const SingleSelectionQuestion = ( { label, options }: {
  label: string;
  options: OptionInQuestion[];
} ) => {
  const [ value, setValue ] = useState( '' );

  if ( !options ) {
    notFound();
  }

  return (
    <>
      <input
        type="hidden"
        id="value"
        name="value"
        value={ value }
      />
      <Label htmlFor="value">{ label }</Label>
      <RadioGroup onValueChange={ setValue }>
        { options?.map( option => (
          <div
            key={ option.id }
            className="flex items-center space-x-1.5"
          >
            <RadioGroupItem
              value={ option.value }
              id={ option.id }
            />
            <Label htmlFor={ option.id }>{ option.value }</Label>
          </div>
        ) ) }
      </RadioGroup>
    </>
  );
};

export const SliderQuestion = ( { label, step, min, max }: {
  label: string;
  step: number | null;
  min: number | null;
  max: number | null;
} ) => {
  const [ value, setValue ] = useState( [ Math.min( max ?? 100, 100 ) ] );

  return (
    <>
      <input
        type="hidden"
        id="value"
        name="value"
        value={ value.join( 'ngf|-|ngf' ) }
      />
      <Label htmlFor="value">
        { label }
      </Label>
      <Slider
        defaultValue={ [ 66 ] }
        min={ Math.max( min ?? 0, 0 ) }
        max={ Math.min( max ?? 100, 100 ) }
        step={ step ?? 1 }
        value={ value }
        onValueChange={ setValue }
      />
    </>
  );
};

export const TextQuestion = ( { label }: {
  label: string;
} ) => {
  return (
    <>
      <Label htmlFor="value">{ label }</Label>
      <Input
        id="value"
        name="value"
        type="text"
        placeholder="..."
      />
    </>
  );
};

export const TimePickerQuestion = ( { label }: {
  label: string
} ) => {
  const [ value, setValue ] = useState( { hours: '00', minutes: '00' } );

  return (
    <>
      <input
        type="hidden"
        id="value"
        name="value"
        value={ `${ value.hours }:${ value.minutes }` }
      />
      <Label htmlFor="value">{ label }</Label>
      <div className="mx-auto flex w-full max-w-lg space-x-1.5">
        <Select
          onValueChange={ ( val ) => setValue( prev => ( { ...prev, hour: val } ) ) }
          value={ value.hours }
        >
          <SelectTrigger className="grow">
            <SelectValue placeholder="00" />
          </SelectTrigger>
          <SelectContent>
            { hours.map( item => (
              <SelectItem
                key={ item }
                value={ item }
              >
                { item }
              </SelectItem>
            ) )
            }
          </SelectContent>
        </Select>
        <span>
          :
        </span>
        <Select
          onValueChange={ ( val ) => setValue( prev => ( { ...prev, minutes: val } ) ) }
          value={ value.minutes }
        >
          <SelectTrigger className="grow">
            <SelectValue placeholder="00" />
          </SelectTrigger>
          <SelectContent>
            { minutes.map( item => (
              <SelectItem
                key={ item }
                value={ item }
              >
                { item }
              </SelectItem>
            ) )
            }
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
