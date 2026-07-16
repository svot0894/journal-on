import { ChevronDownIcon, LockIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../states/AuthState";
import { AuthorHeader } from "../components/layout/AuthorHeader";

export default function Editor() {
    const { isAuthenticated } = useAuth();

    const categoryOption = (cat: string) => {
        return (
            <option value={cat}>{cat}</option>
        )
    };

    const tagChip = (t: string) => {
        return (
            <span className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 w-fit">#{t}</span>
        )
    };

    const fieldLabel = (text: string, hint: string) => {
        return (
            <div className="flex items-center mb-1.5">
                <label className="text-sm font-medium text-slate-700">{text}</label>
                {hint !== "" ? (
                    <span className="text-xs text-slate-500 ml-2">{hint}</span>
                ) : null}
            </div>
        )
    };

    const editorForm = () => {
        return (
            <div>
                <div className="mb-5">
                    <label>Title</label>
                    <input className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-900 text-base focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Give your post a clear, compelling title"></input>
                </div>
                <div className="mb-5">
                    <label>Excerpt</label>
                    <textarea placeholder="A short, engaging summary that appears on cards and social previews..." rows={3} className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div className="flex-1">
                        <label>Category</label>
                        <div className="relative">
                            <select></select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label>Tags</label>
                        <input placeholder="security, webdev, jwt" className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                    </div>
                </div>
                { }
                <div></div>
                <div></div>
                { }
            </div>
        )
    };

    return (
        isAuthenticated ? (
            <main className="font-['Inter'] bg-gray-50 min-h-screen">
                <AuthorHeader />
                <h1>test</h1>
            </main>
        ) : (
            <main className="font-['Inter'] bg-gray-50">
                <div>
                    <LockIcon className="h-8 w-8 text-slate-400 mb-3" />
                    <p className="text-slate-600 mb-4">Sign in required.</p>
                    <Link to="/login" className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium">Sign in</Link>
                </div>
            </main>
        )
    )
}