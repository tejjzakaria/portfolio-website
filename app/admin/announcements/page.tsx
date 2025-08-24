// Example 1: Clients Page with Active State
"use client";
import React from "react";
import { usePathname } from "next/navigation"; // For App Router
// import { useRouter } from "next/router"; // For Pages Router
import { Navbar } from "@/components/SideBarNav";
import { DataTable } from "@/components/AnnouncementsTable";
import { announcements } from "@/data";

const AnnouncementsContent = () => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        setLoading(true);
        fetch("/api/announcements")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch announcements");
                return res.json();
            })
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || "Error fetching announcements");
                setLoading(false);
            });
    }, []);

    return (
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
                    {loading ? (
                        <div className="text-white py-8 text-center">Loading announcements...</div>
                    ) : error ? (
                        <div className="text-red-400 py-8 text-center">{error}</div>
                    ) : (
                        <DataTable data={data} />
                    )}
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
