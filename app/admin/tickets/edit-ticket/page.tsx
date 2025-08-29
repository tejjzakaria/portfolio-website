
"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useSearchParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { FaArrowCircleLeft, FaSave } from "react-icons/fa";
import { Navbar } from "@/components/SideBarNav";

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "in progress", label: "In Progress" },
  { value: "closed", label: "Closed" },
];

const EditTicketPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ticketId = searchParams.get("id");
  const [form, setForm] = useState({
    ticketNumber: "",
    client: null as null | { value: string, label: string },
    project: null as null | { value: string, label: string },
    title: "",
    message: "",
    status: null as null | { value: string, label: string },
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [clients, setClients] = useState<{ value: string, label: string }[]>([]);
  const [projects, setProjects] = useState<{ value: string, label: string }[]>([]);

  // Fetch ticket, clients, and projects
  useEffect(() => {
    if (!ticketId) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/tickets/${ticketId}`).then(res => res.json()),
      fetch("/api/clients").then(res => res.json()),
      fetch("/api/projects").then(res => res.json()),
    ]).then(([ticket, clientsData, projectsData]) => {
      // Prepare select options
      const clientOptions = (clientsData.clients || []).map((c: any) => ({ value: c.id || c._id, label: c.client || c.name }));
      const projectOptions = (projectsData.projects || []).map((p: any) => ({ value: p.id || p._id, label: p.name }));
      setClients(clientOptions);
      setProjects(projectOptions);
      setForm({
        ticketNumber: ticket.ticketNumber || "",
        client: ticket.client ? { value: ticket.client._id || ticket.client.id || ticket.client, label: ticket.client.client || ticket.client.name || ticket.client } : null,
        project: ticket.project ? { value: ticket.project._id || ticket.project.id || ticket.project, label: ticket.project.name || ticket.project } : null,
        title: ticket.title || "",
        message: ticket.message || "",
        status: statusOptions.find(opt => opt.value === ticket.status) || null,
      });
    }).catch((err) => {
      setError("Failed to fetch ticket or options");
    }).finally(() => setLoading(false));
  }, [ticketId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketNumber: form.ticketNumber,
          client: form.client?.value,
          project: form.project?.value,
          title: form.title,
          message: form.message,
          status: form.status?.value,
        }),
      });
      if (!res.ok) throw new Error("Failed to update ticket");
      setSuccess("Ticket updated successfully!");
      setTimeout(() => router.push("/admin/tickets"), 1000);
    } catch (err: any) {
      setError(err.message || "Error updating ticket");
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
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Edit Ticket</h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 mb-6">Update the ticket details below.</p>
          <form className="my-8" onSubmit={handleSubmit}>
            {success && <div className="my-4 border-green-500/20 bg-green-500/10 text-green-400 text-center p-2 rounded-lg">{success}</div>}
            {error && <div className="my-4 border-red-500/20 bg-red-500/10 text-red-400 text-center p-2 rounded-lg">{error}</div>}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="ticketNumber">Ticket Number</Label>
              <Input id="ticketNumber" name="ticketNumber" value={form.ticketNumber} readOnly disabled required className="rounded-md flex-1 w-full font-mono text-blue-500 tracking-widest cursor-not-allowed border-blue-400/40 text-lg" />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="client">Client</Label>
              <Select
                id="client"
                name="client"
                value={form.client}
                onChange={option => setForm(f => ({ ...f, client: option }))}
                options={clients}
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
                value={form.project}
                onChange={option => setForm(f => ({ ...f, project: option }))}
                options={projects}
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
              <Select
                id="status"
                name="status"
                value={form.status}
                onChange={option => setForm(f => ({ ...f, status: option }))}
                options={statusOptions}
                placeholder="Select status"
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
            <div className="flex flex-row justify-between items-center gap-4 mt-8">
              <button type="button" onClick={() => window.history.back()} className="flex h-10 items-center w-1/5 px-6 py-2 rounded-lg border border-blue-400/60 bg-gradient-to-br from-blue-500/40 to-cyan-500/30 backdrop-blur-xl backdrop-saturate-200 font-medium text-white transition-all duration-300 hover:from-blue-500/60 hover:to-cyan-500/50 hover:border-blue-300/80 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-98 dark:border-blue-400/40 dark:from-blue-500/35 dark:to-cyan-500/25 dark:hover:from-blue-500/55 dark:hover:to-cyan-500/45 dark:hover:border-blue-300/60 dark:hover:shadow-blue-500/40">
                <FaArrowCircleLeft />
              </button>
              <div className="flex w-4/5 justify-center items-center gap-3 group/btn relative h-10 rounded-lg border border-blue-400/60 bg-gradient-to-br from-blue-500/40 to-cyan-500/30 backdrop-blur-xl backdrop-saturate-200 font-medium text-white transition-all duration-300 hover:from-blue-500/60 hover:to-cyan-500/50 hover:border-blue-300/80 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-98 dark:border-blue-400/40 dark:from-blue-500/35 dark:to-cyan-500/25 dark:hover:from-blue-500/55 dark:hover:to-cyan-500/45 dark:hover:border-blue-300/60 dark:hover:shadow-blue-500/40 p-3">
                <button className="" type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
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

export default EditTicketPage;
