import React from 'react'
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { BellDotIcon, Calendar1Icon, DollarSignIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import { notifications, projectsDash } from '@/data/index'
import { div } from 'motion/react-client'

const RecentProjectsDash = () => {
    const priorityColors: Record<string, string> = {
        Low: "flex gap-1 rounded-lg text-xs border-green-500/20 bg-green-500/10 text-green-400",
        Medium: "flex gap-1 rounded-lg text-xs border-green-500/20 bg-blue-500/10 text-blue-400",
        High: "flex gap-1 rounded-lg text-xs border-red-500/20 bg-red-500/10 text-red-400",
    };
    return (
        <div className="flex flex-col lg:flex-row w-full gap-4 md:gap-6 max-w-7xl mx-auto px-3 sm:px-5 min-h-screen">
            {/* Left column */}
            <div className="w-full lg:w-3/5 p-3 sm:p-5 flex flex-col gap-3 h-full">
                <div className='mb-2'>
                    <h1 className="text-xl sm:text-2xl font-bold">Latest projects</h1>
                    <p className="mt-1 font-light text-sm sm:text-base">A selection of latest projects.</p>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                    {projectsDash.slice(0, 3).map(({ id, name, budget, description, deadline, priority }) => (
                        <Card
                            key={id}
                            className="flex-1 shadow-sm bg-gradient-to-t from-primary/5 to-card dark:bg-card/50 backdrop-blur-sm border-white/10 min-h-[120px] lg:min-h-0"
                        >
                            <CardHeader className="relative p-4 sm:p-6">
                                <Badge
                                    variant="outline"
                                    className="flex w-[70px] gap-1 rounded-lg text-xs border-green-500/20 bg-blue-500/10 text-blue-400"
                                >
                                    <DollarSignIcon className="size-4 sm:size-5" />
                                    <span className="hidden sm:inline">{budget}</span>
                                </Badge>
                                <CardTitle className="text-lg sm:text-xl lg:text-2xl font-semibold tabular-nums text-white mt-2">
                                    {name}
                                </CardTitle>
                                <div className="absolute right-4 top-4">
                                    <Badge
                                        variant="outline"
                                        className={`text-xs ${priorityColors[priority] || "bg-gray-100 text-gray-800"}`}
                                    >
                                        {priority}
                                        <span className="hidden sm:inline ml-1">Priority</span>
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardFooter className="flex-col items-start gap-1 text-sm p-4 sm:p-6 pt-0">
                                <div className="line-clamp-1 flex gap-2 font-medium text-white">
                                    {deadline} <Calendar1Icon className="size-4" />
                                </div>
                                <div className="text-neutral-400 text-xs sm:text-sm line-clamp-2">{description}</div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Right column */}
            <div className="w-full lg:w-2/5 p-3 sm:p-5 flex flex-col gap-3 h-full">
                <div className='mb-2'>
                    <h1 className="text-xl sm:text-2xl font-bold">Latest notifications</h1>
                    <p className="mt-1 font-light text-sm sm:text-base">A selection of latest notifications.</p>
                </div>
                <div className="flex flex-col gap-3 flex-1 max-h-[400px] lg:max-h-none">
                    {notifications.slice(0, 4).map(({ id, title, message }) => (
                        <Card
                            key={id}
                            className="flex-none shadow-sm bg-gradient-to-t from-primary/5 to-card dark:bg-card/50 backdrop-blur-sm border-white/10 min-h-[80px]"
                        >
                            <CardHeader className="p-4 sm:p-6">
                                <CardTitle className="text-white">
                                    <div className="flex justify-start items-center gap-2">
                                        <div className="bg-orange-500/20 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                                            <BellDotIcon className="size-4 sm:size-5 text-orange-500" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h1 className="text-sm sm:text-lg font-semibold truncate">{title}</h1>
                                            <p className="text-xs font-light text-neutral-400 line-clamp-2">{message}</p>
                                        </div>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </div>




    )
}

export default RecentProjectsDash
