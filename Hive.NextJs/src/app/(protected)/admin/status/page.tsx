'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiMail, FiLinkedin, FiInbox } from 'react-icons/fi';

interface InfoItem {
    name: string;
    value: string;
}

interface ToolItem {
    category: string;
    links: { name: string; href: string; icon: React.ElementType }[];
}

export default function DashboardPage() {
    const [currentTime, setCurrentTime] = useState('');
    const [timeZone, setTimeZone] = useState('');

    useEffect(() => {
        setCurrentTime(new Date().toLocaleString());
        setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, []);

    const systemInfo: InfoItem[] = [
        { name: 'System Name', value: 'Hive Demo' },
        { name: 'Current Time', value: currentTime || 'Loading...' },
        { name: 'Time Zone', value: timeZone || 'Loading...' },
    ];

    const projectInfo: InfoItem[] = [
        { name: 'Services', value: '2' },
        { name: 'Users', value: '7' },
        { name: 'Is Active', value: 'Yes' },
    ];

    const tools: ToolItem[] = [
        { category: 'Email', links: [{ name: 'Send Email', href: '#', icon: FiMail }] },
        { category: 'LinkedIn Profiles', links: [{ name: 'Manage LinkedIn Profile', href: '#', icon: FiLinkedin }] },
        {
            category: 'Imports',
            links: [
                { name: 'Import Data from Other Project', href: '#', icon: FiInbox },
                { name: 'Import Data from Other System', href: '#', icon: FiInbox },
                { name: 'Transfer Data', href: '#', icon: FiInbox },
            ],
        },
        {
            category: 'Sys Op Miscellaneous',
            links: [
                { name: 'Remove File Errors', href: '#', icon: FiInbox },
                { name: 'Banned Ip Address', href: '#', icon: FiInbox },
                { name: 'Transfer', href: '#', icon: FiInbox },
            ],
        },
        {
            category: 'Configuration',
            links: [
                { name: 'Email Notification Configurations', href: '#', icon: FiInbox },
                { name: 'Import from Other System', href: '#', icon: FiInbox },
                { name: 'Transfer', href: '#', icon: FiInbox },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-bg text-fg">
            {/* Header */}
            <h3 className="text-2xl font-bold text-white text-center bg-primary-hover py-2 shadow">
                Status
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4 px-4">
                {/* LEFT TABLES */}
                <div className="space-y-4">
                    {/* System Info */}
                    <div className="bg-card rounded-lg shadow border border-border">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-primary">
                                    <th colSpan={2} className="text-white px-4 py-2 font-semibold text-left">
                                        System Information
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {systemInfo.map((item, idx) => (
                                    <tr
                                        key={item.name}
                                        className={idx % 2 === 0 ? 'bg-segment-bg' : ''}
                                    >
                                        <td className="px-4 py-2 font-medium border border-border w-1/3">
                                            {item.name}
                                        </td>
                                        <td className="px-4 py-2 text-muted border border-border">
                                            {item.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Hive Info */}
                    <div className="bg-card rounded-lg shadow border border-border">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-primary">
                                    <th colSpan={2} className="text-white px-4 py-2 font-semibold text-left">
                                        HIVE Information
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {projectInfo.map((item, idx) => (
                                    <tr
                                        key={item.name}
                                        className={idx % 2 === 0 ? 'bg-segment-bg' : ''}
                                    >
                                        <td className="px-4 py-2 font-medium border border-border w-1/3">
                                            {item.name}
                                        </td>
                                        <td className="px-4 py-2 text-muted border border-border">
                                            {item.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT TOOLS TABLE */}
                <div className="bg-card rounded-lg shadow border border-border overflow-hidden">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-primary">
                                <th colSpan={2} className="text-white px-4 py-2 font-semibold text-left">
                                    Tools & Imports
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tools.map((tool, idx) => (
                                <tr
                                    key={tool.category}
                                    className={idx % 2 === 0 ? 'bg-segment-bg' : ''}
                                >
                                    <td className="px-4 py-2 font-medium border border-border w-1/3">
                                        {tool.category}
                                    </td>
                                    <td className="px-2 py-2 space-y-2 border border-border">
                                        {tool.links.map((link) => (
                                            <div
                                                key={link.name}
                                                className="group flex items-center gap-2 px-2 py-1 rounded border border-border bg-secondary hover:bg-primary hover:text-white transition"
                                            >
                                                <link.icon className="w-4 h-4" />
                                                <Link href={link.href} className="text-sm">
                                                    {link.name}
                                                </Link>
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
