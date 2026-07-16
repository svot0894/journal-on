import { PawPrint, LayoutDashboard, FileText, Settings, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../states/AuthState";


export function AuthorHeader(active: string = "workspace") {
    const { signOut } = useAuth();

    const navLink = (label: string, href: string, key: string, Icon: LucideIcon) => (
        <Link
            to={href}
            className={
                active === key
                    ? "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-emerald-50 text-emerald-700"
                    : "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-100"
            }
        >
            <Icon className="h-4 w-4" />
            {label}
        </Link>
    );

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/workspace">
                    <div className="flex items-center gap-2">
                        <PawPrint className="h-5 w-5 text-emerald-600" />
                        <span className="text-base font-semibold text-slate-900">Pingo Workspace</span>
                    </div>
                </Link>
                <nav className="flex items-center gap-1">
                    {navLink("Workspace", "/workspace", "workspace", LayoutDashboard)}
                    {navLink("Posts", "/workspace", "posts", FileText)}
                    {navLink("Settings", "/settings", "settings", Settings)}
                </nav>
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-sm font-medium text-slate-600 hover:text-emerald-600">View blog</Link>
                    <button onClick={signOut} className="text-sm font-medium text-slate-600 hover:text-emerald-600">
                        Sign out
                    </button>
                </div>
            </div>
        </header>
    )
}