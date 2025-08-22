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
    Calendar1Icon,
    CheckCircle2Icon,
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    ColumnsIcon,
    FileIcon,
    FolderIcon,
    GripVerticalIcon,
    LoaderIcon,
    MoreVerticalIcon,
    PlusIcon,
    TrendingUpIcon,
    User2Icon,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
// import "sonner/style.css"; // Not needed for latest sonner, handled automatically
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


// Extend schema to include project and client as objects (populated from backend)
export const schema = z.object({
    _id: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    billable: z.boolean(),
    totalHours: z.number(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    project: z
        .object({
            _id: z.string().optional(),
            name: z.string().optional(),
            status: z.string().optional(),
            budget: z.number().optional(),
            description: z.string().optional(),
            deadline: z.string().optional(),
            progress: z.string().optional(),
            team: z.array(z.string()).optional(),
            priority: z.string().optional(),
        })
        .optional(),
    client: z
        .object({
            _id: z.string().optional(),
            client: z.string().optional(),
            company: z.string().optional(),
            email: z.string().optional(),
            phone: z.string().optional(),
            status: z.string().optional(),
        })
        .optional(),
})



const columns: ColumnDef<z.infer<typeof schema>>[] = [
    {
        accessorKey: "project",
        header: "Project",
        cell: ({ row }) => {
            const project = row.original.project;
            if (!project) return <span className="text-xs text-white/60 italic">N/A</span>;
            return (
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-blue-300 flex items-center gap-1">
                        <FolderIcon size={13} className="text-blue-400" />
                        {project.name || "Unnamed"}
                    </span>
                    {project.status && (
                        <span className="text-[10px] text-white/60 ml-5">{project.status}</span>
                    )}
                    {project.budget && (
                        <span className="text-[10px] text-green-400 ml-5">Budget: ${project.budget}</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "client",
        header: "Client",
        cell: ({ row }) => {
            const client = row.original.client;
            if (!client) return <span className="text-xs text-white/60 italic">N/A</span>;
            return (
                <div className="flex flex-col">
                    <span className="text-xs font-semibold text-purple-300 flex items-center gap-1">
                        <User2Icon size={13} className="text-purple-400" />
                        {client.client || "Unnamed"}
                    </span>
                    {client.company && (
                        <span className="text-[10px] text-white/60 ml-5">{client.company}</span>
                    )}
                    {client.email && (
                        <span className="text-[10px] text-blue-400 ml-5">{client.email}</span>
                    )}
                </div>
            );
        },
    },

    {
        accessorKey: "startTime",
        header: "Start Time",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Calendar1Icon size={16} className="text-blue-400" />
                <span className="text-xs text-white">{new Date(row.original.startTime).toLocaleString()}</span>
            </div>
        ),
    },
    {
        accessorKey: "endTime",
        header: "End Time",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Calendar1Icon size={16} className="text-purple-400" />
                <span className="text-xs text-white">{new Date(row.original.endTime).toLocaleString()}</span>
            </div>
        ),
    },
    {
        accessorKey: "billable",
        header: "Billable",
        cell: ({ row }) => (
            <Badge variant={row.original.billable ? "outline" : "destructive"} className="flex items-center gap-1 px-2 py-1">
                {row.original.billable ? <CheckCircleIcon className="text-green-400" size={14} /> : <CheckCircle2Icon className="text-red-400" size={14} />}
                <span className="text-xs">{row.original.billable ? "Yes" : "No"}</span>
            </Badge>
        ),
    },
    {
        accessorKey: "totalHours",
        header: "Total Time",
        cell: ({ row }) => {
            // Accepts either a string (hh:mm:ss) or a number (decimal hours)
            const value = row.original.totalHours as string | number;
            let display = "";
            if (typeof value === "string" && value.match(/^\d{2}:\d{2}:\d{2}$/)) {
                display = value;
            } else if (typeof value === "number" && !isNaN(value)) {
                const totalSeconds = Math.round(value * 3600);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                display = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
            } else {
                display = "--:--:--";
            }
            return (
                <div className="flex items-center gap-2">
                    <TrendingUpIcon size={15} className="text-yellow-400" />
                    <span className="text-xs text-white">{display}</span>
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const billableId = row.original._id;
            const [confirmOpen, setConfirmOpen] = React.useState(false);
            const [isDeleting, setIsDeleting] = React.useState(false);

            const handleEdit = () => {
                window.location.href = `/admin/billables/edit-billable?id=${billableId}`;
            };

            const handleDelete = async () => {
                setIsDeleting(true);
                try {
                    const res = await fetch(`/api/billable/${billableId}`, {
                        method: "DELETE",
                    });
                    if (!res.ok) throw new Error("Failed to delete billable session");
                    toast.success("Billable session deleted successfully");
                    setConfirmOpen(false);
                    setTimeout(() => window.location.reload(), 500);
                } catch (err) {
                    toast.error("Error deleting billable session");
                } finally {
                    setIsDeleting(false);
                }
            };

            const ReactDOM = typeof window !== 'undefined' ? require('./ReactDOMClientFix').default : null;
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
                            <DropdownMenuItem onClick={() => setConfirmOpen(true)} className="text-red-500 focus:text-red-600">Delete</DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
                    {confirmOpen && ReactDOM && ReactDOM.createPortal(
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
                                <h3 className="text-lg font-semibold mb-2 text-center">Delete Billable Session?</h3>
                                <p className="text-sm text-neutral-300 mb-4 text-center">Are you sure you want to delete this session? This action cannot be undone.</p>
                                <div className="flex gap-2 w-full">
                                    <Button className="flex-1" variant="destructive" style={{ zIndex: 10001 }} onClick={handleDelete} disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete'}</Button>
                                    <Button className="flex-1" variant="outline" style={{ zIndex: 10001 }} onClick={() => setConfirmOpen(false)} disabled={isDeleting}>Cancel</Button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
                </>
            );
        },
    },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original._id,
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
        () => data?.map(({ _id }) => _id) || [],
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
        getRowId: (row) => row._id,
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
        </div>
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


