
"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { FaArrowCircleRight, FaArrowCircleLeft, FaPlusCircle, FaArrowDown } from "react-icons/fa";
import { Navbar } from "@/components/SideBarNav";
import { IoReloadCircle } from "react-icons/io5";
import { useSearchParams, useRouter } from "next/navigation";

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

type Billable = {
  _id: string;
  client: { _id: string; client: string } | string;
  project: { _id: string; name: string } | string;
  totalHours: number;
};

const EditInvoicePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get("id");
  const [form, setForm] = useState<{
    invoiceNumber: string;
    client: string;
    project: string;
    billables: string[];
    hourlyRate: string;
    status: string;
  }>({
    invoiceNumber: "",
    client: "",
    project: "",
    billables: [],
    hourlyRate: "",
    status: "draft"
  });
  const [billablesList, setBillablesList] = useState<Billable[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Fetch billables and invoice on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billablesRes, invoiceRes] = await Promise.all([
          fetch("/api/billable"),
          invoiceId ? fetch(`/api/invoice/${invoiceId}`) : Promise.resolve(null)
        ]);
        const billablesData = await billablesRes.json();
        setBillablesList(billablesData);
        if (invoiceRes && invoiceRes.ok) {
          const invoiceData = await invoiceRes.json();
          setForm({
            invoiceNumber: invoiceData.invoiceNumber || "",
            client: typeof invoiceData.client === "object" ? invoiceData.client._id : invoiceData.client,
            project: typeof invoiceData.project === "object" ? invoiceData.project._id : invoiceData.project,
            billables: invoiceData.billables ? invoiceData.billables.map((b: any) => (typeof b === "string" ? b : b._id)) : [],
            hourlyRate: invoiceData.hourlyRate ? String(invoiceData.hourlyRate) : "",
            status: invoiceData.status || "draft"
          });
        }
        setInitialLoaded(true);
      } catch (err) {
        setError("Failed to fetch data");
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [invoiceId]);

  // When billables change, auto-fill client/project
  useEffect(() => {
    if (form.billables.length === 0) {
      setForm(f => ({ ...f, client: "", project: "" }));
      return;
    }
    const selected = billablesList.filter(b => form.billables.includes(b._id));
    const getClientId = (b: Billable) => typeof b.client === 'object' ? b.client._id : b.client;
    const getProjectId = (b: Billable) => typeof b.project === 'object' ? b.project._id : b.project;
    const clientId = selected[0] ? getClientId(selected[0]) : "";
    const projectId = selected[0] ? getProjectId(selected[0]) : "";
    const allSameClient = selected.every(b => getClientId(b) === clientId);
    const allSameProject = selected.every(b => getProjectId(b) === projectId);
    if (allSameClient && allSameProject) {
      setForm(f => ({ ...f, client: clientId, project: projectId }));
    } else {
      setForm(f => ({ ...f, client: "", project: "" }));
    }
  }, [form.billables, billablesList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Multi-select handler for billables
  const handleBillablesChange = (selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      setForm(f => ({ ...f, billables: [] }));
      return;
    }
    const selected = billablesList.filter(b => selectedIds.includes(b._id));
    const getClientId = (b: Billable) => typeof b.client === 'object' ? b.client._id : b.client;
    const getProjectId = (b: Billable) => typeof b.project === 'object' ? b.project._id : b.project;
    const clientId = selected[0] ? getClientId(selected[0]) : "";
    const projectId = selected[0] ? getProjectId(selected[0]) : "";
    const valid = selected.every(b => getClientId(b) === clientId && getProjectId(b) === projectId);
    if (valid) {
      setForm(f => ({ ...f, billables: selectedIds }));
    }
  };

  // Generate invoice number: e.g. INV-YYYY-NNNN
  function generateInvoiceNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `INV-${year}-${random}`;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch(`/api/invoice/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber: form.invoiceNumber,
          client: form.client,
          project: form.project,
          billables: form.billables,
          hourlyRate: Number(form.hourlyRate),
          status: form.status
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update invoice");
      }
      setSuccess("Invoice updated successfully!");
      setTimeout(() => router.push("/admin/invoices"), 1200);
    } catch (err: any) {
      setError(err.message || "Error updating invoice");
    } finally {
      setLoading(false);
    }
  };

  if (!initialLoaded) {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;
  }

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
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Edit Invoice</h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 mb-6">Update the invoice details below.</p>
          <form className="my-8" onSubmit={handleSubmit}>
            {success && <div className="my-4 border-green-500/20 bg-green-500/10 text-green-400 text-center p-2 rounded-lg">{success}</div>}
            {error && <div className="my-4 border-red-500/20 bg-red-500/10 text-red-400 text-center p-2 rounded-lg">{error}</div>}
            {/* Invoice Number (read-only, with regenerate button) */}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <div className="flex items-center gap-0">
                <Input id="invoiceNumber" name="invoiceNumber" value={form.invoiceNumber} readOnly disabled required className="rounded-r-none flex-1 w-full" />
                <button
                  type="button"
                  className="flex items-center justify-center h-10 w-10 rounded-l-none rounded-r-md bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => setForm(f => ({ ...f, invoiceNumber: generateInvoiceNumber() }))}
                  title="Regenerate Invoice Number"
                  aria-label="Regenerate Invoice Number"
                  style={{ marginLeft: '-0.5rem' }}
                >
                  <IoReloadCircle/>
                </button>
              </div>
            </LabelInputContainer>
            {/* Billables Multi-Select */}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="billables">Billable Hours</Label>
              <div className="relative">
                <select
                  id="billables"
                  name="billables"
                  multiple
                  value={form.billables}
                  onChange={e => {
                    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
                    handleBillablesChange(options);
                  }}
                  className="w-full appearance-none rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-black dark:text-white dark:bg-white/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-8 min-h-[3rem]"
                  required
                >
                  {billablesList.map(b => {
                    const getClientId = (b: Billable) => typeof b.client === 'object' ? b.client._id : b.client;
                    const getProjectId = (b: Billable) => typeof b.project === 'object' ? b.project._id : b.project;
                    const disabled = form.billables.length > 0 && (getClientId(b) !== form.client || getProjectId(b) !== form.project);
                    const clientName = typeof b.client === 'object' ? b.client.client : b.client;
                    const projectName = typeof b.project === 'object' ? b.project.name : b.project;
                    return (
                      <option key={b._id} value={b._id} disabled={disabled}>
                        {b._id} | {clientName} | {projectName} | {b.totalHours}h
                      </option>
                    );
                  })}
                </select>
              </div>
              <span className="text-xs text-neutral-400 mt-1">Select one or more billable hour entries (must match same client and project).</span>
            </LabelInputContainer>
            {/* Auto-filled Client/Project (read-only) */}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="client">Client</Label>
              <Input id="client" name="client" value={(() => {
                const b = billablesList.find(b => b._id === form.billables[0]);
                if (!b) return "";
                if (typeof b.client === "object") return b.client.client;
                return b.client;
              })()} readOnly disabled placeholder="Auto-filled from billables" />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="project">Project</Label>
              <Input id="project" name="project" value={(() => {
                const b = billablesList.find(b => b._id === form.billables[0]);
                if (!b) return "";
                if (typeof b.project === "object") return b.project.name;
                return b.project;
              })()} readOnly disabled placeholder="Auto-filled from billables" />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="hourlyRate">Hourly Rate</Label>
              <Input id="hourlyRate" name="hourlyRate" placeholder="e.g. 120" type="number" value={form.hourlyRate} onChange={handleChange} required />
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
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
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
                  {loading ? "Updating..." : "Update Invoice"}
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

export default EditInvoicePage;
