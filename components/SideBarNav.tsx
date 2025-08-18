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

// Logo components
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

// Custom SidebarLink component with active state styling
interface CustomSidebarLinkProps {
    link: {
        label: string;
        href: string;
        icon: React.ReactNode;
    };
    isActive: boolean;
}

// Compact Logout button for same row as user profile
const LogoutLink = ({ href }: { href: string }) => {
    return (
        <a
            href={href}
            className="group flex items-center justify-center p-2.5 rounded-lg transition-all duration-300 ease-in-out relative overflow-hidden border border-red-500/30 bg-red-500/5 hover:bg-red-500/15 hover:border-red-400/50 text-red-300 hover:text-red-200 flex-shrink-0"
            title="Logout"
        >
            {/* Animated background on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-600/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg" />
            
            {/* Icon with special styling */}
            <div className="relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12">
                <IconArrowLeft className="h-5 w-5 shrink-0" />
            </div>
        </a>
    );
};

const CustomSidebarLink = ({ link, isActive }: CustomSidebarLinkProps) => {
    return (
        <a
            href={link.href}
            className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out relative overflow-hidden",
                {
                    // Active state (same as hover)
                    "text-white bg-white/5": isActive,
                    // Inactive state
                    "text-neutral-400 hover:text-white hover:bg-white/5": !isActive,
                }
            )}
        >
            {/* Animated background for both active and hover */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-lg transition-opacity duration-300",
                {
                    "opacity-100": isActive, // Always visible when active
                    "opacity-0 group-hover:opacity-100": !isActive, // Only on hover when inactive
                }
            )} />
            
            {/* Icon styling */}
            <div className={cn(
                "relative z-10 transition-all duration-200",
                {
                    "text-neutral-300 scale-105": isActive, // Same as hover state
                    "text-neutral-500 group-hover:text-neutral-300 group-hover:scale-105": !isActive,
                }
            )}>
                {link.icon}
            </div>
            
            {/* Label styling */}
            <span className={cn(
                "relative z-10 transition-all duration-200 whitespace-nowrap text-extralight",
                {
                    "translate-x-1": isActive, // Same as hover state
                    "group-hover:translate-x-1": !isActive,
                }
            )}>
                {link.label}
            </span>
        </a>
    );
};

// Main Navbar component
interface NavbarProps {
    children: React.ReactNode;
    className?: string;
    currentPath?: string;
}

export function Navbar({ children, className, currentPath }: NavbarProps) {
    // Function to check if a link is active
    const isActiveLink = (href: string) => {
        if (!currentPath) return false;
        // Handle exact matches for dashboard
        if (href === "./dashboard" || href === "/dashboard") {
            return (
                currentPath === "/dashboard" ||
                currentPath === "/" ||
                currentPath === "/admin" ||
                currentPath === "/admin/dashboard"
            );
        }
        // Handle other routes
        return currentPath.includes(href.replace("./", "/"));
    };

    const links = [
        {
            group: "Main",
            items: [
                {
                    label: "Dashboard",
                    href: "./dashboard",
                    icon: <IconBrandTabler className="h-5 w-5 shrink-0 transition-colors duration-200" />,
                },
                {
                    label: "Clients",
                    href: "/admin/clients",
                    icon: <IconUsersGroup className="h-5 w-5 shrink-0 transition-colors duration-200" />,
                },
                {
                    label: "Projects",
                    href: "/admin/projects",
                    icon: <IconFolders className="h-5 w-5 shrink-0 transition-colors duration-200" />,
                },
            ],
        },
        {
            group: "Management",
            items: [
                {
                    label: "Roles",
                    href: "/admin/roles",
                    icon: <IconUserCircle className="h-5 w-5 shrink-0 transition-colors duration-200" />,
                },
                {
                    label: "Team",
                    href: "/admin/team",
                    icon: <IconUserCheck className="h-5 w-5 shrink-0 transition-colors duration-200" />,
                },
                {
                    label: "Announcements",
                    href: "/admin/announcements",
                    icon: <IconSpeakerphone className="h-5 w-5 shrink-0 transition-colors duration-200" />,
                },
            ],
        },
        {
            group: "System",
            items: [
                {
                    label: "Notifications",
                    href: "/admin/notifications",
                    icon: <IconBell className="h-5 w-5 shrink-0 transition-colors duration-200" />,
                },
                {
                    label: "Statuses",
                    href: "/admin/statuses",
                    icon: <IconArrowAutofitHeight className="h-5 w-5 shrink-0 transition-colors duration-200" />,
                },
                {
                    label: "Settings",
                    href: "/admin/settings",
                    icon: <IconSettings className="h-5 w-5 shrink-0 transition-colors duration-200" />,
                },
            ],
        },
    ];

    const [open, setOpen] = useState(false);

    return (
        <div
            className={cn(
                "w-screen flex flex-col overflow-hidden rounded-md border border-neutral-200 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
                "max-h-7xl",
                className
            )}
        >
            <Sidebar open={open} setOpen={setOpen} animate={false}>
                <SidebarBody 
                    className="h-screen fixed justify-between gap-10 backdrop-blur-sm border-r border-white/5"
                    style={{
                        background: "rgb(4,7,29)",
                        backgroundColor: "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                    }}
                >
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        <Logo />
                        <div className="mt-8 flex flex-col gap-6">
                            {links.map((group, groupIdx) => (
                                <div key={groupIdx} className="flex flex-col gap-2">
                                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                        {group.group}
                                    </span>
                                    {group.items.map((link, idx) => (
                                        <CustomSidebarLink
                                            key={link.href}
                                            link={link}
                                            isActive={isActiveLink(link.href)}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        {/* User Profile */}
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
                        {/* Logout button on the same row */}
                        <LogoutLink href="./" />
                    </div>
                </SidebarBody>
            </Sidebar>
            {/* Content area */}
            <div className="flex flex-1 w-full">
                <div className="flex h-full w-full flex-1 flex-col ml-0 md:ml-64 lg:ml-72">
                    {children}
                </div>
            </div>
        </div>
    );
}