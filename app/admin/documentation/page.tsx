// Example 1: Clients Page with Active State
"use client";
import React from "react";
import { usePathname } from "next/navigation"; // For App Router
import AdminSessionGuard from "../AdminSessionGuard";
// import { useRouter } from "next/router"; // For Pages Router
import { Navbar } from "@/components/SideBarNav";
import { DataTable } from "@/components/NotificationsTable";
import { notificationsTable } from "@/data";


import { BookOpenIcon, UsersIcon, FileTextIcon, BellIcon, FilePlusIcon, FileEditIcon, Trash2Icon, ShieldCheckIcon, LayoutDashboardIcon } from "lucide-react";

const DocumentationContent = () => {
    return (
        <div className="min-h-screen w-full pt-[8vh] relative overflow-x-hidden"
            style={{
                background: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}>
            {/* Decorative shapes */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-500/30 to-cyan-400/20 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-purple-500/20 to-pink-400/10 rounded-full blur-2xl -z-10 animate-pulse" />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header Section */}
                <div className="mb-10 text-center">
                    <BookOpenIcon className="mx-auto mb-2 text-blue-400" size={40} />
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                        Portfolio Admin Dashboard Documentation
                    </h1>
                    <p className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto">
                        Welcome to your modern Next.js 14 admin dashboard for managing your portfolio, team, invoices, and more. This documentation will guide you through the features and how to use them.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center shadow-lg backdrop-blur-xl">
                        <LayoutDashboardIcon className="text-blue-400 mb-2" size={32} />
                        <h2 className="font-semibold text-lg text-white mb-1">Dashboard Overview</h2>
                        <p className="text-neutral-300 text-sm">Get a quick summary of your portfolio, team, and recent activity with beautiful charts and stats.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center shadow-lg backdrop-blur-xl">
                        <UsersIcon className="text-cyan-400 mb-2" size={32} />
                        <h2 className="font-semibold text-lg text-white mb-1">Team Management</h2>
                        <p className="text-neutral-300 text-sm">Add, edit, and remove team members. Upload avatars, assign roles, and manage statuses with a robust table and confirmation modals.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center shadow-lg backdrop-blur-xl">
                        <FileTextIcon className="text-purple-400 mb-2" size={32} />
                        <h2 className="font-semibold text-lg text-white mb-1">Invoices</h2>
                        <p className="text-neutral-300 text-sm">Full-featured invoice management: create, edit, delete, export to PDF, and track payment status. Attach files and view details in a dynamic table.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center text-center shadow-lg backdrop-blur-xl">
                        <BellIcon className="text-pink-400 mb-2" size={32} />
                        <h2 className="font-semibold text-lg text-white mb-1">Announcements & Notifications</h2>
                        <p className="text-neutral-300 text-sm">Post announcements, manage notifications, and keep your team up to date. Edit/delete with confirmation and see all history in a searchable table.</p>
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><ShieldCheckIcon className="text-green-400" /> How It Works</h2>
                    <ul className="list-none space-y-4 text-neutral-200">
                        <li className="flex items-start gap-3"><FilePlusIcon className="text-blue-400 mt-1" /> <span><b>Add:</b> Use the <span className="font-mono bg-blue-500/10 px-2 py-1 rounded">Add</span> buttons to create new team members, invoices, or announcements. Upload files and images as needed.</span></li>
                        <li className="flex items-start gap-3"><FileEditIcon className="text-yellow-400 mt-1" /> <span><b>Edit:</b> Click the <span className="font-mono bg-yellow-400/10 px-2 py-1 rounded">Edit</span> action in any table row to update details. Forms are validated and easy to use.</span></li>
                        <li className="flex items-start gap-3"><Trash2Icon className="text-red-400 mt-1" /> <span><b>Delete:</b> Remove items with a confirmation popup to prevent mistakes. Deletions are instant and safe.</span></li>
                        <li className="flex items-start gap-3"><ShieldCheckIcon className="text-green-400 mt-1" /> <span><b>Secure:</b> All actions are protected and validated. Data is stored securely in MongoDB via Mongoose models and Next.js API routes.</span></li>
                    </ul>
                </div>

                {/* Tech Stack Section */}
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-8 shadow-xl mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><BookOpenIcon className="text-blue-400" /> Tech Stack</h2>
                    <div className="flex flex-wrap gap-4 text-neutral-200">
                        <span className="bg-white/10 px-3 py-1 rounded-full">Next.js 14</span>
                        <span className="bg-white/10 px-3 py-1 rounded-full">React 18</span>
                        <span className="bg-white/10 px-3 py-1 rounded-full">Tailwind CSS</span>
                        <span className="bg-white/10 px-3 py-1 rounded-full">MongoDB & Mongoose</span>
                        <span className="bg-white/10 px-3 py-1 rounded-full">Lucide Icons</span>
                        <span className="bg-white/10 px-3 py-1 rounded-full">Sonner Toasts</span>
                        <span className="bg-white/10 px-3 py-1 rounded-full">Recharts</span>
                    </div>
                </div>

                {/* Quick Start Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><FilePlusIcon className="text-blue-400" /> Quick Start</h2>
                    <ol className="list-decimal list-inside space-y-2 text-neutral-200">
                        <li>Clone the repository and install dependencies with <span className="font-mono bg-white/10 px-2 py-1 rounded">npm install</span>.</li>
                        <li>Set up your <span className="font-mono bg-white/10 px-2 py-1 rounded">.env</span> file for MongoDB and any other secrets.</li>
                        <li>Run the development server: <span className="font-mono bg-white/10 px-2 py-1 rounded">npm run dev</span>.</li>
                        <li>Access the admin dashboard at <span className="font-mono bg-white/10 px-2 py-1 rounded">/admin</span> and start managing your content!</li>
                    </ol>
                </div>

                {/* Footer */}
                <div className="text-center text-neutral-500 text-xs mt-8">
                    &copy; {new Date().getFullYear()} Portfolio Admin Dashboard. Built with Next.js 14.
                </div>
            </div>
        </div>
    );
};

export default function DocumentationPage() {
    const pathname = usePathname();
    return (
        <AdminSessionGuard>
            <Navbar currentPath={pathname}>
                <DocumentationContent />
            </Navbar>
        </AdminSessionGuard>
    );
}
