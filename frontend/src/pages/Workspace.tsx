import { useState, useReducer, useEffect } from "react";
import { FileTextIcon, CircleCheckIcon, CircleDashedIcon, EyeIcon, CircleAlertIcon, PlusIcon, RefreshCwIcon, Globe, Lock, GlobeIcon, LockIcon, PencilIcon, EyeOffIcon, SendIcon, Trash2Icon, PawPrintIcon } from "lucide-react";
import { AuthorHeader } from "../components/layout/AuthorHeader";
import { useAuth } from "../states/AuthState";
import { AuthorState, type AuthorPost } from "../states/AuthorState";

export default function Workspace() {

    const { isAuthenticated } = useAuth();

    const [authorState] = useState(() => new AuthorState());
    const [, forceRender] = useReducer((value) => value + 1, 0);

    useEffect(() => {
        authorState._loadDashboard().then(() => {
            forceRender();
        });
    }, [authorState]);


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

    const _statusBadge = (status: string) => {
        return (
            <span className={status === "published" ? "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 w-fit" : "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 w-fit"}>
                {status === "published" ? <GlobeIcon className="w-3 h-3" /> : <LockIcon className="w-3 h-3" />}
                {status === "published" ? "Public" : "Draft"}
            </span>
        );
    };

    const _postRow = (post: AuthorPost) => {
        return (
            <tr key={post.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                <td className="px-4 py-3">
                    <div>
                        <p className="text-sm font-medium text-slate-900 line-clamp-1">{post.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{post.excerpt}</p>
                    </div>
                </td>
                <td className="px-4 py-3">{_statusBadge(post.status)}</td>
                <td className="px-4 py-3">
                    <span className="text-xs font-medium text-slate-600 px-2 py-0.5 rounded-md bg-slate-100 w-fit">
                        {post.category}
                    </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{post.published_date}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{post.views.toString()}</td>
                <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => { void authorState._loadEditor(post.id); authorState._refresh();}}
                            className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        >
                            <PencilIcon className="h-3.5 w-3.5" />
                            Edit
                        </button>
                        <button
                            onClick={() => { void authorState._togglePublishStatus(post.id); }}
                            className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        >
                            {post.status === "published" ? <EyeOffIcon className="w-3.5 h-3.5" /> : <SendIcon className="w-3.5 h-3.5" />}
                            Status
                        </button>
                        <button
                            onClick={() => { void authorState._deletePost(post.id); authorState._refresh();}}
                            className="p-1.5 rounded-md border border-slate-200 bg-white text-red-600 hover:bg-red-50"
                        >
                            <Trash2Icon className="h-3.5 w-3.5" />
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        )
    };

    const _quickAction = (label: string, icon: string, on_click: any) => {
        return (
            <button
                onClick={on_click}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
            >
                {icon}
                <span className="text-sm font-medium text-slate-700">{label}</span>
            </button>
        )
    };


    return (
        <main className="font-['Inter'] bg-stone-50 min-h-screen">
            {isAuthenticated ? AuthorHeader("workspace") : null}
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Welcome back, {authorState.profile['name'].split(' ')[0]}</h1>
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
                            authorState._refresh();
                        }} className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-100 text-amber-800 text-sm font-medium hover:bg-amber-200">
                            <RefreshCwIcon className="w-3.5 h-3.5" />
                            Retry
                        </button>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {_statCard("Total Stories", authorState._totalPosts().toString(), <FileTextIcon className="w-5 h-5" />)}
                    {_statCard("Published", authorState._publishedCount().toString(), <CircleCheckIcon className="w-5 h-5 text-emerald-600" />)}
                    {_statCard("Drafts", authorState._draftCount().toString(), <CircleDashedIcon className="w-5 h-5 text-amber-600" />)}
                    {_statCard("Total views", authorState._totalViews().toString(), <EyeIcon className="w-5 h-5 text-emerald-600" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden lg:col-span-2">
                        <div className="px-5 py-4 border-b border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900">All posts</h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {authorState._totalPosts().toString()} total — {authorState._publishedCount().toString()} published, {authorState._draftCount().toString()} drafts
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr className="bg-stone-50">
                                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Updated</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Views</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {authorState.posts.map(_postRow)}
                                </tbody>
                            </table>
                        </div>
                        {authorState._totalPosts() === 0 && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <PawPrintIcon className="h-8 w-8 text-emerald-500 mb-3" />
                                <p className="text-sm text-slate-600 mb-3">No stories in the kennel yet. Start composing your first write-up!</p>
                                <button
                                    onClick={() => { void authorState._startNewPost(); }}
                                    className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700"
                                >Create first story</button>
                            </div>
                        )}
                    </div>
                    <div></div>
                </div>
            </div>
        </main>
    )
}