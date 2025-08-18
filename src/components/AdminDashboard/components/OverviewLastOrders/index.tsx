'use client'
'use no memo'
// TODO: delete use no memo after Tanstack react-table bump to react 19

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import axios from 'axios'
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { type Where } from 'payload'
import { stringify } from 'qs-esm'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type Order } from '@/payload-types'
import { formatPrice } from '@/utilities/formatPrices'
import { Input } from '@/components/ui/input'

const select = {
  id: true,
  createdAt: true,
  customer: true,
  items: {
    id: true,
  },
  shippingAddress: {
    email: true,
  },
  status: true,
  total: true,
}

export const OverviewLastOrders = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1

  const columns: ColumnDef<Order>[] = [
    {
      id: 'date',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="px-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date
            <ArrowUpDown width={14} height={14} className="ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt)
        return date.toLocaleDateString()
      },
    },
    {
      id: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="px-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Status
            <ArrowUpDown width={14} height={14} className="ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <p>{row.original.status}</p>
      },
    },
    {
      id: 'email',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="px-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <ArrowUpDown width={14} height={14} className="ml-2" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{row.original.shippingAddress.email}</div>,
    },
    {
      id: 'amount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          className="px-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Amount
          <ArrowUpDown width={14} height={14} className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = row.original.total

        const formatted = formatPrice(amount, 'NPR')

        return <div>{formatted}</div>
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open Menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
                Copy Order Id
              </DropdownMenuItem>
              {order.customer && (
                <DropdownMenuItem>
                  <Link
                    href={`/admin/collections/customers/${typeof order.customer === 'string' ? order.customer : order.customer.id}`}
                    className="no-underline"
                  >
                    View Customer
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={`/admin/collections/orders/${order.id}`} className="no-underline">
                  View Order
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    return params.toString()
  }

  const handlePaginationChange = (page: number) => {
    router.push(`?${createQueryString('page', page.toString())}`, { scroll: false })
  }

  const [data, setData] = useState<Order[]>([])

  useEffect(() => {
    const filteringQuery: Where = {
      'shippingAddress.email': {
        contains: columnFilters.find((filter) => filter.id === 'email')?.value,
      },
    }

    const sortingQuery = sorting.map((sort) => {
      switch (sort.id) {
        case 'status': {
          return sort.desc ? '-orderDetails.status' : 'orderDetails.status'
        }
        case 'email': {
          return sort.desc ? '-shippingAddress.email' : 'shippingAddress.email'
        }
        case 'date': {
          return sort.desc ? '-createdAt' : 'createdAt'
        }
      }
    })

    const stringifiedQuery = stringify(
      {
        select,
        limit: 6,
        page: currentPage,
        sort: sortingQuery.length === 1 ? sortingQuery[0] : sortingQuery,
        where: filteringQuery,
      },
      { addQueryPrefix: true },
    )

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get<{ docs: Order[] }>(`/api/orders${stringifiedQuery}`, {
          withCredentials: true,
        })
        setData(data.docs)
      } catch (error) {
        console.log(error)
      }
    }
    void fetchOrders()
  }, [currentPage, sorting, columnFilters])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  return (
    <Card className="lg:col-span-3 bg-transparent">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex items-center py-4">
            <div className="">
              <Input
                placeholder="Filter Emails"
                value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
                onChange={(event) => {
                  table.getColumn('email')?.setFilterValue(event.target.value)
                }}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto">
                  Columns
                  <ChevronDown className="ml-2" width={14} height={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="hover:bg-payload-elevation-0 cursor-pointer text-base capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <Table className="text-base">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePaginationChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePaginationChange(currentPage + 1)}
              disabled={data.length < 6}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
