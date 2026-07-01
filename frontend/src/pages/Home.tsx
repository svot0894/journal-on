import { useState, useReducer, useEffect } from "react";
import { PublicHeader } from "../components/layout/PublicHeader";
import { BlogState } from "../states/BlogState";
import type { Post } from "../states/BlogState";
import { HashIcon, SearchIcon, SearchXIcon, CircleAlertIcon, PawPrint } from "lucide-react";

export default function Home() {
    const [blogState] = useState(() => new BlogState());

    const [, forceRender] = useReducer((value) => value + 1, 0);

    useEffect(() => {
        blogState._loadInitialData().then(() => {
            forceRender();
        });
    }, [blogState]);

    const featuredPost = blogState._featuredPost();
    const featuredPostId = featuredPost.id;

    const categoryPill = (cat: string) => {
        const isSelected = blogState.selected_category === cat;

        return (
            <button
                key={cat}
                onClick={() => {
                    blogState._selectCategory(cat);
                    forceRender();
                }}
                className={
                    isSelected
                        ? "px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-600 text-white border border-emerald-600"
                        : "px-3 py-1.5 rounded-full text-sm font-medium bg-white text-slate-600 border border-slate-200 hover:border-emerald-300"
                }
            >
                {cat}
            </button>
        );
    };

    const postCard = (post: Post) => {
        return (
            <a
                key={`/post/${post.id}`}
                href={`/post/${post.id}`}
                className="block bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-emerald-300 hover:shadow-sm transition-all"
            >
                <div className="overflow-hidden border-b border-slate-200">
                    <img
                        src={post.cover_image ?? undefined}
                        alt={post.title}
                        className="w-full h-44 object-cover"
                    />
                </div>
                <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 w-fit">
                            {post.category}
                        </span>
                        <span className="text-xs text-slate-500">{post.read_time}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 hover:text-emerald-700 transition-colors">
                        {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                        {post.excerpt}
                    </p>
                    <div className="flex items-center gap-1.5">
                        <PawPrint className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span className="text-xs text-slate-500">{post.published_date}</span>
                    </div>
                </div>
            </a>
        )
    };

    const hasFilters =
        blogState.search_query.trim() !== "" ||
        blogState.selected_category !== "All";

    return (
        <main className="font-['Inter'] bg-stone-50 min-h-screen">
            <PublicHeader />
            <div className="max-w-6xl mx-auto px-6 pb-20">
                <div className="py-16">
                    <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight mb-4 tracking-tight">Welcome to Pingo Notes</h1>
                    <p className="text-lg text-slate-600 max-w-2xl">My personal space.</p>
                </div>
                {blogState.load_error !== "" && (
                    <div className="flex items-start bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <CircleAlertIcon className="h-5 w-5 text-amber-600 shrink-0" />
                        <div className="ml-3">
                            <p className="text-sm font-semibold text-slate-900">
                                We're having trouble loading articles
                            </p>
                            <p className="text-xs text-slate-600 mt-0.5">
                                {blogState.load_error}
                            </p>
                        </div>
                    </div>
                )}
                {blogState._hasFeaturedPosts() ? (
                    <a
                        href={`/post/${featuredPostId}`}
                        className="flex flex-col md:flex-row bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-300 transition-all mb-12"
                    >
                        <div className="md:w-1/2 overflow-hidden">
                            <img
                                src={featuredPost.cover_image ?? undefined}
                                className="w-full h-72 md:h-full object-cover"
                            />
                        </div>

                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xs font-semibold tracking-wide text-emerald-600 uppercase">
                                    Featured Paw-post
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="text-xs font-medium text-slate-600">
                                    {featuredPost.category}
                                </span>
                            </div>

                            <h2 className="text-3xl font-semibold text-slate-900 mb-4 leading-tight hover:text-emerald-700 transition-colors">
                                {featuredPost.title}
                            </h2>

                            <p className="text-slate-600 mb-6">
                                {featuredPost.excerpt}
                            </p>

                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500">
                                    {featuredPost.published_date}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="text-sm text-slate-500">
                                    {featuredPost.read_time}
                                </span>
                            </div>
                        </div>
                    </a>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl mb-12">
                        <PawPrint className="h-8 w-8 text-emerald-500 mb-3" />
                        <h2 className="text-xl font-semibold text-slate-900 mb-1">
                            No featured articles in the kennel yet.
                        </h2>
                        <p className="text-sm text-slate-600 max-w-md text-center">
                            Check back soon - fresh posts are being fetched!
                        </p>
                    </div>
                )}
                <div>
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                        <h2 className="text-2xl font-semibold text-slate-900">Latest articles</h2>
                        <div className="hidden md:flex items-center gap-2">
                            <a
                                href="/tags"
                                className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-emerald-700 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <HashIcon className="h-3.5 w-3.5" />
                                Tags
                            </a>
                        </div>
                        <div className="flex items-center relative justify-between mb-6 flex-wrap gap-4">
                            <SearchIcon className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={blogState.search_query}
                                onChange={(event) => {
                                    blogState._setSearchQuery(event.target.value);
                                    forceRender();
                                }}
                                className="pl-9 pr-4 py-2 rounded-md border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 w-64"
                            ></input>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-8">
                        {blogState._categories().map(categoryPill)}
                    </div>
                    {blogState._hasResults() ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {blogState._filteredPosts().map(postCard)}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-xl">
                            <SearchXIcon className="h-8 w-8 text-slate-400 mb-3" />

                            <p className="text-slate-600 mb-3">
                                {hasFilters
                                    ? "No articles match your filters."
                                    : "There are no published articles yet."}
                            </p>

                            {hasFilters && (
                                <button
                                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                                    onClick={() => {
                                        blogState._clearSearch();
                                        forceRender();
                                    }}
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}