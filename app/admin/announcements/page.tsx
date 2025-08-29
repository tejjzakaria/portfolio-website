// Example 1: Clients Page with Active State
"use client";
import React from "react";
import { usePathname } from "next/navigation"; // For App Router
import AdminSessionGuard from "../AdminSessionGuard";
// import { useRouter } from "next/router"; // For Pages Router
import { Navbar } from "@/components/SideBarNav";
import { DataTable } from "@/components/AnnouncementsTable";
import { announcements } from "@/data";
import { IconPlus } from "@tabler/icons-react";

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
                <div className="flex flex-row justify-between items-center">
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                            All Announcements
                        </h1>
                        <p className="text-neutral-400 text-sm sm:text-base">
                            A list of all announcements.
                        </p>
                    </div>
                    <div>
                        <a href="/admin/announcements/add-announcement">
                            <button className="flex justify-center items-center gap-1 group/btn relative h-10 rounded-lg border border-blue-400/60 bg-gradient-to-br from-blue-500/40 to-cyan-500/30 backdrop-blur-xl backdrop-saturate-200 font-medium text-white transition-all duration-300 hover:from-blue-500/60 hover:to-cyan-500/50 hover:border-blue-300/80 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-98 dark:border-blue-400/40 dark:from-blue-500/35 dark:to-cyan-500/25 dark:hover:from-blue-500/55 dark:hover:to-cyan-500/45 dark:hover:border-blue-300/60 dark:hover:shadow-blue-500/40 p-3">
                                New
                                <IconPlus />
                            </button>
                        </a>
                    </div>
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
    const pathname = usePathname();
    return (
        <AdminSessionGuard>
            <Navbar currentPath={pathname}>
                <AnnouncementsContent />
            </Navbar>
        </AdminSessionGuard>
    );
}
