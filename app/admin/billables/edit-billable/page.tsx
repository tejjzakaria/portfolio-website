"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/SideBarNav";
import { FaArrowCircleLeft, FaSave } from "react-icons/fa";
import Select from "react-select";

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);

const EditBillablePage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const billableId = searchParams.get("id");
    const [form, setForm] = useState({
        startTime: "",
        endTime: "",
        billable: false,
        totalHours: "",
        project: null as null | { value: string, label: string },
        client: null as null | { value: string, label: string }
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [projects, setProjects] = useState<{ value: string, label: string }[]>([]);
    const [clients, setClients] = useState<{ value: string, label: string }[]>([]);

    // Fetch billable, projects, and clients
    useEffect(() => {
        if (!billableId) return;
        const fetchBillable = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/billable/${billableId}`);
                if (!res.ok) throw new Error("Failed to fetch billable session");
                const data = await res.json();
                setForm({
                    startTime: data.startTime ? data.startTime.slice(0, 19) : "",
                    endTime: data.endTime ? data.endTime.slice(0, 19) : "",
                    billable: data.billable || false,
                    totalHours: data.totalHours?.toString() || "",
                    project: data.project ? { value: data.project._id || data.project, label: data.project.name || data.project } : null,
                    client: data.client ? { value: data.client._id || data.client, label: data.client.client || data.client.name || data.client } : null
                });
            } catch (err: any) {
                setError(err.message || "Error fetching billable session");
            } finally {
                setLoading(false);
            }
        };
        fetchBillable();
    }, [billableId]);

    // Fetch projects and clients for dropdowns
    useEffect(() => {
        fetch("/api/projects")
            .then(res => res.json())
            .then(data => {
                const safeProjects = (data.projects || [])
                  .filter((p: any) => p.id && (p.name || p.project))
                  .map((p: any) => ({
                    value: p.id,
                    label: p.name || p.project,
                }));
                setProjects(safeProjects);
            });
        fetch("/api/clients")
            .then(res => res.json())
            .then(data => {
                const safeClients = (data.clients || [])
                  .filter((c: any) => c.id && (c.client || c.name))
                  .map((c: any) => ({
                    value: c.id,
                    label: c.client || c.name,
                }));
                setClients(safeClients);
            });
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => {
            let updated = { ...prev, [name]: value };
            // If startTime or endTime changes, recalculate totalHours
            if (name === "startTime" || name === "endTime") {
                const start = new Date(name === "startTime" ? value : updated.startTime);
                const end = new Date(name === "endTime" ? value : updated.endTime);
                if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
                    const diffMs = end.getTime() - start.getTime();
                    updated.totalHours = (diffMs / 3600000).toFixed(2); // decimal hours
                } else {
                    updated.totalHours = "";
                }
            }
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");
        try {
            const res = await fetch(`/api/billable/${billableId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    startTime: new Date(form.startTime).toISOString(),
                    endTime: new Date(form.endTime).toISOString(),
                    billable: form.billable,
                    totalHours: Number(form.totalHours),
                    project: form.project?.value,
                    client: form.client?.value
                })
            });
            if (!res.ok) throw new Error("Failed to update billable session");
            setSuccess("Billable session updated successfully!");
            setTimeout(() => router.push("/admin/billables"), 1000);
        } catch (err: any) {
            setError(err.message || "Error updating billable session");
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
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Edit Billable Session</h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 mb-6">Update the billable session details below.</p>
            <form className="my-8" onSubmit={handleSubmit}>
              {success && <div className="my-4 border-green-500/20 bg-green-500/10 text-green-400 text-center p-2 rounded-lg">{success}</div>}
              {error && <div className="my-4 border-red-500/20 bg-red-500/10 text-red-400 text-center p-2 rounded-lg">{error}</div>}
              <div className="grid grid-cols-1 gap-6 mb-6">
                <LabelInputContainer>
                  <Label htmlFor="startTime" className="text-base mb-1">Start Time</Label>
                  <Input id="startTime" name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} required className="rounded-lg px-4 py-3 text-base" />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="endTime" className="text-base mb-1">End Time</Label>
                  <Input id="endTime" name="endTime" type="datetime-local" value={form.endTime} onChange={handleChange} required className="rounded-lg px-4 py-3 text-base" />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="billable" className="text-base mb-1">Billable</Label>
                  <select
                    id="billable"
                    name="billable"
                    value={form.billable ? "true" : "false"}
                    onChange={e => setForm(f => ({ ...f, billable: e.target.value === "true" }))}
                    className="w-full appearance-none rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-base text-black dark:text-white dark:bg-white/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-8"
                    required
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="project" className="text-base mb-1">Project</Label>
                  <Select
                    id="project"
                    name="project"
                    value={form.project}
                    onChange={option => setForm(f => ({ ...f, project: option }))}
                    options={projects}
                    placeholder="Select a project"
                    isClearable
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        borderColor: 'rgba(255,255,255,0.25)',
                        color: 'white',
                        minHeight: 48,
                        fontSize: 18,
                        borderRadius: 12,
                        paddingLeft: 2,
                        paddingRight: 2,
                      }),
                      singleValue: (base) => ({ ...base, color: 'white', fontSize: 18 }),
                      menu: (base) => ({ ...base, backgroundColor: '#10121b', color: 'white', fontSize: 18 }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? 'rgba(31,38,135,0.18)' : 'transparent',
                        color: 'white',
                        fontSize: 18,
                        borderRadius: 8,
                        margin: 2,
                        padding: 10,
                      }),
                      input: (base) => ({ ...base, color: 'white', fontSize: 18 }),
                    }}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="client" className="text-base mb-1">Client</Label>
                  <Select
                    id="client"
                    name="client"
                    value={form.client}
                    onChange={option => setForm(f => ({ ...f, client: option }))}
                    options={clients}
                    placeholder="Select a client"
                    isClearable
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        borderColor: 'rgba(255,255,255,0.25)',
                        color: 'white',
                        minHeight: 48,
                        fontSize: 18,
                        borderRadius: 12,
                        paddingLeft: 2,
                        paddingRight: 2,
                      }),
                      singleValue: (base) => ({ ...base, color: 'white', fontSize: 18 }),
                      menu: (base) => ({ ...base, backgroundColor: '#10121b', color: 'white', fontSize: 18 }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? 'rgba(31,38,135,0.18)' : 'transparent',
                        color: 'white',
                        fontSize: 18,
                        borderRadius: 8,
                        margin: 2,
                        padding: 10,
                      }),
                      input: (base) => ({ ...base, color: 'white', fontSize: 18 }),
                    }}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="totalHours" className="text-base mb-1">Total Hours (decimal)</Label>
                  <Input id="totalHours" name="totalHours" type="text" value={form.totalHours} readOnly className="bg-gray-900/30 cursor-not-allowed rounded-lg px-4 py-3 text-base" />
                </LabelInputContainer>
              </div>
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

export default EditBillablePage;
