// Example 1: Clients Page with Active State
"use client";
import React from "react";
import { usePathname } from "next/navigation"; // For App Router
import AdminSessionGuard from "../AdminSessionGuard";
// import { useRouter } from "next/router"; // For Pages Router
import { Navbar } from "@/components/SideBarNav";
import { DataTable } from "@/components/NotificationsTable";
import { notificationsTable } from "@/data";

const NotificationsContent = () => {
    return (
        // Fixed Container Component
        <div className="min-h-screen w-full pt-[8vh]"
            style={{
                background: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                        Notifications
                    </h1>
                    <p className="text-neutral-400 text-sm sm:text-base">
                        Here is a record for your notifications.
                    </p>
                </div>

                {/* DataTable Section */}
                <div className="w-full">
                    <DataTable data={notificationsTable} />
                </div>
            </div>
        </div>
    );
};

export default function NotificationsPage() {
    const pathname = usePathname();
    return (
        <AdminSessionGuard>
            <Navbar currentPath={pathname}>
                <NotificationsContent />
            </Navbar>
        </AdminSessionGuard>
    );
}
