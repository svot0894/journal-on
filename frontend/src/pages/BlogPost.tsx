import { useState, useReducer, useEffect } from "react";
import { ArrowLeftIcon, CircleAlertIcon } from "lucide-react";
import { PublicHeader } from "../components/layout/PublicHeader";
import { BlogState } from "../states/BlogState";
import type { Post } from "../states/BlogState";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
    const { postId } = useParams<{ postId: string }>();

    const [blogState] = useState(() => new BlogState());
    const [, forceRender] = useReducer((value) => value + 1, 0);


    useEffect(() => {
        if (!postId) {
            return;
        }

        blogState._loadPostById(postId).then(() => {
            forceRender();
        });
    }, [blogState, postId]);

    const post = blogState.current_post;


    const related_card = (post: Post) => {
        return (
            <Link to={`/post/${post.id}`} key={post.id} className="block bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all">
                <div className="overflow-hidden border-b border-slate-200">
                    <img src={post.cover_image ?? undefined} className="w-full h-32 object-cover" />
                </div>
                <div className="p-4">
                    <span className="text-xs font-medium text-blue-600">{post.category}</span>
                    <h4 className="text-base font-semibold text-slate-900 mt-1 line-clamp-2">{post.title}</h4>
                </div>
            </Link>
        )
    };

    const tag_chip = (tag: string) => {
        return (
            <Link to={`/tag/${tag}`} key={tag} className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-colors w-fit focus:outline-none focus:ring-2 focus:ring-blue-500">
                #{tag}
            </Link>
        )
    }

    return (
        <main className="font-['Inter'] bg-gray-50 min-h-screen">
            <PublicHeader />
            <article className="max-w-3xl mx-auto px-6 py-12">
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-700 mb-8">
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to articles
                </Link>
                <div>
                    {blogState.load_error !== "" && (
                        <div className="flex items-start bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                            <CircleAlertIcon className="h-5 w-5 text-amber-600" />
                            <div className="ml-3">
                                <p className="text-sm font-semibold text-slate-900">
                                    Article not found
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    The article you're looking for might have been moved or removed.
                                </p>
                            </div>
                        </div>
                    )}
                    <div>
                        <Link to={`/categories/${post.category}`} className="text-xs font-semibold tracking-wide text-emerald-600 uppercase hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded">
                            {post.category}
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mt-3 mb-4 leading-tight tracking-tight">{post.title}</h1>
                        <p className="text-lg text-slate-600 mb-6">{post.excerpt}</p>
                        <div className="flex items-center gap-3 mb-8">
                            <img src="https://api.dicebear.com/10.x/big-smile/svg?seed={blogState.author['avatar']}" className="size-10 rounded-full bg-stone-100"></img>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{blogState.author.name}</p>
                                <p className="text-xs text-slate-500">{post.published_date} • {post.read_time}</p>
                            </div>
                        </div>
                        <img src={post.cover_image ?? undefined} className="w-full h-64 md:h-96 object-cover rounded-2xl border border-slate-200 mb-10" />
                        <div className="mb-10">
                            <article className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600">
                                <ReactMarkdown>
                                    {post.content}
                                </ReactMarkdown>
                            </article>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-10">
                            {post.tags.map((tag) => tag_chip(tag))}
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-12">
                            <div className="flex items-start gap-4">
                                <img src="https://api.dicebear.com/10.x/big-smile/svg?seed={blogState.author['avatar']}" className="size-14 rounded-full bg-slate-100"></img>
                                <div>
                                    <p className="text-base font-semibold text-slate-900">{blogState.author.name}</p>
                                    <p className="text-sm text-slate-500 mb-2">{blogState.author.role}</p>
                                    <p className="text-sm text-slate-600">{blogState.author.bio}</p>
                                </div>
                            </div>
                        </div>
                        {blogState._relatedPosts().length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-4">Related articles</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {blogState._relatedPosts().map((post) => related_card(post))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </main>
    )
}