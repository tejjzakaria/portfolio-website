// Example 1: Clients Page with Active State
"use client";
import React from "react";
import { usePathname } from "next/navigation"; // For App Router
// import { useRouter } from "next/router"; // For Pages Router
import { Navbar } from "@/components/SideBarNav";
import { DataTable } from "@/components/TeamTable";
import { team } from "@/data";
import { PauseCircle, PauseIcon, PlayIcon, StopCircle, StopCircleIcon } from "lucide-react";


const TimerContent = () => {

    const [time, setTime] = React.useState(0); // in ms
    const [isRunning, setIsRunning] = React.useState(false);
    const [intervalId, setIntervalId] = React.useState<NodeJS.Timeout | null>(null);
    const [sessionStart, setSessionStart] = React.useState<Date | null>(null);
    const [sessionEnd, setSessionEnd] = React.useState<Date | null>(null);

    React.useEffect(() => {
        if (isRunning) {
            const id = setInterval(() => {
                setTime((prev) => prev + 10);
            }, 10);
            setIntervalId(id);
        } else if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
        // Cleanup on unmount
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRunning]);

    const handleStart = () => {
        if (!isRunning) {
            setSessionStart(new Date());
        }
        setIsRunning(true);
    };
    const handlePause = () => setIsRunning(false);

    const [showConfirm, setShowConfirm] = React.useState(false);
    const [showBillable, setShowBillable] = React.useState(false);
    const [pendingStop, setPendingStop] = React.useState(false);
    const handleStop = () => {
        setSessionEnd(new Date());
        setShowConfirm(true);
    };
    const confirmStop = () => {
        setShowConfirm(false);
        setShowBillable(true);
        setPendingStop(true);
    };
    const cancelStop = () => {
        setShowConfirm(false);
    };

    // Billable logic
    const [showSuccess, setShowSuccess] = React.useState(false);
    const handleBillable = async (isBillable: boolean) => {
        setIsRunning(false);
        setShowBillable(false);
        setPendingStop(false);
        const start = sessionStart;
        const end = new Date();
        setSessionEnd(end);
        const totalHours = time / 3600000;
        let success = false;
        if (start && end && totalHours > 0) {
            try {
                const res = await fetch('/api/billable', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        startTime: start,
                        endTime: end,
                        billable: isBillable,
                        totalHours,
                    }),
                });
                if (res.ok) success = true;
            } catch (err) {
                // Optionally show error toast
            }
        }
        setTime(0);
        setSessionStart(null);
        setSessionEnd(null);
        setShowSuccess(success);
        if (success) {
            setTimeout(() => {
                setShowSuccess(false);
                if (typeof window !== 'undefined') {
                    window.location.href = '/admin/timer';
                }
            }, 1500);
        }
    };

    const pad = (n: number, len = 2) => n.toString().padStart(len, '0');
    const hrs = Math.floor(time / 3600000);
    const mins = Math.floor((time % 3600000) / 60000);
    const secs = Math.floor((time % 60000) / 1000);
    const ms = Math.floor((time % 1000) / 10);

    return (
        <div className="min-h-screen w-full pt-[8vh]"
            style={{
                background: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                        Timer
                    </h1>
                    <p className="text-neutral-400 text-sm sm:text-base">
                        Record work sessions here.
                    </p>
                </div>
                {/* Timer UI */}
                <div className="flex flex-col items-center justify-center gap-6 mt-12">
                    <div className="text-5xl sm:text-6xl font-mono font-bold text-white tracking-widest bg-white/5 rounded-xl px-8 py-6 border border-white/10 shadow-lg">
                        {pad(hrs)}:{pad(mins)}:{pad(secs)}<span className="text-3xl font-mono font-bold text-white/70">.{pad(ms)}</span>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handleStart}
                            className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-lg shadow transition disabled:opacity-60"
                            disabled={isRunning}
                        >
                            <PlayIcon/>
                        </button>
                        <button
                            onClick={handlePause}
                            className="px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-lg shadow transition disabled:opacity-60"
                            disabled={!isRunning}
                        >
                            <PauseIcon/>
                        </button>
                        <button
                            onClick={handleStop}
                            className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm shadow transition"
                        >
                            <StopCircleIcon/>
                        </button>
                    </div>
                    {showConfirm && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ pointerEvents: 'auto', background: 'rgba(16,18,27,0.85)' }}>
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
                                <h3 className="text-lg font-semibold mb-2 text-center text-white">Stop Timer?</h3>
                                <p className="text-sm text-neutral-300 mb-4 text-center">Are you sure you want to stop and reset the timer?</p>
                                <div className="flex gap-2 w-full">
                                    <button className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold" onClick={confirmStop}>Stop</button>
                                    <button className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20" onClick={cancelStop}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showSuccess && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ pointerEvents: 'auto', background: 'rgba(16,18,27,0.85)' }}>
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
                                <h3 className="text-lg font-semibold mb-2 text-center text-white">Session Recorded</h3>
                                <p className="text-sm text-neutral-300 mb-2 text-center">Your work session has been recorded successfully.</p>
                            </div>
                        </div>
                    )}
                    {showBillable && !showSuccess && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ pointerEvents: 'auto', background: 'rgba(16,18,27,0.85)' }}>
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
                                <h3 className="text-lg font-semibold mb-2 text-center text-white">Billable Session?</h3>
                                <p className="text-sm text-neutral-300 mb-4 text-center">Is this work session billable?</p>
                                <div className="flex gap-2 w-full">
                                    <button className="flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold" onClick={() => handleBillable(true)}>Yes</button>
                                    <button className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20" onClick={() => handleBillable(false)}>No</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function TimerPage() {
    // Get current path for active state
    const pathname = usePathname(); // App Router
    // const router = useRouter(); const pathname = router.pathname; // Pages Router

    return (
        <Navbar currentPath={pathname}>
            <TimerContent />
        </Navbar>
    );
}

// Example 2: Projects Page with Active State
const ProjectsContent = () => {
    return (
        <div className="flex flex-col items-center justify-start gap-8 border bg-white p-4 dark:border-neutral-700 mx-auto w-full h-full"
            style={{
                background: "rgb(4,7,29)",
                backgroundColor: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}>
            <div className="w-full max-w-7xl pt-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Projects Overview</h1>
                {/* Your projects content here */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 group hover:bg-white/10 transition-all duration-300">
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">Project Alpha</h3>
                        <p className="text-neutral-300">Description of project alpha...</p>
                        <div className="mt-4 flex gap-2">
                            <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">
                                Active
                            </span>
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                                Frontend
                            </span>
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 group hover:bg-white/10 transition-all duration-300">
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">Project Beta</h3>
                        <p className="text-neutral-300">Description of project beta...</p>
                        <div className="mt-4 flex gap-2">
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                                In Progress
                            </span>
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                                Full Stack
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function ProjectsPage() {
    const pathname = usePathname();

    return (
        <Navbar currentPath={pathname}>
            <ProjectsContent />
        </Navbar>
    );
}

// Example 3: Settings Page with Active State
const SettingsContent = () => {
    return (
        <div className="flex flex-col items-center justify-start gap-8 border bg-white p-4 dark:border-neutral-700 mx-auto w-full h-full"
            style={{
                background: "rgb(4,7,29)",
                backgroundColor: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}>
            <div className="w-full max-w-7xl pt-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Settings</h1>
                {/* Your settings content here */}
                <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all duration-300">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            Account Settings
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all duration-300">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            Preferences
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <span className="text-neutral-300">Dark Mode</span>
                                <button className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-md text-white text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg">
                                    Enabled
                                </button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                                <span className="text-neutral-300">Notifications</span>
                                <button className="bg-white/10 px-4 py-2 rounded-md text-neutral-300 text-sm font-medium border border-white/20 hover:bg-white/20 transition-all duration-200">
                                    Disabled
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function SettingsPage() {
    const pathname = usePathname();

    return (
        <Navbar currentPath={pathname}>
            <SettingsContent />
        </Navbar>
    );
}