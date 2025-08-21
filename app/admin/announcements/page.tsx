// Example 1: Clients Page with Active State
"use client";
import React from "react";
import { usePathname } from "next/navigation"; // For App Router
// import { useRouter } from "next/router"; // For Pages Router
import { Navbar } from "@/components/SideBarNav";
import { DataTable } from "@/components/AnnouncementsTable";
import { announcements } from "@/data";

const AnnouncementsContent = () => {
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
                        Announcements
                    </h1>
                    <p className="text-neutral-400 text-sm sm:text-base">
                        Here is a record for your announcements
                    </p>
                </div>

                {/* DataTable Section */}
                <div className="w-full">
                    <DataTable data={announcements} />
                </div>
            </div>
        </div>
    );
};

export default function AnnouncementsPage() {
    // Get current path for active state
    const pathname = usePathname(); // App Router
    // const router = useRouter(); const pathname = router.pathname; // Pages Router

    return (
        <Navbar currentPath={pathname}>
            <AnnouncementsContent />
        </Navbar>
    );
}
