import { LockIcon, ChevronDownIcon, CircleAlertIcon, ArrowLeftIcon, PencilIcon, EyeIcon, SaveIcon, SendIcon } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../states/AuthState";
import { AuthorState } from "../states/AuthorState";
import { AuthorHeader } from "../components/layout/AuthorHeader";
import { useEffect, useReducer, useState } from "react";
import Markdown from "react-markdown";

export default function Editor() {
    const { isAuthenticated } = useAuth();
    const [authorState] = useState(() => new AuthorState());
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const [, forceRender] = useReducer((value) => value + 1, 0);

    useEffect(() => {
        const load = async () => {
            if (postId) {
                await authorState._loadEditor(postId);
            } else {
                authorState._startNewPost();
            }

            forceRender();
        };

        void load();
    }, [postId, authorState]);

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
                    {fieldLabel("Title", "Give your post a clear, compelling title")}
                    <input
                        value={authorState.editor_title}
                        onChange={(e) => {
                            authorState._setEditorTitle(e.target.value);
                            forceRender();
                        }}
                        className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-900 text-base focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="Give your post a clear, compelling title"></input>
                </div>
                <div className="mb-5">
                    {fieldLabel("Excerpt", "A short, engaging summary that appears on cards and social previews...")}
                    <textarea
                        value={authorState.editor_excerpt}
                        onChange={(e) => {
                            authorState._setEditorExcerpt(e.target.value);
                            forceRender();
                        }}
                        placeholder="A short, engaging summary that appears on cards and social previews..." rows={3} className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div className="flex-1">
                        {fieldLabel("Category", "Select a category for your post")}
                        <div className="relative">
                            <select
                                key={`${authorState.editor_id}_cat`}
                                value={authorState.editor_category}
                                onChange={(e) => {
                                    authorState._setEditorCategory(e.target.value);
                                    forceRender();
                                }}
                                className="w-full px-3 py-2 pr-9 rounded-md border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 appearance-none cursor-pointer"
                            >
                                {authorState.categories.map((cat) => categoryOption(cat))}

                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex-1">
                        {fieldLabel("Tags", "Separate tags with commas")}
                        <input
                            placeholder="security, webdev, exercise"
                            value={authorState.editor_tags_input}
                            onChange={(e) => {
                                authorState._setEditorTags(e.target.value);
                                forceRender();
                            }}
                            className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                    </div>
                </div>
                {
                    authorState._editorTagsList().length > 0 ? (
                        <div className="flex flex-wrap gap-2 mb-5">
                            {authorState._editorTagsList().map((tag) => tagChip(tag))}
                        </div>
                    ) : null
                }
                <div className="mb-5">
                    {fieldLabel("Cover image", "Optional. A cover image for your post. Must be a valid image URL.")}
                    <input
                        placeholder="Place a valid image URL here..."
                        value={authorState.editor_cover_image}
                        onChange={(e) => {
                            authorState._setEditorCover(e.target.value);
                            forceRender();
                        }}
                        className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
                    {
                        authorState.editor_cover_image !== "" ? (
                            <img src={authorState.editor_cover_image} alt="Cover" className="w-full h-40 object-cover rounded-md mt-3 border border-slate-200" />
                        ) : null
                    }
                </div>
                <div className="mb-2">
                    {fieldLabel("Content", "Write your post here...")}
                    <textarea
                        placeholder="Write your post here..."
                        value={authorState.editor_content}
                        onChange={(e) => {
                            authorState._setEditorContent(e.target.value);
                            forceRender();
                        }}
                        rows={20}
                        className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 font-mono leading-relaxed" />
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-500">{authorState._editorWordCount()} words</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500">{authorState._editorReadTime()} min read</span>
                    </div>
                </div>
                {
                    authorState.editor_error !== "" ? (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-red-50 border border-red-100 mt-4">
                            <CircleAlertIcon className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-red-700">{authorState.editor_error}</span>
                        </div>
                    ) : null
                }
            </div>
        )
    };

    const previewPanel = () => {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
                {
                    authorState.editor_cover_image !== "" ? (
                        <img src={authorState.editor_cover_image} alt="Cover" className="w-full h-40 object-cover rounded-lg border border-slate-200 mb-6" />
                    ) : null
                }
                <span className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                    {authorState.editor_category}
                </span>
                <h1 className="text-3xl font-semibold text-slate-900 mt-2 mb-3 tracking-tight">
                    {authorState.editor_title !== "" ? authorState.editor_title : "Post title goes here..."}
                </h1>
                <p className="text-base text-slate-600 mb-6">
                    {authorState.editor_excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                    {authorState._editorTagsList().map((tag) => tagChip(tag))}
                </div>
                <div className="">
                    <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-slate-900 prose-p:text-slate-700">
                        
                        <Markdown>
                            {authorState.editor_content}
                        </Markdown>
                    </div>
                </div>
            </div>
        )
    };

    return (
        isAuthenticated ? (
            <main className="font-['Inter'] bg-gray-50 min-h-screen">
                {AuthorHeader("posts")}
                <div className="max-w-4xl mx-auto px-6 py-10">
                    <div>
                        <Link to="/workspace" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-4">
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back to workspace
                        </Link>
                        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
                            <div>
                                <h1 className="text-2xl font-semibold text-slate-900">
                                    {authorState.editor_mode === "new" ? "Create a new post" : "Edit your post"}
                                </h1>
                                <p className="text-sm text-slate-600 mt-0.5">
                                    {authorState.editor_mode === "new" ? "Write and publish your article to share with the world." : "Make changes to your post and save them."}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    onClick={() => {
                                        authorState._togglePreview();
                                        forceRender();
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50">
                                    {authorState.show_preview ? <PencilIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                    {authorState.show_preview ? "Edit" : "Preview"}
                                </button>
                                <button
                                    onClick={async () => {
                                        const success = await authorState._savePost("draft");
                                        forceRender();

                                        if (success) {
                                            navigate("/workspace");
                                        }
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50">
                                    <SaveIcon className="h-4 w-4" />
                                    Save draft
                                </button>
                                <button
                                    onClick={async () => {
                                        const success = await authorState._savePost("published");
                                        forceRender();

                                        if (success) {
                                            navigate("/workspace");
                                        }
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">
                                    <SendIcon className="h-4 w-4" />
                                    Publish
                                </button>
                            </div>
                        </div>
                    </div>
                    {
                        authorState.show_preview ? (
                            previewPanel()
                        ) : (
                            <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
                                {editorForm()}
                            </div>
                        )
                    }
                </div>
            </main >
        ) : (
            <main className="font-['Inter'] bg-gray-50">
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <LockIcon className="h-8 w-8 text-slate-400 mb-3" />
                    <p className="text-slate-600 mb-4">Sign in required.</p>
                    <Link to="/login" className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium">Sign in</Link>
                </div>
            </main>
        )
    )
}