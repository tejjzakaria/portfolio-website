
"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { FaArrowCircleRight, FaArrowCircleLeft, FaPlusCircle, FaArrowDown } from "react-icons/fa";
import { Navbar } from "@/components/SideBarNav";
import { IconCalendar } from "@tabler/icons-react";

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
);

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const AddProjectPage = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    budget: "",
    deadline: "",
    progress: "0",
    team: "",
    priority: "Low",
    status: "active"
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          budget: Number(form.budget),
          progress: form.progress,
          team: form.team ? form.team.split(",").map((t) => t.trim()) : [],
        })
      });
      if (!res.ok) throw new Error("Failed to add project");
      setSuccess("Project added successfully!");
      setForm({ name: "", description: "", budget: "", deadline: "", progress: "0", team: "", priority: "Low", status: "active" });
    } catch (err: any) {
      setError(err.message || "Error adding project");
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
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Add New Project</h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300 mb-6">Fill out the form to add a new project to the database.</p>
          <form className="my-8" onSubmit={handleSubmit}>
            {success && <div className="my-4 border-green-500/20 bg-green-500/10 text-green-400 text-center p-2 rounded-lg">{success}</div>}
            {error && <div className="my-4 border-red-500/20 bg-red-500/10 text-red-400 text-center p-2 rounded-lg">{error}</div>}
            <LabelInputContainer className="mb-4">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" name="name" placeholder="Enter project name" type="text" value={form.name} onChange={handleChange} required />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                className="h-[10vh] shadow-input dark:placeholder-text-neutral-600 flex w-full rounded-md border border-white/20 bg-white/10 backdrop-blur-md px-3 py-2 text-sm text-black transition-all duration-300 ease-in-out file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-white/40 focus-visible:outline-none focus-visible:bg-white/20 focus-visible:border-white/30 focus-visible:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/5 dark:border-white/10 dark:text-white dark:backdrop-blur-md dark:focus-visible:ring-white/30 dark:focus-visible:bg-white/10 dark:focus-visible:border-white/20"
                placeholder="Enter description"
                value={form.description}
                onChange={handleChange}
                required
                style={{ verticalAlign: "top" }}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="budget">Budget</Label>
              <div className="relative">
                <Input
                  id="budget"
                  name="budget"
                  placeholder="Enter budget"
                  type="number"
                  value={form.budget}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 text-base font-semibold">
                  €
                </span>
              </div>
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="deadline">Deadline</Label>
              <div className="relative">
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-black dark:text-white dark:bg-white/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-6"
                  style={{ paddingRight: '2.2rem' }}
                />
                
              </div>
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="progress">Progress (%)</Label>
              <div className="flex items-center gap-3">
                <input
                  id="progress"
                  name="progress"
                  type="range"
                  min="0"
                  max="100"
                  value={form.progress}
                  onChange={handleChange}
                  className="w-full h-2 rounded-lg bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 appearance-none"
                  style={{
                    background: `linear-gradient(90deg, #3b82f6 ${(Number(form.progress) || 0)}%, #27293d ${(Number(form.progress) || 0)}%)`,
                  }}
                  required
                />
                <span className="w-12 text-right text-sm text-white bg-blue-500/10 rounded px-2 py-1 border border-blue-400/30">{form.progress}%</span>
              </div>
              <style jsx>{`
                input[type='range']::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: linear-gradient(135deg, #6366f1 40%, #06b6d4 100%);
                  border: 2px solid #fff;
                  box-shadow: 0 2px 8px 0 #3b82f6cc;
                  cursor: pointer;
                  transition: background 0.3s;
                }
                input[type='range']:focus::-webkit-slider-thumb {
                  outline: 2px solid #3b82f6;
                }
                input[type='range']::-moz-range-thumb {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: linear-gradient(135deg, #6366f1 40%, #06b6d4 100%);
                  border: 2px solid #fff;
                  box-shadow: 0 2px 8px 0 #3b82f6cc;
                  cursor: pointer;
                  transition: background 0.3s;
                }
                input[type='range']:focus::-moz-range-thumb {
                  outline: 2px solid #3b82f6;
                }
                input[type='range']::-ms-thumb {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: linear-gradient(135deg, #6366f1 40%, #06b6d4 100%);
                  border: 2px solid #fff;
                  box-shadow: 0 2px 8px 0 #3b82f6cc;
                  cursor: pointer;
                  transition: background 0.3s;
                }
                input[type='range']::-webkit-slider-runnable-track {
                  height: 8px;
                  border-radius: 8px;
                  background: transparent;
                }
                input[type='range']::-ms-fill-lower {
                  background: transparent;
                }
                input[type='range']::-ms-fill-upper {
                  background: transparent;
                }
                input[type='range'] {
                  outline: none;
                }
              `}</style>
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="team">Team (comma separated)</Label>
              <Input id="team" name="team" placeholder="e.g. Alice, Bob" type="text" value={form.team} onChange={handleChange} />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="priority">Priority</Label>
              <div className="relative">
                <select
                  id="priority"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-black dark:text-white dark:bg-white/5 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-8"
                  required
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
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
                  {loading ? "Adding..." : "Add Project"}
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

export default AddProjectPage;
