"use client"

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  CheckCircle2Icon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  GripVerticalIcon,
  LoaderIcon,
  MoreVerticalIcon,
  PlusIcon,
  TrendingUpIcon,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export const schema = z.object({
  id: z.number(),
  client: z.string(),
  company: z.string(),
  email: z.string(),
  phone: z.string(),
  projects: z.array(z.string()),
  status: z.string(),
})



const columns: ColumnDef<z.infer<typeof schema>>[] = [

  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center mx-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => (
      <div className="w-20">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.client}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.company}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => (
      <div className="w-46">
        <p className="font-medium">{row.original.email}</p>
        <p className="font-light">{row.original.phone}</p>
      </div>
    ),
  },
  {
    accessorKey: "projects",
    header: "Projects",
    cell: ({ row }) => {
      const colors = [
        "bg-blue-100 text-blue-800",
        "bg-green-100 text-green-800",
        "bg-purple-100 text-purple-800",
        "bg-pink-100 text-pink-800",
        "bg-yellow-100 text-yellow-800",
      ];

      return (
        <div className="flex flex-wrap gap-1 w-40">
          {row.original.projects.map((project: string, index: number) => (
            <Badge
              key={index}
              variant="outline"
              className={`px-1.5 ${colors[index % colors.length]}`}
            >
              {project}
            </Badge>
          ))}
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const statusColors: Record<string, string> = {
        Done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-none",
        Pending: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300 border-none",
        Active: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-none",
        Completed: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-none",
      };

      return (
        <Badge
          variant="outline"
          className={`flex gap-1 px-1.5 [&_svg]:size-3 ${statusColors[status] || "bg-gray-100 text-gray-800"
            }`}
        >
          {status === "Done" ? (
            <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
          ) : (
            <LoaderIcon className="text-yellow-500 dark:text-yellow-400 animate-spin" />
          )}
          {status}
        </Badge>
      );
    },
  },



  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
            size="icon"
          >
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <Tabs
      defaultValue="outline"
      className="flex flex-col justify-start"
      >
      <div className="flex items-center justify-between">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        
        
        <div className="justify-end hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <PlusIcon />
            <span className="hidden lg:inline">Add Section</span>
          </Button>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto"
        >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      
    </Tabs>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

//function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
//  const isMobile = useIsMobile()
//
//  return (
//    <Sheet>
//      <SheetTrigger asChild>
//        <Button variant="link" className="w-fit px-0 text-left text-foreground">
//          {item.header}
//        </Button>
//      </SheetTrigger>
//      <SheetContent side="right" className="flex flex-col">
//        <SheetHeader className="gap-1">
//          <SheetTitle>{item.header}</SheetTitle>
//          <SheetDescription>
//            Showing total visitors for the last 6 months
//          </SheetDescription>
//        </SheetHeader>
//        <div className="flex flex-1 flex-col gap-4 overflow-y-auto py-4 text-sm">
//          {!isMobile && (
//            <>
//              <ChartContainer config={chartConfig}>
//                <AreaChart
//                  accessibilityLayer
//                  data={chartData}
//                  margin={{
//                    left: 0,
//                    right: 10,
//                  }}
//                >
//                  <CartesianGrid vertical={false} />
//                  <XAxis
//                    dataKey="month"
//                    tickLine={false}
//                    axisLine={false}
//                    tickMargin={8}
//                    tickFormatter={(value) => value.slice(0, 3)}
//                    hide
//                  />
//                  <ChartTooltip
//                    cursor={false}
//                    content={<ChartTooltipContent indicator="dot" />}
//                  />
//                  <Area
//                    dataKey="mobile"
//                    type="natural"
//                    fill="var(--color-mobile)"
//                    fillOpacity={0.6}
//                    stroke="var(--color-mobile)"
//                    stackId="a"
//                  />
//                  <Area
//                    dataKey="desktop"
//                    type="natural"
//                    fill="var(--color-desktop)"
//                    fillOpacity={0.4}
//                    stroke="var(--color-desktop)"
//                    stackId="a"
//                  />
//                </AreaChart>
//              </ChartContainer>
//              <Separator />
//              <div className="grid gap-2">
//                <div className="flex gap-2 font-medium leading-none">
//                  Trending up by 5.2% this month{" "}
//                  <TrendingUpIcon className="size-4" />
//                </div>
//                <div className="text-muted-foreground">
//                  Showing total visitors for the last 6 months. This is just
//                  some random text to test the layout. It spans multiple lines
//                  and should wrap around.
//                </div>
//              </div>
//              <Separator />
//            </>
//          )}
//          <form className="flex flex-col gap-4">
//            <div className="flex flex-col gap-3">
//              <Label htmlFor="header">Header</Label>
//              <Input id="header" defaultValue={item.header} />
//            </div>
//            <div className="grid grid-cols-2 gap-4">
//              <div className="flex flex-col gap-3">
//                <Label htmlFor="type">Type</Label>
//                <Select defaultValue={item.type}>
//                  <SelectTrigger id="type" className="w-full">
//                    <SelectValue placeholder="Select a type" />
//                  </SelectTrigger>
//                  <SelectContent>
//                    <SelectItem value="Table of Contents">
//                      Table of Contents
//                    </SelectItem>
//                    <SelectItem value="Executive Summary">
//                      Executive Summary
//                    </SelectItem>
//                    <SelectItem value="Technical Approach">
//                      Technical Approach
//                    </SelectItem>
//                    <SelectItem value="Design">Design</SelectItem>
//                    <SelectItem value="Capabilities">Capabilities</SelectItem>
//                    <SelectItem value="Focus Documents">
//                      Focus Documents
//                    </SelectItem>
//                    <SelectItem value="Narrative">Narrative</SelectItem>
//                    <SelectItem value="Cover Page">Cover Page</SelectItem>
//                  </SelectContent>
//                </Select>
//              </div>
//              <div className="flex flex-col gap-3">
//                <Label htmlFor="status">Status</Label>
//                <Select defaultValue={item.status}>
//                  <SelectTrigger id="status" className="w-full">
//                    <SelectValue placeholder="Select a status" />
//                  </SelectTrigger>
//                  <SelectContent>
//                    <SelectItem value="Done">Done</SelectItem>
//                    <SelectItem value="In Progress">In Progress</SelectItem>
//                    <SelectItem value="Not Started">Not Started</SelectItem>
//                  </SelectContent>
//                </Select>
//              </div>
//            </div>
//            <div className="grid grid-cols-2 gap-4">
//              <div className="flex flex-col gap-3">
//                <Label htmlFor="target">Target</Label>
//                <Input id="target" defaultValue={item.target} />
//              </div>
//              <div className="flex flex-col gap-3">
//                <Label htmlFor="limit">Limit</Label>
//                <Input id="limit" defaultValue={item.limit} />
//              </div>
//            </div>
//            <div className="flex flex-col gap-3">
//              <Label htmlFor="reviewer">Reviewer</Label>
//              <Select defaultValue={item.reviewer}>
//                <SelectTrigger id="reviewer" className="w-full">
//                  <SelectValue placeholder="Select a reviewer" />
//                </SelectTrigger>
//                <SelectContent>
//                  <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
//                  <SelectItem value="Jamik Tashpulatov">
//                    Jamik Tashpulatov
//                  </SelectItem>
//                  <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
//                </SelectContent>
//              </Select>
//            </div>
//          </form>
//        </div>
//        <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
//          <Button className="w-full">Submit</Button>
//          <SheetClose asChild>
//            <Button variant="outline" className="w-full">
//              Done
//            </Button>
//          </SheetClose>
//        </SheetFooter>
//      </SheetContent>
//    </Sheet>
//  )
//}


