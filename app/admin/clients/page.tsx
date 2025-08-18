// Example 1: Clients Page with Active State
"use client";
import React from "react";
import { usePathname } from "next/navigation"; // For App Router
// import { useRouter } from "next/router"; // For Pages Router
import { Navbar } from "@/components/SideBarNav";

const ClientsContent = () => {
    return (
        <div className="flex flex-col items-center justify-start gap-8 border bg-white p-4 dark:border-neutral-700 mx-auto w-full h-full"
            style={{
                background: "rgb(4,7,29)",
                backgroundColor: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}>
            <div className="w-full max-w-7xl pt-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Clients Management</h1>
                {/* Your clients content here */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                    <p className="text-neutral-300">This is where your clients content will go.</p>
                </div>
            </div>
        </div>
    );
};

export default function ClientsPage() {
    // Get current path for active state
    const pathname = usePathname(); // App Router
    // const router = useRouter(); const pathname = router.pathname; // Pages Router

    return (
        <Navbar currentPath={pathname}>
            <ClientsContent />
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