"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { FaArrowCircleLeft, FaArrowDown, FaSave } from "react-icons/fa";
import { Navbar } from "@/components/SideBarNav";

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);

const AddInvoicePage = () => {
  const [form, setForm] = useState<{
    clientId: string;
    client: string;
    company: string;
    email: string;
    phone: string;
    projectIds: string[];
    projects: string[];
    status: string;
    amount: string;
    dueDate: string;
  }>({
    clientId: "",
    client: "",
    company: "",
    email: "",
    phone: "",
    projectIds: [],
    projects: [],
    status: "active",
    amount: "",
    dueDate: ""
  });
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch clients
    fetch("/api/clients")
      .then(res => res.json())
      .then(data => setClients(Array.isArray(data.clients) ? data.clients : []));
    // Fetch projects
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => setProjects(Array.isArray(data.projects) ? data.projects : []));
  }, []);

  // When clientId changes, auto-fill denormalized fields
  useEffect(() => {
    if (!form.clientId) return;
    const client = clients.find(c => c._id === form.clientId);
    if (client) {
      setForm(f => ({
        ...f,
        client: client.name,
        company: client.company,
        email: client.email,
        phone: client.phone
      }));
    }
  }, [form.clientId, clients]);

  // When projectIds change, auto-fill denormalized projects
  useEffect(() => {
    if (!form.projectIds || form.projectIds.length === 0) {
      setForm(f => ({ ...f, projects: [] }));
      return;
    }
    const selected = projects.filter(p => form.projectIds.includes(p._id));
    setForm(f => ({ ...f, projects: selected.map(p => p.name) }));
  }, [form.projectIds, projects]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, selectedOptions } = e.target as HTMLInputElement & HTMLSelectElement;
    if (name === "projectIds") {
      const values = Array.from(selectedOptions).map(opt => opt.value);
      setForm(f => ({ ...f, projectIds: values }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          dueDate: new Date(form.dueDate).toISOString(),
        })
      });
      if (!res.ok) throw new Error("Failed to add invoice");
      setSuccess("Invoice added successfully!");
      setForm({ clientId: "", client: "", company: "", email: "", phone: "", projectIds: [], projects: [], status: "active", amount: "", dueDate: "" });
    } catch (err: any) {
      setError(err.message || "Error adding invoice");
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
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Add Invoice</h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 mb-6">Fill in the invoice details below.</p>
          <form className="my-8" onSubmit={handleSubmit}>
            {success && <div className="my-4 border-green-500/20 bg-green-500/10 text-green-400 text-center p-2 rounded-lg">{success}</div>}
            {error && <div className="my-4 border-red-500/20 bg-red-500/10 text-red-400 text-center p-2 rounded-lg">{error}</div>}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="clientId">Client</Label>
              <select
                id="clientId"
                name="clientId"
                value={form.clientId}
                onChange={handleChange}
                className="w-full appearance-none rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-black dark:text-white dark:bg-white/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-8"
                required
              >
                <option value="">Select a client</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>{c.name} ({c.company})</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
                <FaArrowDown/>
              </span>
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="text" value={form.phone} onChange={handleChange} required />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" type="text" value={form.company} onChange={handleChange} required />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="projectIds">Projects</Label>
              <select
                id="projectIds"
                name="projectIds"
                multiple
                value={form.projectIds}
                onChange={handleChange}
                className="w-full appearance-none rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-black dark:text-white dark:bg-white/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-8 h-32"
                required
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} required />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required />
            </LabelInputContainer>
            <div className="flex flex-row justify-between items-center gap-4 mt-8">
              <button type="button" onClick={() => window.history.back()} className="flex h-10 items-center w-1/5 px-6 py-2 rounded-lg border border-blue-400/60 bg-gradient-to-br from-blue-500/40 to-cyan-500/30 backdrop-blur-xl backdrop-saturate-200 font-medium text-white transition-all duration-300 hover:from-blue-500/60 hover:to-cyan-500/50 hover:border-blue-300/80 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-98 dark:border-blue-400/40 dark:from-blue-500/35 dark:to-cyan-500/25 dark:hover:from-blue-500/55 dark:hover:to-cyan-500/45 dark:hover:border-blue-300/60 dark:hover:shadow-blue-500/40">
                <FaArrowCircleLeft />
              </button>
              <div className="flex w-4/5 justify-center items-center gap-3 group/btn relative h-10 rounded-lg border border-blue-400/60 bg-gradient-to-br from-blue-500/40 to-cyan-500/30 backdrop-blur-xl backdrop-saturate-200 font-medium text-white transition-all duration-300 hover:from-blue-500/60 hover:to-cyan-500/50 hover:border-blue-300/80 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-98 dark:border-blue-400/40 dark:from-blue-500/35 dark:to-cyan-500/25 dark:hover:from-blue-500/55 dark:hover:to-cyan-500/45 dark:hover:border-blue-300/60 dark:hover:shadow-blue-500/40 p-3">
                <button className="" type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Add Invoice"}
                </button>
                <FaSave/>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Navbar>
  );
};

export default AddInvoicePage;
