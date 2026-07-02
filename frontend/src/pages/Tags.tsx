import { useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { PublicHeader } from "../components/layout/PublicHeader";
import { BlogState } from "../states/BlogState";
import { HashIcon } from "lucide-react";

export default function Tags() {
    const [blogState] = useState(() => new BlogState());

    const [, forceRender] = useReducer((value) => value + 1, 0);

    useEffect(() => {
        blogState._loadInitialData().then(() => {
            forceRender();
        });
    }, [blogState]);

    const tagCard = (tag: string) => {

        return (
            <Link
                key={tag}
                to={`/tag/${tag}`}
                className="
                    group
                    flex
                    items-center
                    gap-4
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    transition-all
                    hover:border-emerald-300
                    hover:shadow-sm
                "
            >
                <div
                    className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-lg
                        bg-emerald-50
                        text-emerald-600
                        group-hover:bg-emerald-100
                    "
                >
                    <HashIcon className="h-6 w-6" />
                </div>

                <div className="flex-1">
                    <h2 className="font-semibold text-slate-900 group-hover:text-emerald-700">
                        {tag}
                    </h2>

                    <span className="inline-flex mt-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        5 articles
                    </span>
                </div>
            </Link>
        );
    };

    const tags = blogState._allTags();

    return (
        <main className="font-['Inter'] bg-stone-50 min-h-screen">
            <PublicHeader />

            <div className="max-w-6xl mx-auto px-6 pb-20">

                <div className="py-16">
                    <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight tracking-tight mb-4">
                        Tags
                    </h1>

                    <p className="text-lg text-slate-600 max-w-2xl">
                        Browse articles by tag.
                    </p>
                </div>

                {tags.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {tags.map(tagCard)}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-2xl">
                        <HashIcon className="h-8 w-8 text-emerald-500 mb-3" />

                        <h2 className="text-xl font-semibold text-slate-900 mb-2">
                            No tags yet
                        </h2>

                        <p className="text-sm text-slate-600 text-center max-w-md">
                            Create your first article and tags will appear automatically.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}