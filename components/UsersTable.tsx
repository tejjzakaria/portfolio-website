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


// Schema for the provided user data
export const schema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  image: z.string().optional(),
  banned: z.boolean().optional(),
  status: z.string().optional(),
  emailVerified: z.boolean().optional(),
  createdAt: z.any(),
  updatedAt: z.any(),
});

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
  
  { accessorKey: "image", header: "Image", cell: ({ row }) => {
    const val = row.original.image;
    if (typeof val === 'string' && val.trim() !== '') {
      return <img src={val} alt="user" className="h-8 w-8 rounded-full object-cover" />;
    }
    return <span className="text-muted-foreground italic">N/A</span>;
  } },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
{ accessorKey: "role", header: "Role", cell: ({ row }) => {
  const val = row.original.role;
  // Role color and icon map
  const roleStyles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    admin: {
      bg: "bg-red-100 dark:bg-red-900/40",
      text: "text-red-700 dark:text-red-300",
      icon: <span className="mr-1">🛡️</span>,
    },
    user: {
      bg: "bg-blue-100 dark:bg-blue-900/40",
      text: "text-blue-700 dark:text-blue-300",
      icon: <span className="mr-1">👤</span>,
    },
    manager: {
      bg: "bg-green-100 dark:bg-green-900/40",
      text: "text-green-700 dark:text-green-300",
      icon: <span className="mr-1">📋</span>,
    },
    guest: {
      bg: "bg-gray-100 dark:bg-gray-900/40",
      text: "text-gray-700 dark:text-gray-300",
      icon: <span className="mr-1">👀</span>,
    },
  };
  const style = roleStyles[val?.toLowerCase?.()] || { bg: "bg-neutral-100 dark:bg-neutral-800/40", text: "text-neutral-700 dark:text-neutral-300", icon: <span className="mr-1">🔰</span> };
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${style.bg} ${style.text}`}>
      {style.icon}
      {val || 'N/A'}
    </span>
  );
}},
{ accessorKey: "banned", header: "Banned", cell: ({ row }) => {
  const val = row.original.banned;
  if (typeof val === 'boolean') {
    return val ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-semibold">
        <span>🚫</span> Banned
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-semibold">
        <span>✅</span> Active
      </span>
    );
  }
  return <span className="text-muted-foreground italic">N/A</span>;
}},
  { accessorKey: "status", header: "Status", cell: ({ row }) => {
    // Defensive: handle undefined/null/empty string
    const val = row.original.status;
    const statusStyles: Record<string, { bg: string; text: string; icon?: string }> = {
      active: {
        bg: "bg-green-100 dark:bg-green-900/40",
        text: "text-green-700 dark:text-green-300",
        icon: "✔️",
      },
      pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900/40",
        text: "text-yellow-700 dark:text-yellow-300",
        icon: "⏳",
      },
      banned: {
        bg: "bg-red-100 dark:bg-red-900/40",
        text: "text-red-700 dark:text-red-300",
        icon: "🚫",
      },
      inactive: {
        bg: "bg-gray-100 dark:bg-gray-900/40",
        text: "text-gray-700 dark:text-gray-300",
        icon: "💤",
      },
    };
    const statusKey = typeof val === 'string' ? val.toLowerCase() : '';
    const style = statusStyles[statusKey] || { bg: "bg-neutral-100 dark:bg-neutral-800/40", text: "text-neutral-700 dark:text-neutral-300", icon: "🔘" };
    if (typeof val === 'string' && val.trim() !== '') {
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${style.bg} ${style.text}`}>
          
          {val}
        </span>
      );
    }
    if (val !== undefined && val !== null) return String(val);
    return <span className="text-muted-foreground italic">N/A</span>;
  } },
  { accessorKey: "emailVerified", header: "Email Verified", cell: ({ row }) => row.original.emailVerified ? "Yes" : "No" },
  { accessorKey: "createdAt", header: "Created At", cell: ({ row }) => {
    const val = row.original.createdAt;
    if (val instanceof Date) return val.toLocaleString();
    if (typeof val === 'string' || typeof val === 'number') {
      const date = new Date(val);
      if (!isNaN(date.getTime())) return date.toLocaleString();
    }
    // Defensive: handle ISO string in object (MongoDB extended JSON)
    if (val && typeof val === 'object') {
      if (val.$date && typeof val.$date === 'string') {
        const date = new Date(val.$date);
        if (!isNaN(date.getTime())) return date.toLocaleString();
      }
      if (val.$date && typeof val.$date === 'object' && val.$date.$numberLong) {
        const date = new Date(Number(val.$date.$numberLong));
        if (!isNaN(date.getTime())) return date.toLocaleString();
      }
      if (val.$numberLong) {
        const date = new Date(Number(val.$numberLong));
        if (!isNaN(date.getTime())) return date.toLocaleString();
      }
    }
    return <span className="text-muted-foreground italic">N/A</span>;
  } },
  { accessorKey: "updatedAt", header: "Updated At", cell: ({ row }) => {
    const val = row.original.updatedAt;
    if (val instanceof Date) return val.toLocaleString();
    if (typeof val === 'string' || typeof val === 'number') {
      const date = new Date(val);
      if (!isNaN(date.getTime())) return date.toLocaleString();
    }
    if (val && typeof val === 'object') {
      if (val.$date && typeof val.$date === 'string') {
        const date = new Date(val.$date);
        if (!isNaN(date.getTime())) return date.toLocaleString();
      }
      if (val.$date && typeof val.$date === 'object' && val.$date.$numberLong) {
        const date = new Date(Number(val.$date.$numberLong));
        if (!isNaN(date.getTime())) return date.toLocaleString();
      }
      if (val.$numberLong) {
        const date = new Date(Number(val.$numberLong));
        if (!isNaN(date.getTime())) return date.toLocaleString();
      }
    }
    return <span className="text-muted-foreground italic">N/A</span>;
  } },
  // --- ACTIONS COLUMN ---
  {
    id: "actions",
    cell: ActionsCell,
  },
]

// ActionsCell component for the actions column (edit/delete)
function ActionsCell({ row }: { row: any }) {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [showRoleModal, setShowRoleModal] = React.useState(false);
  const [showBanModal, setShowBanModal] = React.useState(false);
  const [showSessionModal, setShowSessionModal] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState(row.original.role || "user");
  const [banReason, setBanReason] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [sessions, setSessions] = React.useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = React.useState(false);
  const [sessionsError, setSessionsError] = React.useState("");

  // Defensive userId extraction
  const val = row.original._id;
  let userId = '';
  if (typeof val === 'string') userId = val;
  else if (val && typeof val === 'object' && typeof (val as any).$oid === 'string') userId = (val as any).$oid;
  else if (val && typeof (val as any).toString === 'function') userId = (val as any).toString();

  // Use next/navigation router if available
  let router: any = null;
  try {
    if (typeof window !== 'undefined') {
      router = require('next/navigation').useRouter();
    }
  } catch {}

  const handleEdit = () => {
    if (router) router.push(`/admin/clients/edit-client?id=${userId}`);
    else window.location.href = `/admin/clients/edit-client?id=${userId}`;
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/better-auth-users/${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      window.location.reload();
    } catch (err) {
      setError('Error deleting user.');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleSetPassword = async () => {
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/better-auth-users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error('Failed to set password');
      setSuccess('Password updated');
      setShowPasswordModal(false);
    } catch (err) {
      setError('Error setting password.');
    } finally {
      setActionLoading(false);
      setPassword("");
    }
  };

  const handleSetRole = async () => {
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/better-auth-users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error('Failed to set role');
      setSuccess('Role updated');
      setShowRoleModal(false);
      window.location.reload();
    } catch (err) {
      setError('Error setting role.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBanUnban = async (ban: boolean) => {
    setActionLoading(true);
    setError("");
    setSuccess("");
    try {
      console.log('[ban/unban] userId:', userId, 'ban:', ban, 'banReason:', ban ? banReason : undefined);
      const res = await fetch(`/api/better-auth-users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banned: ban, banReason: ban ? banReason : undefined }),
      });
      const data = await res.json();
      console.log('[ban/unban] response:', data);
      if (!res.ok) {
        setError(data?.error || 'Failed to update ban status');
        return;
      }
      setSuccess(ban ? 'User banned' : 'User unbanned');
      setShowBanModal(false);
      window.location.reload();
    } catch (err) {
      setError('Error updating ban status.');
      console.error('[ban/unban] error:', err);
    } finally {
      setActionLoading(false);
      setBanReason("");
    }
  };

  const handleOpenSessions = async () => {
    setSessionsLoading(true);
    setSessionsError("");
    setShowSessionModal(true);
    try {
      const res = await fetch(`/api/better-auth-users/${userId}/sessions`);
      if (!res.ok) throw new Error('Failed to fetch sessions');
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (err) {
      setSessionsError('Error fetching sessions.');
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    setActionLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/better-auth-users/${userId}/sessions/${sessionId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to revoke session');
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      setError('Error revoking session.');
    } finally {
      setActionLoading(false);
    }
  };

  // Use ReactDOM portal for confirm dialog (client only)
  let ReactDOM: any = null;
  try {
    if (typeof window !== 'undefined') {
      ReactDOM = require('./ReactDOMClientFix').default;
    }
  } catch {}

  const isBanned = !!row.original.banned;

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
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowRoleModal(true)}>Set Role</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowPasswordModal(true)}>Set Password</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowBanModal(true)}>{isBanned ? 'Unban User' : 'Ban User'}</DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenSessions}>Manage Sessions</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowConfirm(true)} className="text-red-500">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Modal */}
      {showConfirm && ReactDOM && ReactDOM.createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.45)',
          pointerEvents: 'auto',
        }}>
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-2xl p-6 w-full max-w-xs flex flex-col items-center relative" style={{zIndex: 10000}}>
            <div className="text-lg font-semibold mb-2 text-red-600">Delete User?</div>
            <div className="text-neutral-700 dark:text-neutral-300 mb-4 text-center">Are you sure you want to delete this user? This action cannot be undone.</div>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <div className="flex gap-4 w-full justify-center">
              <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={deleting}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Set Password Modal */}
      {showPasswordModal && ReactDOM && ReactDOM.createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.45)',
          pointerEvents: 'auto',
        }}>
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-2xl p-6 w-full max-w-xs flex flex-col items-center relative" style={{zIndex: 10000}}>
            <div className="text-lg font-semibold mb-2">Set Password</div>
            <input type="password" className="border rounded px-2 py-1 w-full mb-2" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} disabled={actionLoading} />
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            {success && <div className="text-green-500 text-sm mb-2">{success}</div>}
            <div className="flex gap-4 w-full justify-center">
              <Button variant="outline" onClick={() => setShowPasswordModal(false)} disabled={actionLoading}>Cancel</Button>
              <Button onClick={handleSetPassword} disabled={actionLoading || !password}>{actionLoading ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Set Role Modal */}
      {showRoleModal && ReactDOM && ReactDOM.createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.45)',
          pointerEvents: 'auto',
        }}>
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-2xl p-6 w-full max-w-xs flex flex-col items-center relative" style={{zIndex: 10000}}>
            <div className="text-lg font-semibold mb-2">Set Role</div>
            <select className="border rounded px-2 py-1 w-full mb-2" value={role} onChange={e => setRole(e.target.value)} disabled={actionLoading}>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
              <option value="guest">Guest</option>
            </select>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            {success && <div className="text-green-500 text-sm mb-2">{success}</div>}
            <div className="flex gap-4 w-full justify-center">
              <Button variant="outline" onClick={() => setShowRoleModal(false)} disabled={actionLoading}>Cancel</Button>
              <Button onClick={handleSetRole} disabled={actionLoading}>{actionLoading ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Ban/Unban Modal */}
      {showBanModal && ReactDOM && ReactDOM.createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.45)',
          pointerEvents: 'auto',
        }}>
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-2xl p-6 w-full max-w-xs flex flex-col items-center relative" style={{zIndex: 10000}}>
            <div className="text-lg font-semibold mb-2">{isBanned ? 'Unban User' : 'Ban User'}</div>
            {!isBanned && (
              <input type="text" className="border rounded px-2 py-1 w-full mb-2" placeholder="Ban reason (optional)" value={banReason} onChange={e => setBanReason(e.target.value)} disabled={actionLoading} />
            )}
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            {success && <div className="text-green-500 text-sm mb-2">{success}</div>}
            <div className="flex gap-4 w-full justify-center">
              <Button variant="outline" onClick={() => setShowBanModal(false)} disabled={actionLoading}>Cancel</Button>
              <Button onClick={() => handleBanUnban(!isBanned)} disabled={actionLoading}>{actionLoading ? (isBanned ? 'Unbanning...' : 'Banning...') : (isBanned ? 'Unban' : 'Ban')}</Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Manage Sessions Modal */}
      {showSessionModal && ReactDOM && ReactDOM.createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.45)',
          pointerEvents: 'auto',
        }}>
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-2xl p-6 w-full max-w-md flex flex-col items-center relative" style={{zIndex: 10000}}>
            <div className="text-lg font-semibold mb-2">Manage Sessions</div>
            {sessionsLoading ? (
              <div className="text-neutral-700 dark:text-neutral-300 mb-2">Loading sessions...</div>
            ) : sessionsError ? (
              <div className="text-red-500 text-sm mb-2">{sessionsError}</div>
            ) : (
              <div className="w-full max-h-60 overflow-y-auto mb-2">
                {sessions.length === 0 ? (
                  <div className="text-neutral-500 text-sm">No active sessions.</div>
                ) : (
                  <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {sessions.map((s) => (
                      <li key={s.id} className="flex items-center justify-between py-2">
                        <span className="text-xs font-mono">{s.id}</span>
                        <Button size="sm" variant="destructive" onClick={() => handleRevokeSession(s.id)} disabled={actionLoading}>Revoke</Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <div className="flex gap-4 w-full justify-center mt-2">
              <Button variant="outline" onClick={() => setShowSessionModal(false)} disabled={actionLoading}>Close</Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
// Only one actions column, use ActionsCell below


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

// Context for modal client id
const ModalClientIdContext = React.createContext<{
  modalClientId: string | null;
  setModalClientId: (id: string | null) => void;
} | null>(null);

export function DataTable({
  data: initialData,
}: {
  data: any[]
}) {
  // No mapping needed, just use the data as-is
  const data = React.useMemo(() => initialData, [initialData]);

  React.useEffect(() => {
    console.log('DataTable received data:', data);
  }, [data]);
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
    () => Array.isArray(data) ? data.map((u) => u?._id?.toString?.() ?? "") : [],
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
    getRowId: (row) => {
      // Defensive: handle missing or non-string _id
      if (row && row._id) {
        if (typeof row._id === 'string') return row._id;
        if (typeof row._id === 'object' && row._id.$oid) return row._id.$oid;
        if (row._id.toString) return row._id.toString();
        return String(row._id);
      }
      return '';
    },
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


