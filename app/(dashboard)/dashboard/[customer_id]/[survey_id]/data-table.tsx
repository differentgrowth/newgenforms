"use client";

import { useState } from "react";

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table";
import { MixerHorizontalIcon, MixerVerticalIcon, TrashIcon } from "@radix-ui/react-icons";


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Columns } from "./columns";
import { AnswerInTable } from "@/definitions/answer";
import { deleteAnswerByClientId } from "@/app/actions";
import { useParams } from "next/navigation";
import { SubmitButton } from "@/components/buttons";

interface DataTableProps<TData, TValue> {
  columns: AnswerInTable[];
  data: AnswerInTable[];
}

export function DataTable<TData, TValue>( {
                                            columns,
                                            data
                                          }: DataTableProps<TData, TValue> ) {
  const params = useParams();
  const [ sorting, setSorting ] = useState<SortingState>( [] );
  const [ columnFilters, setColumnFilters ] = useState<ColumnFiltersState>( [] );
  const [ columnToFilter, setColumnToFilter ] = useState<string | undefined>( undefined );
  const [ columnVisibility, setColumnVisibility ] = useState<VisibilityState>( {} );
  const [ rowSelection, setRowSelection ] = useState<RowSelectionState>( {} );
  const table = useReactTable( {
                                 data,
                                 columns: Columns( columns ),
                                 getCoreRowModel: getCoreRowModel(),
                                 getPaginationRowModel: getPaginationRowModel(),
                                 getSortedRowModel: getSortedRowModel(),
                                 getFilteredRowModel: getFilteredRowModel(),
                                 onSortingChange: setSorting,
                                 onColumnFiltersChange: setColumnFilters,
                                 onColumnVisibilityChange: setColumnVisibility,
                                 onRowSelectionChange: setRowSelection,
                                 state: {
                                   sorting,
                                   columnFilters,
                                   columnVisibility,
                                   rowSelection
                                 }
                               } );

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-3">
        <div className="flex grow flex-row flex-wrap items-end justify-start gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[150px] justify-center capitalize"
              >
                <MixerVerticalIcon className="mr-2 size-4 shrink-0" />
                { columnToFilter || 'Filter' }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-full min-w-[150px] max-w-xs"
            >
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              { table
                .getAllColumns()
                .filter(
                  ( column ) =>
                    typeof column.accessorFn !== 'undefined' && column.getCanFilter()
                )
                .map( ( column ) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={ column.id }
                      className="capitalize"
                      checked={ columnToFilter === column.id }
                      onCheckedChange={ ( _value ) => setColumnToFilter( column.id ) }
                    >
                      { column.id }
                    </DropdownMenuCheckboxItem>
                  );
                } ) }
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            placeholder="Filter..."
            disabled={ !columnToFilter }
            value={ columnToFilter
                    ? table.getColumn( columnToFilter )
                           ?.getFilterValue() as string
                    : undefined }
            onChange={ ( event ) =>
              columnToFilter && table.getColumn( columnToFilter )
                                     ?.setFilterValue( event.target.value )
            }
            className="w-max grow"
          />

          <form
            action={ deleteAnswerByClientId.bind( null, table.getFilteredSelectedRowModel()
                                                             .rows
                                                             .map( item => item.original.client ) ) }
            className="grow sm:grow-0"
          >
            <input
              type="hidden"
              name="surveyId"
              value={ params.survey_id }
            />
            <input
              type="hidden"
              name="customerId"
              value={ params.customer_id }
            />
            <SubmitButton
              variant="outline"
              className="w-full"
              icon={ <TrashIcon /> }
              disabled={ table.getFilteredSelectedRowModel().rows.length === 0 }
            >
              Remove selected
            </SubmitButton>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[150px] justify-center capitalize"
              >
                <MixerHorizontalIcon className="mr-2 size-4 shrink-0" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[150px]"
            >
              <DropdownMenuLabel>Filter columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              { table
                .getAllColumns()
                .filter(
                  ( column ) =>
                    typeof column.accessorFn !== 'undefined' && column.getCanHide()
                )
                .map( ( column ) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={ column.id }
                      className="capitalize"
                      checked={ column.getIsVisible() }
                      onCheckedChange={ ( value ) => column.toggleVisibility( value ) }
                    >
                      { column.id }
                    </DropdownMenuCheckboxItem>
                  );
                } ) }
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="text-muted-foreground flex-1 text-sm">
        { table.getFilteredSelectedRowModel().rows.length } of{ " " }
        { table.getFilteredRowModel().rows.length } row(s) selected.
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            { table.getHeaderGroups()
                   .map( ( headerGroup ) => (
                     <TableRow key={ headerGroup.id }>
                       { headerGroup.headers.map(
                         ( header ) => (
                           <TableHead key={ header.id }>
                             { header.isPlaceholder
                               ? null
                               : flexRender(
                                 header.column.columnDef.header,
                                 header.getContext()
                               ) }
                           </TableHead>
                         )
                       ) }
                     </TableRow>
                   ) ) }
          </TableHeader>
          <TableBody>
            { table.getRowModel().rows?.length
              ? (
                table.getRowModel()
                     .rows
                     .map( ( row ) => (
                       <TableRow
                         key={ row.id }
                         data-state={ row.getIsSelected() && 'selected' }
                       >
                         { row.getVisibleCells()
                              .map( ( cell ) => (
                                <TableCell
                                  key={ cell.id }
                                  className={ cn(
                                    cell.column.id === 'actions' && 'mr-0 flex justify-end',
                                    cell.column.id === 'id' && 'ml-0 w-14 font-mono',
                                    'max-w-[200px] truncate'
                                  ) }
                                >
                                  { flexRender( cell.column.columnDef.cell, cell.getContext() ) }
                                </TableCell>
                              ) ) }
                       </TableRow>
                     ) )
              )
              : (
                <TableRow>
                  <TableCell
                    colSpan={ columns.length }
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              ) }
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-1.5 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={ () => table.previousPage() }
          disabled={ !table.getCanPreviousPage() }
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={ () => table.nextPage() }
          disabled={ !table.getCanNextPage() }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
