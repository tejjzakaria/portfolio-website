
"use client";
import React, { useState } from "react";
import { Spotlight } from "@/components/ui/Spotlight";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { FaArrowCircleRight, FaArrowCircleLeft, FaPlusCircle } from "react-icons/fa";
import { Navbar } from "@/components/SideBarNav";

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const AddClientPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    company: "",
    role: "user",
    status: "active",
    projects: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/auth/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.name,
          role: form.role,
          data: {
            phoneNumber: form.phoneNumber,
            company: form.company,
            status: form.status,
            projects: form.projects ? form.projects.split(",").map((p) => p.trim()) : []
          }
        })
      });
      if (!res.ok) throw new Error("Failed to add user");
      setSuccess("User added successfully!");
      setForm({ name: "", email: "", password: "", phoneNumber: "", company: "", role: "user", status: "active", projects: "" });
    } catch (err: any) {
      setError(err.message || "Error adding user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar>
      <div
        className="flex flex-col min-h-screen items-center justify-start gap-8 border dark:border-neutral-700 mx-auto w-full px-2 sm:px-4 md:px-8 py-6 md:py-10"
        style={{
          background: "rgb(4,7,29)",
          backgroundColor: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
        }}
      >
        <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black border border-white-500 relative z-10" style={{
          background: "rgb(4,7,29)",
          backgroundColor: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)"
        }}>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Add New Client</h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 mb-6">Fill out the form to add a new client to the database.</p>
          <form className="my-8" onSubmit={handleSubmit}>
            {success && <div className="my-4 border-green-500/20 bg-green-500/10 text-green-400 text-center p-2 rounded-lg">{success}</div>}
            {error && <div className="my-4 border-red-500/20 bg-red-500/10 text-red-400 text-center p-2 rounded-lg">{error}</div>}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Enter full name" type="text" value={form.name} onChange={handleChange} required />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" placeholder="Enter email" type="email" value={form.email} onChange={handleChange} required />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" placeholder="Enter password" type="password" value={form.password} onChange={handleChange} required />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" name="phoneNumber" placeholder="Enter phone number" type="text" value={form.phoneNumber} onChange={handleChange} />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" placeholder="Enter company name" type="text" value={form.company} onChange={handleChange} />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="role">Role</Label>
              <Select value={form.role} onValueChange={(value) => setForm(f => ({ ...f, role: value }))}>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status} onValueChange={(value) => setForm(f => ({ ...f, status: value }))}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="projects">Projects (comma separated)</Label>
              <Input id="projects" name="projects" placeholder="e.g. Website, App" type="text" value={form.projects} onChange={handleChange} />
            </LabelInputContainer>
            <div className="flex flex-row justify-between items-center gap-4 mt-8">
              <button type="button" onClick={() => window.history.back()} className="flex h-10 items-center w-1/5 px-6 py-2 rounded-lg border border-blue-400/60 bg-gradient-to-br from-blue-500/40 to-cyan-500/30 backdrop-blur-xl backdrop-saturate-200 font-medium text-white transition-all duration-300 hover:from-blue-500/60 hover:to-cyan-500/50 hover:border-blue-300/80 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-98 dark:border-blue-400/40 dark:from-blue-500/35 dark:to-cyan-500/25 dark:hover:from-blue-500/55 dark:hover:to-cyan-500/45 dark:hover:border-blue-300/60 dark:hover:shadow-blue-500/40">
                <FaArrowCircleLeft />
              </button>
              <div className="flex w-4/5 justify-center items-center gap-3 group/btn relative h-10 rounded-lg border border-blue-400/60 bg-gradient-to-br from-blue-500/40 to-cyan-500/30 backdrop-blur-xl backdrop-saturate-200 font-medium text-white transition-all duration-300 hover:from-blue-500/60 hover:to-cyan-500/50 hover:border-blue-300/80 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-98 dark:border-blue-400/40 dark:from-blue-500/35 dark:to-cyan-500/25 dark:hover:from-blue-500/55 dark:hover:to-cyan-500/45 dark:hover:border-blue-300/60 dark:hover:shadow-blue-500/40 p-3">
                <button className="" type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Client"}
                  <BottomGradient />
                </button>
                <FaPlusCircle/>
              </div>
            </div>
            
          </form>
        </div>
      </div>
    </Navbar>
  );
}

export default AddClientPage;
