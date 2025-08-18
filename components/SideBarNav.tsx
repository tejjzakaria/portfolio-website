"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/SideBar";
import {
    IconArrowAutofitHeight,
    IconArrowLeft,
    IconBell,
    IconBrandTabler,
    IconFolders,
    IconSettings,
    IconSpeakerphone,
    IconUserBolt,
    IconUserCheck,
    IconUserCircle,
    IconUsersGroup,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function SidebarNav() {
    const links = [
        {
            label: "Dashboard",
            href: "./dashboard",
            icon: (
                <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Clients",
            href: "/admin/clients",
            icon: (
                <IconUsersGroup className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Projects",
            href: "/admin/projects",
            icon: (
                <IconFolders className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Notifications",
            href: "./admin/notifications",
            icon: (
                <IconBell className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Statuses",
            href: "/admin/statuses",
            icon: (
                <IconArrowAutofitHeight className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Team",
            href: "/admin/team",
            icon: (
                <IconUserCheck className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Announcements",
            href: "/admin/announcements",
            icon: (
                <IconSpeakerphone className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Roles",
            href: "/admin/roles",
            icon: (
                <IconUserCircle className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Settings",
            href: "/admin/settings",
            icon: (
                <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },

        {
            label: "Logout",
            href: "./",
            icon: (
                <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
    ];
    const [open, setOpen] = useState(false);
    return (

        
        <div
            className={cn(
                "w-screen flex flex-col overflow-hidden rounded-md border border-neutral-200 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
                "h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
            )}
        >
            <Sidebar open={open} setOpen={setOpen} animate={false}>
                <SidebarBody className="justify-between gap-10 backdrop-blur-sm border-r border-white/5"
                    style={{
                        background: "rgb(4,7,29)",
                        backgroundColor:
                            "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                    }}>
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        <>
                            <Logo />
                        </>
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "Z.Tejjani",
                                role: "The Bossman",
                                href: "",
                                icon: (
                                    <img
                                        src="/avatar.png"
                                        className="h-10 w-10 object-cover shrink-0 rounded-full"
                                        alt="Avatar"
                                    />
                                ),

                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <Dashboard />
        </div>
    );
}
export const Logo = () => {
    return (
        <a
            href="#"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium whitespace-pre text-black dark:text-white"
            >
                tejjzakaria
            </motion.span>
        </a>
    );
};
export const LogoIcon = () => {
    return (
        <a
            href="#"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
        >
            <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
        </a>
    );
};

// Dummy dashboard component with content
const Dashboard = () => {
    return (
        <div className="flex flex-1">
            <div className="flex h-full w-full flex-1 flex-col gap-2 border bg-white p-2 md:p-10 dark:border-neutral-70" style={{
                background: "rgb(4,7,29)",
                backgroundColor:
                    "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}>
                <div className="flex gap-2">
                    
                </div>
                <div className="flex flex-1 gap-2">
                    
                </div>
            </div>
        </div>
    );
};
