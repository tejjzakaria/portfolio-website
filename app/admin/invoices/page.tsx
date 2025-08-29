// Example 1: Clients Page with Active State
"use client";
import React from "react";
import { usePathname } from "next/navigation"; // For App Router
import AdminSessionGuard from "../AdminSessionGuard";
// import { useRouter } from "next/router"; // For Pages Router
import { Navbar } from "@/components/SideBarNav";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/InvoicesTable";
import { IconPlus } from "@tabler/icons-react";

const InvoicesContent = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetch("/api/invoice");
                if (!res.ok) throw new Error("Failed to fetch invoices");
                const data = await res.json();
                setInvoices(data || []);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Error fetching invoices");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    return (
        <div className="min-h-screen w-full pt-[8vh] px-[5vw]"
            style={{
                background: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-row justify-between items-center">
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                            All Invoices
                        </h1>
                        <p className="text-neutral-400 text-sm sm:text-base">
                            A list of all invoices.
                        </p>
                    </div>
                    <div>
                        <a href="/admin/invoices/add-invoice">
                            <button className="flex justify-center items-center gap-1 group/btn relative h-10 rounded-lg border border-blue-400/60 bg-gradient-to-br from-blue-500/40 to-cyan-500/30 backdrop-blur-xl backdrop-saturate-200 font-medium text-white transition-all duration-300 hover:from-blue-500/60 hover:to-cyan-500/50 hover:border-blue-300/80 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-98 dark:border-blue-400/40 dark:from-blue-500/35 dark:to-cyan-500/25 dark:hover:from-blue-500/55 dark:hover:to-cyan-500/45 dark:hover:border-blue-300/60 dark:hover:shadow-blue-500/40 p-3">
                                New
                                <IconPlus />
                            </button>
                        </a>
                    </div>
                </div>
                <div className="w-full">
                    {loading ? (
                        <div className="text-white text-center py-8">Loading invoices...</div>
                    ) : error ? (
                        <div className="text-red-400 text-center py-8">{error}</div>
                    ) : (
                        <DataTable data={invoices} />
                    )}
                </div>
            </div>
        </div>
    );
};


export default function InvoicesPage() {
    const pathname = usePathname();
    return (
        <AdminSessionGuard>
            <Navbar currentPath={pathname}>
                <InvoicesContent />
            </Navbar>
        </AdminSessionGuard>
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