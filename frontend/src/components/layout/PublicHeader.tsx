import { PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../states/AuthState";

export function PublicHeader() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/">
                    <div className="flex items-center gap-2">
                        <PawPrint className="h-5 w-5 text-emerald-600">
                        </PawPrint>
                        <span className="text-base font-semibold text-slate-900">
                            Pingo Notes
                        </span>
                    </div>
                </Link>
                <nav className="flex items-center gap-6">
                    <Link to="/" className="text-sm font-medium text-slate-600 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1">
                        Articles
                    </Link>
                    <Link className="text-sm font-medium text-slate-600 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 hidden sm:inline" to="/categories">Categories</Link>
                    <Link className="text-sm font-medium text-slate-600 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1 hidden sm:inline" to="/tags">Tags</Link>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-6">
                            <Link className="text-sm font-medium text-slate-600 hover:text-emerald-600" to="/workspace">
                                Workspace
                            </Link>
                            <button onClick={logout} className="text-sm font-medium text-slate-600 hover:text-emerald-600">
                                Sign out
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                            Sign in
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    )
}