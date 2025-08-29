"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { FaArrowCircleLeft, FaPlusCircle, FaArrowDown } from "react-icons/fa";
import { IoReloadCircle } from "react-icons/io5";
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

const AddTicketPage = () => {
  // Generate ticket number like TCK-YYYY-XXX
  function generateTicketNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const rand = Math.floor(100 + Math.random() * 900); // 3-digit random
    return `TCK-${year}-${rand}`;
  }

  const [form, setForm] = useState({
    ticketNumber: generateTicketNumber(),
    client: "",
    project: "",
    title: "",
    message: "",
    status: "open"
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    // Fetch clients and projects for select options
    fetch("/api/clients")
      .then(res => res.json())
      .then(data => {
        // Try to handle both {clients: [...]} and [...] responses
        if (Array.isArray(data)) setClients(data);
        else if (Array.isArray(data.clients)) setClients(data.clients);
        else setClients([]);
      });
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProjects(data);
        else if (Array.isArray(data.projects)) setProjects(data.projects);
        else setProjects([]);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to add ticket");
      setSuccess("Ticket added successfully!");
      setForm({ ticketNumber: generateTicketNumber(), client: "", project: "", title: "", message: "", status: "open" });
    } catch (err: any) {
      setError(err.message || "Error adding ticket");
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
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Add Ticket</h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 mb-6">Fill out the form to add a new support ticket.</p>
          <form className="my-8" onSubmit={handleSubmit}>
            {success && <div className="my-4 border-green-500/20 bg-green-500/10 text-green-400 text-center p-2 rounded-lg">{success}</div>}
            {error && <div className="my-4 border-red-500/20 bg-red-500/10 text-red-400 text-center p-2 rounded-lg">{error}</div>}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="ticketNumber">Ticket Number</Label>
              <div className="flex items-center gap-0">
                <Input
                  id="ticketNumber"
                  name="ticketNumber"
                  value={form.ticketNumber}
                  readOnly
                  disabled
                  required
                  className="rounded-r-none flex-1 w-full font-mono text-blue-500 tracking-widest cursor-not-allowed border-blue-400/40 text-lg"
                  
                />
                <button
                  type="button"
                  className="flex items-center justify-center h-10 w-10 rounded-l-none rounded-r-md bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => setForm(f => ({ ...f, ticketNumber: generateTicketNumber() }))}
                  title="Regenerate Ticket Number"
                  aria-label="Regenerate Ticket Number"
                  style={{ marginLeft: '-0.5rem' }}
                >
                  <IoReloadCircle className="w-7 h-7" />
                </button>
              </div>
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="client">Client</Label>
              <Select
                id="client"
                name="client"
                value={clients.find((c: any) => c._id === form.client) ? { value: form.client, label: clients.find((c: any) => c._id === form.client)?.client } : null}
                onChange={(option: any) => setForm(f => ({ ...f, client: option ? option.value : "" }))}
                options={clients.map((c: any) => ({ value: c._id, label: c.client }))}
                placeholder="Select client"
                isClearable
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({ ...base, backgroundColor: "rgba(255,255,255,0.05)", borderColor: "#3b82f6", color: "#fff" }),
                  menu: (base) => ({ ...base, backgroundColor: "#18181b", color: "#fff" }),
                  singleValue: (base) => ({ ...base, color: "#fff" }),
                  input: (base) => ({ ...base, color: "#fff" }),
                  option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#1e293b" : undefined, color: "#fff" }),
                }}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="project">Project</Label>
              <Select
                id="project"
                name="project"
                value={projects.find((p: any) => p._id === form.project) ? { value: form.project, label: projects.find((p: any) => p._id === form.project)?.name } : null}
                onChange={(option: any) => setForm(f => ({ ...f, project: option ? option.value : "" }))}
                options={projects.map((p: any) => ({ value: p._id, label: p.name }))}
                placeholder="Select project"
                isClearable
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({ ...base, backgroundColor: "rgba(255,255,255,0.05)", borderColor: "#3b82f6", color: "#fff" }),
                  menu: (base) => ({ ...base, backgroundColor: "#18181b", color: "#fff" }),
                  singleValue: (base) => ({ ...base, color: "#fff" }),
                  input: (base) => ({ ...base, color: "#fff" }),
                  option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#1e293b" : undefined, color: "#fff" }),
                }}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="Enter ticket title" type="text" value={form.title} onChange={handleChange} required />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                name="message"
                placeholder="Describe the issue"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-black dark:text-white dark:bg-white/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="status">Status</Label>
              <div className="relative">
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-black dark:text-white dark:bg-white/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-8"
                  required
                >
                  <option value="open">Open</option>
                  <option value="in progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
                  <FaArrowDown/>
                </span>
              </div>
            </LabelInputContainer>
            <div className="flex flex-row justify-between items-center gap-4 mt-8">
              <button type="button" onClick={() => window.history.back()} className="flex h-10 items-center w-1/5 px-6 py-2 rounded-lg border border-blue-400/60 bg-gradient-to-br from-blue-500/40 to-cyan-500/30 backdrop-blur-xl backdrop-saturate-200 font-medium text-white transition-all duration-300 hover:from-blue-500/60 hover:to-cyan-500/50 hover:border-blue-300/80 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-98 dark:border-blue-400/40 dark:from-blue-500/35 dark:to-cyan-500/25 dark:hover:from-blue-500/55 dark:hover:to-cyan-500/45 dark:hover:border-blue-300/60 dark:hover:shadow-blue-500/40">
                <FaArrowCircleLeft />
              </button>
              <div className="flex w-4/5 justify-center items-center gap-3 group/btn relative h-10 rounded-lg border border-blue-400/60 bg-gradient-to-br from-blue-500/40 to-cyan-500/30 backdrop-blur-xl backdrop-saturate-200 font-medium text-white transition-all duration-300 hover:from-blue-500/60 hover:to-cyan-500/50 hover:border-blue-300/80 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-98 dark:border-blue-400/40 dark:from-blue-500/35 dark:to-cyan-500/25 dark:hover:from-blue-500/55 dark:hover:to-cyan-500/45 dark:hover:border-blue-300/60 dark:hover:shadow-blue-500/40 p-3">
                <button className="" type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Ticket"}
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

export default AddTicketPage;
