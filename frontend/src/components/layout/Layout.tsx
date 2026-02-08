import React from 'react';
import { Ticket } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <Ticket className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">EventTix</span>
                    </div>
                    <nav className="flex items-center gap-6">
                        <a href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                            Dashboard
                        </a>
                        <a href="/bookings" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                            My Bookings
                        </a>
                    </nav>
                </div>
            </header>
            <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
            <footer className="border-t border-gray-200 bg-white py-6">
                <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    © 2024 EventTix. All rights reserved.
                </div>
            </footer>
        </div>
    );
};
