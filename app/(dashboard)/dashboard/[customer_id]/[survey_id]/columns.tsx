'use client';

import { useRouter } from 'next/navigation';

import { Column, ColumnDef } from '@tanstack/react-table';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CaretSortIcon,
  CopyIcon,
  DotsHorizontalIcon,
  EyeNoneIcon
} from '@radix-ui/react-icons';
import { format } from "date-fns-tz";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { QUESTION_TYPE } from '@/definitions/question';
import { AnswerInTable } from "@/definitions/answer";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

function ColumnHeader<TData, TValue>( {
                                        column,
                                        title,
                                        className
                                      }: DataTableColumnHeaderProps<TData, TValue> ) {
  if ( !column.getCanSort() ) {
    return <div
      className={ cn(
        'first-letter:uppercase',
        column.id === 'id' && 'font-mono',
        className
      ) }
    >
      { title }
    </div>;
  }

  return (
    <div className={ cn( 'flex items-center space-x-1.5', className ) }>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="data-[state=open]:bg-accent -ml-3 h-8"
          >
            <span className="first-letter:uppercase">{ title }</span>
            { column.getIsSorted() === 'desc'
              ? (
                <ArrowDownIcon className="ml-1.5 size-4" />
              )
              : column.getIsSorted() === 'asc'
                ? (
                  <ArrowUpIcon className="ml-1.5 size-4" />
                )
                : (
                  <CaretSortIcon className="ml-1.5 size-4" />
                ) }
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={ () => column.toggleSorting( false ) }>
            <ArrowUpIcon className="text-muted-foreground/70 mr-1.5 size-3.5" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={ () => column.toggleSorting( true ) }>
            <ArrowDownIcon className="text-muted-foreground/70 mr-1.5 size-3.5" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={ () => column.toggleVisibility( false ) }>
            <EyeNoneIcon className="text-muted-foreground/70 mr-1.5 size-3.5" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}


export const Columns = ( columns: AnswerInTable[] ): ColumnDef<AnswerInTable>[] => {
  const { push } = useRouter();
  const dataColumns: ColumnDef<AnswerInTable>[] =
    columns
      .toSorted( ( a, b ) => a.order > b.order
                             ? 1
                             : -1 )
      .map( item => ( {
        id: item.register_name,
        accessorKey: item.register_name,
        header: ( { column } ) => (
          <ColumnHeader
            column={ column }
            title={ item.register_name }
          />
        ),
        enableColumnFilter: item.type !== QUESTION_TYPE.LONG_TEXT,
        enableSorting: item.type !== QUESTION_TYPE.LONG_TEXT
      } ) );

  return [
    {
      id: 'select',
      header: ( { table } ) => (
        <Checkbox
          checked={ table.getIsAllPageRowsSelected() }
          onCheckedChange={ ( value ) => table.toggleAllPageRowsSelected( !!value ) }
          aria-label="Select all"
        />
      ),
      cell: ( { row } ) => (
        <Checkbox
          checked={ row.getIsSelected() }
          onCheckedChange={ ( value ) => row.toggleSelected( !!value ) }
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: false
    },
    {
      id: 'id',
      accessorKey: 'id',
      header: ( { column } ) => (
        <ColumnHeader
          column={ column }
          title="ID"
        />
      ),
      cell: info => ( info.renderValue() as string ).slice( 0, 5 )
                                                    .padEnd( 8, '.' ),
      enableSorting: false,
      enableHiding: true,
      enableColumnFilter: true
    },
    ...dataColumns,
    {
      id: 'created_at',
      accessorKey: 'created_at',
      header: ( { column } ) => (
        <ColumnHeader
          column={ column }
          title="Created at"
        />
      ),
      cell: info => format( new Date( info.renderValue() as string ), "LLL dd, y - HH:mm", { timeZone: columns[ 0 ].timezone } ),
      enableSorting: true,
      enableHiding: true,
      enableColumnFilter: false
    },
    {
      id: 'actions',
      cell: ( { row } ) => {
        const data = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
              >
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={ () => navigator.clipboard.writeText( data.id ) }>
                Copy ID
                <CopyIcon className="ml-1.5 size-4" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={ () => push( `/dashboard/${ data.customerId }/${ data.surveyId }/${ data.client }` ) }>
                View response
                <ArrowRightIcon className="ml-1.5 size-4" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
      size: 32
    }
  ];
};
