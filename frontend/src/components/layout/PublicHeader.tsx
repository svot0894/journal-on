import { PawPrint } from "lucide-react";
import { useState, useEffect } from "react";

import { useAuth } from "../../states/AuthState";

export function PublicHeader() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <a href="/">
                    <div className="flex items-center gap-2">
                        <PawPrint className="h-5 w-5 text-emerald-600">
                        </PawPrint>
                        <span className="text-base font-semibold text-slate-900">
                            Pingo Notes
                        </span>
                    </div>
                </a>
                <nav className="flex items-center gap-6">
                    <a href="/" className="text-sm font-medium text-slate-600 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1">
                        Articles
                    </a>
                    <a href="/category" className="text-sm font-medium text-slate-600 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 hidden sm:inline">
                        Categories
                    </a>
                    <a href="/tag" className="text-sm font-medium text-slate-600 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 hidden sm:inline">
                        Topics
                    </a>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-6">
                            <a href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-emerald-600">
                                Workspace
                            </a>
                            <button onClick={logout} className="text-sm font-medium text-slate-600 hover:text-emerald-600">
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <a href="/login" className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                            Sign in
                        </a>
                    )}
                </nav>
            </div>
        </header>
    )
}