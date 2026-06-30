type PostStatus = "draft" | "published";

export interface Post {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    status: PostStatus;
    published_date: string | null;
    cover_image: string | null;
    read_time: string | null;
    views: number;
    is_featured: boolean;
}

export interface Author {
    name: string;
    avatar: string | null;
    bio: string | null;
    role: string | null;
    linkedin: string | null;
    github: string | null;
}


const DEFAULT_AUTHOR: Author = {
    name: "",
    avatar: "",
    bio: "",
    role: "",
    linkedin: "",
    github: ""
};

const EMPTY_POST: Post = {
    id: "",
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [],
    status: "draft",
    published_date: "",
    cover_image: "",
    read_time: "",
    views: 0,
    is_featured: false,
};

export interface IBlogState {
    author: Author;
    posts: Post[];
    selected_category: string;
    search_query: string;
    current_post_id: string;
    current_tag: string;
    current_category: string;
    current_period: string;
    is_loading: boolean;
    is_initialized: boolean;
    load_error: string;
    sort_order: string;
    current_post: Post;
    pending_post_id: string;
}

export class BlogState implements IBlogState {
    author: Author = DEFAULT_AUTHOR;
    posts: Post[] = [];
    selected_category: string = "All";
    search_query: string = "";
    newsletter_email: string = "";
    current_post_id: string = "";
    current_tag: string = "";
    current_category: string = "";
    current_period: string = "";
    is_loading: boolean = false;
    is_initialized: boolean = false;
    load_error: string = "";
    sort_order: string = "newest";
    current_post: Post = EMPTY_POST;
    pending_post_id: string = "";
    private router: any;

    _normalizePost(row: any): Post {
        let tags: string[] = [];
        if (typeof row.tags === "string") {
            tags = row.tags
                .split(",")
                .map((t: string) => t.trim())
                .filter((t: string) => t.length > 0);
        } else if (Array.isArray(row.tags)) {
            tags = row.tags.filter((t: any) => typeof t === "string");
        }

        return {
            id: row.id ?? "",
            title: row.title ?? "",
            excerpt: row.excerpt ?? "",
            content: row.content ?? "",
            category: row.category ?? "",
            tags: tags,
            status: row.status ?? "draft",
            published_date: row.published_date ?? "",
            cover_image: row.cover_image ?? "",
            read_time: row.read_time ?? "",
            views: row.views ?? 0,
            is_featured: row.is_featured ?? false,
        };
    }

    _resolvePostId(): string {
        if (this.pending_post_id) {
            return this.pending_post_id;
        }
        try {
            return this.router?.page?.params?.get("post_id", "") || "";
        } catch (e) {
            console.error(`Error: ${e}`);   // TBD: replace with proper logging
            return "";
        }
    }

    _categories(): string[] {
        const seen: string[] = ["All"];
        for (const p of this.posts) {
            if (p.status !== "published") {
                continue;
            }
            if (p.category && !seen.includes(p.category)) {
                seen.push(p.category);
            }
        }
        return seen;
    }

    _allTags(): string[] {
        const seen: { [key: string]: number } = {};
        for (const p of this.posts) {
            if (p.status !== "published") {
                continue;
            }
            for (const tag of p.tags) {
                if (!seen[tag]) {
                    seen[tag] = 1;
                }
            }
        }
        return Object.keys(seen).sort((a, b) => seen[b] - seen[a]);
    }

    _tagCounts(): { tag: string; count: number }[] {
        const seen: { [key: string]: number } = {};
        for (const p of this.posts) {
            if (p.status !== "published") {
                continue;
            }
            for (const tag of p.tags) {
                if (!seen[tag]) {
                    seen[tag] = 1;
                } else {
                    seen[tag]++;
                }
            }
        }
        return Object.keys(seen)
            .sort((a, b) => seen[b] - seen[a])
            .map((tag) => ({ tag, count: seen[tag] }));
    }

    _categoryCounts(): { category: string; count: number }[] {
        const seen: { [key: string]: number } = {};
        for (const p of this.posts) {
            if (p.status !== "published") {
                continue;
            }
            if (!seen[p.category]) {
                seen[p.category] = 1;
            } else {
                seen[p.category]++;
            }
        }
        return Object.keys(seen)
            .sort((a, b) => seen[b] - seen[a])
            .map((category) => ({ category, count: seen[category] }));
    }

    _currentTagPosts(): Post[] {
        if (!this.current_tag) {
            return [];
        }
        return this.posts.filter(
            (p) => p.status === "published" && p.tags.includes(this.current_tag)
        );
    }

    _currentCategoryPosts(): Post[] {
        if (!this.current_category) {
            return [];
        }
        return this.posts.filter(
            (p) => p.status === "published" && p.category.toLowerCase() === this.current_category.toLowerCase()
        );
    }

    _filteredPosts(): Post[] {
        let filtered = this.posts.filter((p) => p.status === "published");

        if (this.selected_category != "All") {
            filtered = filtered.filter(
                (p) => p.category.toLowerCase() === this.selected_category.toLowerCase()
            );
        }

        if (this.search_query) {
            const query = this.search_query.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.title.toLowerCase().includes(query) ||
                    p.excerpt.toLowerCase().includes(query) ||
                    p.content.toLowerCase().includes(query) ||
                    p.tags.some((tag) => tag.toLowerCase().includes(query)) ||
                    p.category.toLowerCase().includes(query)
            );
        }

        if (this.sort_order === "oldest") {
            filtered = filtered.reverse();
        }

        return filtered;
    }

    _hasResults(): boolean {
        return this._filteredPosts().length > 0;
    }

    _featuredPost(): Post {
        let published = this.posts.filter((p) => p.status === "published");
        for (const p of published) {
            if (p.is_featured) {
                return [p];
            }
        }
        return EMPTY_POST;
    }

    _hasPosts(): boolean {
        return this.posts.length > 0;
    }

    _relatedPosts(): Post[] {
        const cat = this.current_post.category;
        const pid = this.current_post.id;
        const currentTags = new Set(this.current_post.tags.map((t) => t.toLowerCase()));

        const published = this.posts.filter(
            (p) => p.status === "published" && p.id !== pid
        );

        const score = (p: Post): number => {
            let s = 0;
            if (p.category === cat) {
                s += 5;
            }
            const shared = p.tags.reduce(
                (count, tag) => count + (currentTags.has(tag.toLowerCase()) ? 1 : 0),
                0
            );
            s += shared * 2;
            return s;
        };

        const ranked = [...published].sort((a, b) => score(b) - score(a));
        let scored = ranked.filter((p) => score(p) > 0);
        if (scored.length === 0) {
            scored = ranked;
        }

        return scored.slice(0, 3);
    }

    async _fetchPosts(): Promise<Post[]> {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/posts`);
            if (!response.ok) {
                throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
            }
            const payload = await response.json();
            const rows = Array.isArray(payload) ? payload : payload?.data || [];
            return rows.map((row: any) => this._normalizePost(row));
        } catch (error) {
            console.error("Error fetching posts:", error);
            this.load_error = "Failed to fetch posts from the database.";
            return [];
        }
    }

    async _fetchAuthor(): Promise<Author> {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/authors`);
            if (!response.ok) {
                return DEFAULT_AUTHOR;
            }
            const payload = await response.json();
            const authorData = Array.isArray(payload)
                ? payload[0]
                : payload?.data
                ? Array.isArray(payload.data)
                    ? payload.data[0]
                    : payload.data
                : payload;

            const row = typeof authorData === "object" && authorData !== null ? authorData : null;
            if (!row) {
                return DEFAULT_AUTHOR;
            }

            return {
                name: row.name || DEFAULT_AUTHOR.name,
                role: row.role || DEFAULT_AUTHOR.role,
                avatar: row.avatar || DEFAULT_AUTHOR.avatar,
                bio: row.bio || DEFAULT_AUTHOR.bio,
                linkedin: row.linkedin || DEFAULT_AUTHOR.linkedin,
                github: row.github || DEFAULT_AUTHOR.github,
            };
        } catch (e) {
            console.error("Error:", e);
            return DEFAULT_AUTHOR;
        }
    }

    async _loadInitialData() {
        if (this.is_initialized) {
            return;
        }
        this.is_loading = true;
        this.load_error = "";
        this.author = await this._fetchAuthor();
        this.posts = await this._fetchPosts();
        this.is_initialized = true;
        this.is_loading = false;
    }

    _refreshData() {
        this.is_initialized = false;
        return this._loadInitialData();
    }

    _selectCategory(category: string) {
        this.selected_category = category;
    }

    _setSearchQuery(query: string) {
        this.search_query = query;
    }

    async _loadPostFromRoute() {
        if (!this.is_initialized) {
            this.author = await this._fetchAuthor();
            this.posts = await this._fetchPosts();
            this.is_initialized = true;
        }
        this.is_loading = true;
        this.load_error = "";
        const postId = this._resolvePostId();
        this.current_post_id = postId;

        for (const p of this.posts) {
            if (p.id === postId && p.status === "published") {
                this.current_post = p;
                this.is_loading = false;
                return;
            }
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/posts/${postId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
            }
            const payload = await response.json();
            const rows = Array.isArray(payload) ? payload : payload?.data || [];
            if (rows.length > 0) {
                this.current_post = this._normalizePost(rows[0]);
                this.is_loading = false;
                return;
            }
        } catch (e) {
            console.error("Error:", e);
        }

        this.current_post = {
            id: "",
            title: "Post Not Found",
            excerpt: "The post you are trying to find doesn't exist, has been moved, or is not published.",
            content: "The requested article is missing.",
            category: "General",
            tags: [],
            read_time: "0 min",
            published_date: "N/A",
            is_featured: false,
            cover_image: "/placeholder.svg",
            status: "published",
            views: 0,
        };
        this.load_error = "Post not found.";
        this.is_loading = false;
    }

    _loadTagFromRoute() {
        if (!this.is_initialized) {
            this._fetchAuthor().then((author) => {
                this.author = author;
            });
            this._fetchPosts().then((posts) => {
                this.posts = posts;
            });
            this.is_initialized = true;
        }
        this.current_tag = this.router.page.params.get("tag", "");
    }

    _loadCategoryFromRoute() {
        if (!this.is_initialized) {
            this._fetchAuthor().then((author) => {
                this.author = author;
            });
            this._fetchPosts().then((posts) => {
                this.posts = posts;
            });
            this.is_initialized = true;
        }
        this.current_category = this.router.page.params.get("category", "");
    }

    _loadPeriodFromRoute() {
        if (!this.is_initialized) {
            this._fetchAuthor().then((author) => {
                this.author = author;
            });
            this._fetchPosts().then((posts) => {
                this.posts = posts;
            });
            this.is_initialized = true;
        }
        const period = this.router.page.params.get("period", "");
        this.current_period = period.replace("-", " ");
    }

    _setSortOrder(value: string) {
        this.sort_order = value;
    }

    _clearSearch() {
        this.search_query = "";
        this.selected_category = "All";
    }

    _navToPost(postId: string) {
        return this.router.redirect(`/post/${postId}`);
    }

    _navToHome() {
        return this.router.redirect("/");
    }

}