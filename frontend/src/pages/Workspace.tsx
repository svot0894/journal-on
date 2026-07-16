import { FileTextIcon, CircleCheckIcon, CircleDashedIcon, EyeIcon, CircleAlertIcon, PlusIcon, RefreshCwIcon } from "lucide-react";
import { AuthorHeader } from "../components/layout/AuthorHeader";
import { useAuth } from "../states/AuthState";
import { AuthorState } from "../states/AuthorState";

export default function Workspace() {

    const { isAuthenticated } = useAuth();
    const authorState = new AuthorState();

    const _statCard = (label: string, value: string | number, icon: React.ReactNode) => {
        return (
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-5">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-100">
                    {icon}
                </div>
                <div className="ml-4">
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
                </div>
            </div>
        );
    };

    return (
        <main className="font-['Inter'] bg-stone-50 min-h-screen">
            {isAuthenticated ? AuthorHeader("workspace") : null}
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Welcome back, Pingo</h1>
                        <p className="text-slate-600 mt-1">Manage your stories and content here.</p>
                    </div>
                    <button
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
                        onClick={() => { window.location.href = '/editor'; }}
                    >
                        <PlusIcon className="w-4 h-4" />
                        New story
                    </button>
                </div>
                {authorState.load_error !== "" && (
                    <div className="flex items-start bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <CircleAlertIcon className="w-5 h-5 text-amber-600 shrink-0" />
                        <div className="ml-3">
                            <p className="text-sm font-semibold text-slate-900">Database error occurred.</p>
                            <p className="text-xs text-slate-600 mt-0.5">{authorState.load_error}</p>
                        </div>
                        <button onClick={() => {
                        }} className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-100 text-amber-800 text-sm font-medium hover:bg-amber-200">
                            <RefreshCwIcon className="w-3.5 h-3.5" />
                            Retry
                        </button>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {_statCard("Total Stories", authorState.posts.length.toString(), <FileTextIcon className="w-5 h-5" />)}
                    {_statCard("Published", 5, <CircleCheckIcon className="w-5 h-5 text-emerald-600" />)}
                    {_statCard("Drafts", 5, <CircleDashedIcon className="w-5 h-5 text-amber-600" />)}
                    {_statCard("Total views", 5, <EyeIcon className="w-5 h-5 text-emerald-600" />)}
                </div>
                <div>
                    
                </div>
            </div>
        </main>
    )
}