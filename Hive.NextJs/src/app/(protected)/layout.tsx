import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { UserCircle } from 'lucide-react';

const userProfileDropdownItems = [
    { name: 'My Profile', path: '/admin/status' },
    { name: 'Change Password', path: '/admin/service' },
    { name: 'Change Others Password', path: '/admin/project' },
    { name: 'Logout', path: '/admin/system-option' },
];

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="">
            <aside className="fixed top-0 left-0 h-screen w-48 !z-60">
                <Sidebar />
            </aside>

            <header className="sticky top-0 !z-50 p-2 pl-5 pr-5 bg-white text-black/70 text-sm ml-48 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                {/* <div className='flex justify-between items-center w-full'>
                    <div className=''>
                        Last visited: /admin/system-option
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer">
                        <span>Ujjal, Sarker</span>
                        <UserCircle className="w-5 h-5 text-gray-600" />
                    </div>
                </div> */}
                <Topbar />

            </header>

            <main className="p-3 ml-48">
                {children}
            </main>
        </div>
    );
}
