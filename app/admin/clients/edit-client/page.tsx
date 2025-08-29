"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { FaArrowCircleRight, FaArrowCircleLeft, FaTrash, FaUserShield, FaBan, FaUnlock, FaKey, FaUserEdit, FaUserTimes, FaUserCheck, FaUserCog, FaUserAltSlash, FaUserAlt, FaUser } from "react-icons/fa";
import { Navbar } from "@/components/SideBarNav";
// If you have a Dialog component, ensure the path and casing is correct. If not, comment out or replace with a working modal/dialog.
// import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);


// --- Admin User Management Page ---
const EditUserPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("id");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [roleModal, setRoleModal] = useState(false);
  const [banModal, setBanModal] = useState(false);
  const [unbanModal, setUnbanModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [sessionsModal, setSessionsModal] = useState(false);
  const [impersonateLoading, setImpersonateLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [banReason, setBanReason] = useState("");
  const [banExpiresIn, setBanExpiresIn] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/better-auth-users/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data.user || data);
      } catch (err: any) {
        setError(err.message || "Error fetching user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  // --- Edit User Details ---
  const handleEditUser = async (fields: any) => {
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      // PATCH to the RESTful API route for editing user details
      const res = await fetch(`/api/better-auth-users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields)
      });
      if (!res.ok) throw new Error("Failed to update user");
      setSuccess("User updated successfully!");
      setEditModal(false);
      // Refresh user
      const data = await res.json();
      setUser(data.user || data);
    } catch (err: any) {
      setError(err.message || "Error updating user");
    } finally {
      setLoading(false);
    }
  };

  // --- Set User Role ---
  const handleSetRole = async () => {
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/better-auth-admin/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole })
      });
      if (!res.ok) throw new Error("Failed to set role");
      setSuccess("Role updated!");
      setRoleModal(false);
      setUser((u: any) => ({ ...u, role: newRole }));
    } catch (err: any) {
      setError(err.message || "Error setting role");
    } finally {
      setLoading(false);
    }
  };

  // --- Ban User ---
  const handleBanUser = async () => {
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/better-auth-admin/ban-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, banReason, banExpiresIn: banExpiresIn ? Number(banExpiresIn) : undefined })
      });
      if (!res.ok) throw new Error("Failed to ban user");
      setSuccess("User banned!");
      setBanModal(false);
      setUser((u: any) => ({ ...u, banned: true, banReason }));
    } catch (err: any) {
      setError(err.message || "Error banning user");
    } finally {
      setLoading(false);
    }
  };

  // --- Unban User ---
  const handleUnbanUser = async () => {
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/better-auth-admin/unban-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error("Failed to unban user");
      setSuccess("User unbanned!");
      setUnbanModal(false);
      setUser((u: any) => ({ ...u, banned: false, banReason: undefined }));
    } catch (err: any) {
      setError(err.message || "Error unbanning user");
    } finally {
      setLoading(false);
    }
  };

  // --- Set User Password ---
  const handleSetPassword = async () => {
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/better-auth-admin/set-user-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPassword })
      });
      if (!res.ok) throw new Error("Failed to set password");
      setSuccess("Password updated!");
      setPasswordModal(false);
    } catch (err: any) {
      setError(err.message || "Error setting password");
    } finally {
      setLoading(false);
    }
  };

  // --- Delete User ---
  const handleDeleteUser = async () => {
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/better-auth-admin/remove-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setSuccess("User deleted!");
      setDeleteModal(false);
      setTimeout(() => router.push("/admin/clients"), 1200);
    } catch (err: any) {
      setError(err.message || "Error deleting user");
    } finally {
      setLoading(false);
    }
  };

  // --- Manage User Sessions ---
  const handleListSessions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/better-auth-admin/list-user-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error("Failed to fetch sessions");
      const data = await res.json();
      setSessions(data.sessions || []);
      setSessionsModal(true);
    } catch (err: any) {
      setError(err.message || "Error fetching sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessionToken: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/better-auth-admin/revoke-user-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken })
      });
      if (!res.ok) throw new Error("Failed to revoke session");
      setSuccess("Session revoked!");
      setSessions((prev) => prev.filter((s) => s.sessionToken !== sessionToken));
    } catch (err: any) {
      setError(err.message || "Error revoking session");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAllSessions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/better-auth-admin/revoke-user-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error("Failed to revoke all sessions");
      setSuccess("All sessions revoked!");
      setSessions([]);
    } catch (err: any) {
      setError(err.message || "Error revoking all sessions");
    } finally {
      setLoading(false);
    }
  };

  // --- UI ---
  return (
    <Navbar>
      <div className="flex flex-col min-h-screen items-center justify-start gap-8 border dark:border-neutral-700 mx-auto w-full px-2 sm:px-4 md:px-8 py-6 md:py-10"
        style={{
          background: "rgb(4,7,29)",
          backgroundColor: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
        }}
      >
        <div className="shadow-input mx-auto w-full max-w-lg rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black border border-white-500 relative z-10" style={{
          background: "rgb(4,7,29)",
          backgroundColor: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)"
        }}>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2 flex items-center gap-2">
            <FaUserEdit className="text-blue-400" /> Edit User
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 mb-6">Manage user details, roles, ban status, sessions, and more.</p>
          {success && <div className="my-4 border-green-500/20 bg-green-500/10 text-green-400 text-center p-2 rounded-lg">{success}</div>}
          {error && <div className="my-4 border-red-500/20 bg-red-500/10 text-red-400 text-center p-2 rounded-lg">{error}</div>}
          {/* User Info Card */}
          {user && (
            <div className="bg-white/5 dark:bg-white/10 border border-white/10 rounded-lg p-4 mb-6 flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <FaUser className="text-2xl text-blue-300" />
                <div>
                  <div className="text-lg font-semibold text-white">{user.name || user.email}</div>
                  <div className="text-sm text-neutral-400">{user.email}</div>
                </div>
                <span className={`ml-auto px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'}`}>{user.role}</span>
                {user.banned && <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1"><FaBan /> Banned</span>}
              </div>
              {user.banned && user.banReason && (
                <div className="text-xs text-red-300 mt-1">Reason: {user.banReason}</div>
              )}
            </div>
          )}
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button variant="secondary" onClick={() => setEditModal(true)} className="flex items-center gap-2"><FaUserCog /> Edit Details</Button>
            <Button variant="secondary" onClick={() => setRoleModal(true)} className="flex items-center gap-2"><FaUserShield /> Set Role</Button>
            {!user?.banned ? (
              <Button variant="destructive" onClick={() => setBanModal(true)} className="flex items-center gap-2"><FaBan /> Ban</Button>
            ) : (
              <Button variant="secondary" onClick={() => setUnbanModal(true)} className="flex items-center gap-2"><FaUnlock /> Unban</Button>
            )}
            <Button variant="secondary" onClick={() => setPasswordModal(true)} className="flex items-center gap-2"><FaKey /> Set Password</Button>
            <Button variant="secondary" onClick={handleListSessions} className="flex items-center gap-2"><FaUserCheck /> Sessions</Button>
            <Button variant="destructive" onClick={() => setDeleteModal(true)} className="flex items-center gap-2"><FaTrash /> Delete</Button>
          </div>

          {/* Edit Details Modal */}
          {editModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="p-6 bg-black/90 rounded-lg max-w-md mx-auto shadow-2xl border border-white/10">
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><FaUserCog /> Edit User Details</h3>
                <form onSubmit={e => { e.preventDefault(); handleEditUser({ name: (e.target as any).name.value, email: (e.target as any).email.value }); }}>
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" type="text" defaultValue={user?.name || ""} required />
                  </LabelInputContainer>
                  <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={user?.email || ""} required />
                  </LabelInputContainer>
                  <div className="flex gap-2 mt-6">
                    <Button type="button" variant="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
                    <Button type="submit" variant="default">Save</Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Set Role Modal */}
          {roleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="p-6 bg-black/90 rounded-lg max-w-md mx-auto shadow-2xl border border-white/10">
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><FaUserShield /> Set User Role</h3>
                <div className="mb-4">
                  <Label htmlFor="role">Role</Label>
                  <select id="role" name="role" className="w-full mt-2 p-2 rounded-md bg-white/10 text-white border border-white/20" value={newRole} onChange={e => setNewRole(e.target.value)}>
                    <option value="">Select role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button type="button" variant="secondary" onClick={() => setRoleModal(false)}>Cancel</Button>
                  <Button type="button" variant="default" onClick={handleSetRole} disabled={!newRole}>Set Role</Button>
                </div>
              </div>
            </div>
          )}

          {/* Ban Modal */}
          {banModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="p-6 bg-black/90 rounded-lg max-w-md mx-auto shadow-2xl border border-white/10">
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><FaBan /> Ban User</h3>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="banReason">Reason</Label>
                  <Input id="banReason" name="banReason" type="text" value={banReason} onChange={e => setBanReason(e.target.value)} placeholder="Reason for ban" />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="banExpiresIn">Ban Expires In (seconds, optional)</Label>
                  <Input id="banExpiresIn" name="banExpiresIn" type="number" value={banExpiresIn} onChange={e => setBanExpiresIn(e.target.value)} placeholder="e.g. 604800 for 1 week" />
                </LabelInputContainer>
                <div className="flex gap-2 mt-6">
                  <Button type="button" variant="secondary" onClick={() => setBanModal(false)}>Cancel</Button>
                  <Button type="button" variant="destructive" onClick={handleBanUser}>Ban</Button>
                </div>
              </div>
            </div>
          )}

          {/* Unban Modal */}
          {unbanModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="p-6 bg-black/90 rounded-lg max-w-md mx-auto shadow-2xl border border-white/10">
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><FaUnlock /> Unban User</h3>
                <div className="mb-4 text-neutral-300">Are you sure you want to unban this user?</div>
                <div className="flex gap-2 mt-6">
                  <Button type="button" variant="secondary" onClick={() => setUnbanModal(false)}>Cancel</Button>
                  <Button type="button" variant="default" onClick={handleUnbanUser}>Unban</Button>
                </div>
              </div>
            </div>
          )}

          {/* Set Password Modal */}
          {passwordModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="p-6 bg-black/90 rounded-lg max-w-md mx-auto shadow-2xl border border-white/10">
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><FaKey /> Set User Password</h3>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" name="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" />
                </LabelInputContainer>
                <div className="flex gap-2 mt-6">
                  <Button type="button" variant="secondary" onClick={() => setPasswordModal(false)}>Cancel</Button>
                  <Button type="button" variant="default" onClick={handleSetPassword} disabled={!newPassword}>Set Password</Button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Modal */}
          {deleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="p-6 bg-black/90 rounded-lg max-w-md mx-auto shadow-2xl border border-white/10">
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><FaTrash /> Delete User</h3>
                <div className="mb-4 text-neutral-300">Are you sure you want to delete this user? This action cannot be undone.</div>
                <div className="flex gap-2 mt-6">
                  <Button type="button" variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
                  <Button type="button" variant="destructive" onClick={handleDeleteUser}>Delete</Button>
                </div>
              </div>
            </div>
          )}

          {/* Sessions Modal */}
          {sessionsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="p-6 bg-black/90 rounded-lg max-w-lg mx-auto shadow-2xl border border-white/10">
                <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><FaUserCheck /> User Sessions</h3>
                {sessions.length === 0 ? (
                  <div className="text-neutral-400">No active sessions.</div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {sessions.map((s, i) => (
                      <div key={s.sessionToken || i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-md px-3 py-2">
                        <div className="flex flex-col">
                          <span className="text-xs text-white">Session: {s.sessionToken?.slice(0, 12)}...</span>
                          <span className="text-xs text-neutral-400">Created: {s.createdAt ? new Date(s.createdAt).toLocaleString() : "-"}</span>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleRevokeSession(s.sessionToken)}>Revoke</Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-6">
                  <Button type="button" variant="secondary" onClick={() => setSessionsModal(false)}>Close</Button>
                  {sessions.length > 0 && <Button type="button" variant="destructive" onClick={handleRevokeAllSessions}>Revoke All</Button>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
};

export default EditUserPage;
