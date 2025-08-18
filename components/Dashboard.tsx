"use client";
import React from "react";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { DataTable } from "./UsersTable";
import { clients } from "@/data";
import RecentProjectsDash from "./RecentProjectsDash";
import { Navbar } from "./SideBarNav"; // Import the separated navbar

// Dashboard content component (without navbar)
const DashboardContent = () => {
    const Step = ({ title }: { title: string }) => {
        return (
            <li className="flex gap-2 items-start">
                <CheckIcon />
                <p className="text-white">{title}</p>
            </li>
        );
    };

    const CheckIcon = () => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 text-blue-500 mt-1 shrink-0"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                    d="M12 2c-.218 0 -.432 .002 -.642 .005l-.616 .017l-.299 .013l-.579 .034l-.553 .046c-4.785 .464 -6.732 2.411 -7.196 7.196l-.046 .553l-.034 .579c-.005 .098 -.01 .198 -.013 .299l-.017 .616l-.004 .318l-.001 .324c0 .218 .002 .432 .005 .642l.017 .616l.013 .299l.034 .579l.046 .553c.464 4.785 2.411 6.732 7.196 7.196l.553 .046l.579 .034c.098 .005 .198 .01 .299 .013l.616 .017l.642 .005l.642 -.005l.616 -.017l.299 -.013l.579 -.034l.553 -.046c4.785 -.464 6.732 -2.411 7.196 -7.196l.046 -.553l.034 -.579c.005 -.098 .01 -.198 .013 -.299l.017 -.616l.005 -.642l-.005 -.642l-.017 -.616l-.013 -.299l-.034 -.579l-.046 -.553c-.464 -4.785 -2.411 -6.732 -7.196 -7.196l-.553 -.046l-.579 -.034a28.058 28.058 0 0 0 -.299 -.013l-.616 -.017l-.318 -.004l-.324 -.001zm2.293 7.293a1 1 0 0 1 1.497 1.32l-.083 .094l-4 4a1 1 0 0 1 -1.32 .083l-.094 -.083l-2 -2a1 1 0 0 1 1.32 -1.497l.094 .083l1.293 1.292l3.293 -3.292z"
                    fill="currentColor"
                    strokeWidth="0"
                />
            </svg>
        );
    };

    return (
        <div className="flex flex-col items-center justify-start gap-8 border bg-white p-4 dark:border-neutral-700 mx-auto w-full h-full"
            style={{
                background: "rgb(4,7,29)",
                backgroundColor: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}>

            {/* Stats Cards Section */}
            <div className="w-full max-w-7xl pt-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 px-4 lg:px-6">
                    <Card className="@container/card shadow-sm bg-gradient-to-t from-primary/5 to-card dark:bg-card/50 backdrop-blur-sm border-white/10">
                        <CardHeader className="relative">
                            <CardDescription className="text-neutral-400">Total Revenue</CardDescription>
                            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-white">
                                $1,250.00
                            </CardTitle>
                            <div className="absolute right-4 top-4">
                                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs border-green-500/20 bg-green-500/10 text-green-400">
                                    <TrendingUpIcon className="size-3" />
                                    +12.5%
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1 text-sm">
                            <div className="line-clamp-1 flex gap-2 font-medium text-white">
                                Trending up this month <TrendingUpIcon className="size-4" />
                            </div>
                            <div className="text-neutral-400">
                                Visitors for the last 6 months
                            </div>
                        </CardFooter>
                    </Card>

                    <Card className="@container/card shadow-sm bg-gradient-to-t from-primary/5 to-card dark:bg-card/50 backdrop-blur-sm border-white/10">
                        <CardHeader className="relative">
                            <CardDescription className="text-neutral-400">New Customers</CardDescription>
                            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-white">
                                1,234
                            </CardTitle>
                            <div className="absolute right-4 top-4">
                                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs border-red-500/20 bg-red-500/10 text-red-400">
                                    <TrendingDownIcon className="size-3" />
                                    -20%
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1 text-sm">
                            <div className="line-clamp-1 flex gap-2 font-medium text-white">
                                Down 20% this period <TrendingDownIcon className="size-4" />
                            </div>
                            <div className="text-neutral-400">
                                Acquisition needs attention
                            </div>
                        </CardFooter>
                    </Card>

                    <Card className="@container/card shadow-sm bg-gradient-to-t from-primary/5 to-card dark:bg-card/50 backdrop-blur-sm border-white/10">
                        <CardHeader className="relative">
                            <CardDescription className="text-neutral-400">Active Accounts</CardDescription>
                            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-white">
                                45,678
                            </CardTitle>
                            <div className="absolute right-4 top-4">
                                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs border-green-500/20 bg-green-500/10 text-green-400">
                                    <TrendingUpIcon className="size-3" />
                                    +12.5%
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1 text-sm">
                            <div className="line-clamp-1 flex gap-2 font-medium text-white">
                                Strong user retention <TrendingUpIcon className="size-4" />
                            </div>
                            <div className="text-neutral-400">Engagement exceed targets</div>
                        </CardFooter>
                    </Card>

                    <Card className="@container/card shadow-sm bg-gradient-to-t from-primary/5 to-card dark:bg-card/50 backdrop-blur-sm border-white/10">
                        <CardHeader className="relative">
                            <CardDescription className="text-neutral-400">Growth Rate</CardDescription>
                            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums text-white">
                                4.5%
                            </CardTitle>
                            <div className="absolute right-4 top-4">
                                <Badge variant="outline" className="flex gap-1 rounded-lg text-xs border-green-500/20 bg-green-500/10 text-green-400">
                                    <TrendingUpIcon className="size-3" />
                                    +4.5%
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1 text-sm">
                            <div className="line-clamp-1 flex gap-2 font-medium text-white">
                                Steady performance <TrendingUpIcon className="size-4" />
                            </div>
                            <div className="text-neutral-400">Meets growth projections</div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <RecentProjectsDash />

            {/* DataTable Section */}
            <div className="w-full flex flex-row max-w-7xl pb-8 justify-between items-center gap-4 px-7 hidden">
                <div className="col-span-2">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Latest Clients</h1>
                        <p className="text-neutral-400">
                            A glimpse of your recent registered clients.
                        </p>
                    </div>
                    <div className="@container/main">
                        <DataTable data={clients} />
                    </div>
                </div>
                <div className="">
                    <h1>xnxx</h1>
                </div>
            </div>
        </div>
    );
};

// Main Dashboard component with navbar
export function Dashboard() {
    return (
        <Navbar>
            <DashboardContent />
        </Navbar>
    );
}

// Export the original SidebarNav for backward compatibility (optional)
export const SidebarNav = Dashboard;