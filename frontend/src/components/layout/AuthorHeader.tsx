import { useEffect, useState } from "react";
import { PawPrint, LogOut } from "lucide-react";

export function AuthorHeader(active: string = "dashboard") {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
        useEffect(() => {
            // Check authentication status from localStorage or API
            const authToken = localStorage.getItem("authToken");
            setIsAuthenticated(!!authToken);
        }, []);
    
        const handleSignOut = () => {
            localStorage.removeItem("authToken");
            setIsAuthenticated(false);
            window.location.href = "/";
        };
        
    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <a href="/dashboard">
                    <div className="flex items-center gap-2">
                        <PawPrint className="w-5 h-5 text-emerald-600" />
                        <span className="text-base font-semibold text-slate-900">Pingo Workspace</span>
                    </div>
                </a>
                <nav className="flex items-center gap-1"></nav>
                <div>
                    <a href="/" className="text-sm font-medium text-slate-600 hover:text-emerald-600">
                        View blog
                    </a>
                    <button
                        onClick={handleSignOut}
                        className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                    </button>
                </div>
            </div>
        </header>
    );
}