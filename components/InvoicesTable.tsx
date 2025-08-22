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
  id: z.string(),
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
          <h1 className="text-sm">{row.original.client}</h1>
        
      </div>
    ),
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 text-muted-foreground text-white border border-white">
          {row.original.company}
        </Badge>
      </div>
    ),
  },
  {
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
    cell: ({ row }) => (
      <div className="w-40">
        {typeof row.original.projects === "string"
          ? row.original.projects
          : Array.isArray(row.original.projects)
            ? row.original.projects.join(", ")
            : ""}
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const statusColors: Record<string, string> = {
        active: "border-green-500/20 bg-green-500/10 text-green-400",
        inactive: "border-red-500/20 bg-red-500/10 text-red-400",
        archived: "border-orange-500/20 bg-orange-500/10 text-orange-400",
      };

      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center justify-center gap-1 px-3 py-1 w-fit [&_svg]:size-3 ${statusColors[status] || "bg-purple-100 text-purple-800"
            }`}
        >
          <span className="text-xs whitespace-nowrap">{status}</span>
        </Badge>
      );
    },
  },



  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;
      const setModalClientId = React.useContext(ModalClientIdContext)?.setModalClientId;

      const handleEdit = () => {
        if (router) {
          router.push(`/admin/clients/edit-client?id=${id}`);
        } else if (typeof window !== 'undefined') {
          window.location.href = `/admin/clients/edit-client?id=${id}`;
        }
      };

      return (
        <>
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
              <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setModalClientId && setModalClientId(id)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
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

// Context for modal client id
const ModalClientIdContext = React.createContext<{
  modalClientId: string | null;
  setModalClientId: (id: string | null) => void;
} | null>(null);

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  React.useEffect(() => {
    console.log('DataTable received data:', initialData);
  }, [initialData]);

  const data = initialData;
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
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

  // Modal state for delete confirmation
  const [modalClientId, setModalClientId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Find the client row for modal
  const modalClient = modalClientId ? data.find((c) => c.id === modalClientId) : null;

  async function handleDelete() {
    if (!modalClientId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/clients/${modalClientId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete client');
      toast.success('Client deleted successfully');
      setModalClientId(null);
      if (typeof window !== 'undefined') window.location.reload();
    } catch (err) {
      const message = err && typeof err === 'object' && 'message' in err ? (err as any).message : 'Error deleting client';
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCancel() {
    setModalClientId(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    return;
  }

  return (
    <ModalClientIdContext.Provider value={{ modalClientId, setModalClientId }}>
      <div className="w-full space-y-4">
        <Tabs
          defaultValue="outline"
          className="w-full"
        >
          {/* Toolbar Section - Hidden for now but can be enabled */}
          <div className="flex items-center justify-between mb-4">
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
            className="space-y-4"
          >
            {/* Glassmorphism Table Container */}
            <div className="rounded-xl border border-white/10 shadow-2xl overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 3px 3px 0 rgba(31, 38, 135, 0.37)'
              }}>
              <div className="overflow-x-auto">
                <DndContext
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={handleDragEnd}
                  sensors={sensors}
                  id={sortableId}
                >
                  <Table>
                    <TableHeader
                      className="sticky top-0 z-10"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(15px)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
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
                    <TableBody>
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
                            className="h-24 text-center text-white/60"
                            style={{
                              background: 'rgba(255, 255, 255, 0.02)'
                            }}
                          >
                            No results found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </DndContext>
              </div>
            </div>

            {/* Enhanced Glassmorphism Pagination Section */}
            <div className="rounded-xl border border-white/10 p-4"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)'
              }}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Selection Info */}
                <div className="flex-1 text-sm text-white/70">
                  <span className="hidden sm:inline">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                  </span>
                  <span className="sm:hidden">
                    {table.getFilteredSelectedRowModel().rows.length}/{table.getFilteredRowModel().rows.length} selected
                  </span>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  {/* Rows per page */}
                  <div className="flex items-center gap-2">
                    <Label htmlFor="rows-per-page" className="text-sm font-medium whitespace-nowrap text-white/80">
                      <span className="hidden sm:inline">Rows per page</span>
                      <span className="sm:hidden">Per page</span>
                    </Label>
                    <Select
                      value={`${table.getState().pagination.pageSize}`}
                      onValueChange={(value) => {
                        table.setPageSize(Number(value))
                      }}
                    >
                      <SelectTrigger className="w-20 bg-white/5 border-white/20 text-white hover:bg-white/10" id="rows-per-page">
                        <SelectValue
                          placeholder={table.getState().pagination.pageSize}
                        />
                      </SelectTrigger>
                      <SelectContent side="top" className="bg-black/80 border-white/20 backdrop-blur-xl">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`} className="text-white hover:bg-white/10">
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Page info */}
                  <div className="flex items-center justify-center text-sm font-medium text-white/80">
                    <span className="hidden sm:inline">
                      Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                    <span className="sm:hidden">
                      {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
                    </span>
                  </div>

                  {/* Navigation buttons with glassmorphism */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      className="hidden h-8 w-8 p-0 sm:flex bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span className="sr-only">Go to first page</span>
                      <ChevronsLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span className="sr-only">Go to previous page</span>
                      <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      <span className="sr-only">Go to next page</span>
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="hidden h-8 w-8 p-0 sm:flex bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-200"
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      disabled={!table.getCanNextPage()}
                    >
                      <span className="sr-only">Go to last page</span>
                      <ChevronsRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Modal rendered at root via portal */}
        {typeof window !== 'undefined' && modalClientId && modalClient && (
          (() => {
            // Import ReactDOM only on client
            const ReactDOM = require('./ReactDOMClientFix').default;
            return ReactDOM && ReactDOM.createPortal(
              <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ pointerEvents: 'auto', background: 'var(--body-bg, rgba(16,18,27,0.85))' }}>
                <div
                  className="rounded-lg p-6 w-full max-w-xs flex flex-col items-center border border-white/20 relative"
                  style={{
                    zIndex: 10000,
                    pointerEvents: 'auto',
                    background: 'var(--body-bg, #10121b)',
                    backdropFilter: 'none',
                    boxShadow: 'none',
                  }}
                >
                  <h3 className="text-lg font-semibold mb-2 text-center">Delete Client?</h3>
                  <p className="text-sm text-neutral-300 mb-4 text-center">Are you sure you want to delete this client? This action cannot be undone.</p>
                  <div className="flex gap-2 w-full">
                    <Button className="flex-1" variant="destructive" style={{ zIndex: 10001 }} onClick={handleDelete} disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete'}</Button>
                    <Button className="flex-1" variant="outline" style={{ zIndex: 10001 }} onClick={handleCancel} disabled={isDeleting}>Cancel</Button>
                  </div>
                </div>
              </div>, document.body
            );
          })()
        )}
      </div>
    </ModalClientIdContext.Provider>
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


