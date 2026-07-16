const VITE_API_URL = import.meta.env.VITE_API_URL;

type PostStatus = "draft" | "published";
type EditorMode = "new" | "edit";

export interface AuthorPost {
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

export interface AuthorProfile {
    name: string;
    avatar: string | null;
    bio: string | null;
    role: string | null;
    email: string;
    linkedin: string | null;
    github: string | null;
}

const DEFAULT_AUTHOR_PROFILE: AuthorProfile = {
    name: "Pingo",
    avatar: "pingo",
    bio: "A passionate writer and content creator.",
    role: "Full-time stay-at-home dog.",
    email: "pingo@email.com",
    linkedin: "https://www.linkedin.com/pingo",
    github: "https://github.com/pingo"
};


const DEFAULT_COVER_IMAGE =
    "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80";


function normalizePost(row: any): AuthorPost {
    let tags: string[] = [];

    if (typeof row.tags === "string") {
        tags = row.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean);
    } else if (Array.isArray(row.tags)) {
        tags = row.tags.filter((tag: unknown) => typeof tag === "string");
    };

    return {
        id: String(row.id ?? ""),
        title: row.title ?? "",
        excerpt: row.excerpt ?? "",
        content: row.content ?? "",
        category: row.category ?? "General",
        tags,
        status: row.status ?? "draft",
        published_date: row.published_date ?? null,
        cover_image: row.cover_image || DEFAULT_COVER_IMAGE,
        read_time: row.read_time ?? "",
        views: row.views ?? 0,
        is_featured: row.is_featured ?? false
    };
};

function normalizeProfile(row: any): AuthorProfile {
    return {
        name: row.name ?? DEFAULT_AUTHOR_PROFILE.name,
        avatar: row.avatar ?? DEFAULT_AUTHOR_PROFILE.avatar,
        bio: row.bio ?? DEFAULT_AUTHOR_PROFILE.bio,
        role: row.role ?? DEFAULT_AUTHOR_PROFILE.role,
        email: row.email ?? DEFAULT_AUTHOR_PROFILE.email,
        linkedin: row.linkedin ?? DEFAULT_AUTHOR_PROFILE.linkedin,
        github: row.github ?? DEFAULT_AUTHOR_PROFILE.github,
    };
};

function parseTags(tagsInput: string): string[] {
    return tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean);
}

function calculateReadTime(content: string): string {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));

    return `${minutes} min read`;
}

function formatPublishDate(): string {
    return new Date().toLocaleDateString("en-GB", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

function createSlug(title: string): string {
    const slug = title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
    return `${slug}-${crypto.randomUUID().slice(0, 6)}`;
}


export interface IAuthorState {
    profile: AuthorProfile;
    public_profile: boolean;
    show_email: boolean;
    current_email: string;
    current_user_id: string;
    categories: string[];
    posts: AuthorPost[];
    is_loading: boolean;
    load_error: string;

    editor_id: string;
    editor_title: string;
    editor_excerpt: string;
    editor_content: string;
    editor_category: string;
    editor_tags_input: string;
    editor_cover_image: string;
    editor_status: PostStatus;
    editor_mode: EditorMode;
    editor_error: string;
    show_preview: boolean;
    is_initialized: boolean;
}


export class AuthorState implements IAuthorState {

    profile: AuthorProfile = DEFAULT_AUTHOR_PROFILE;

    public_profile = true;
    show_email = false;

    current_email = "";
    current_user_id = "";

    categories: string[] = [
        "General",
        "Health",
        "Engineering",
        "Languages",
        "Media",
    ];

    posts: AuthorPost[] = [];

    is_loading = false;
    load_error = "";

    editor_id = "";
    editor_title = "";
    editor_excerpt = "";
    editor_content = "";
    editor_category = "General";
    editor_tags_input = "";
    editor_cover_image = DEFAULT_COVER_IMAGE;
    editor_status: PostStatus = "draft";
    editor_mode: EditorMode = "new";
    editor_error = "";
    show_preview = false;

    is_initialized = false;


    async _loadProfileRow(): Promise<void> {
        try {
            const response = await fetch(`${VITE_API_URL}/api/authors`);

            if (!response.ok) {
                this.profile = DEFAULT_AUTHOR_PROFILE;
                return;
            }

            const payload = await response.json();

            const row = Array.isArray(payload) ? payload[0] : Array.isArray(payload?.data) ? payload.data[0] : payload?.data ?? payload;

            if (!row) {
                this.profile = DEFAULT_AUTHOR_PROFILE;
                return;
            }
            this.profile = normalizeProfile(row);
        } catch (error) {
            console.error("Failed to load author profile:", error);
            this.profile = DEFAULT_AUTHOR_PROFILE;
        }
    };

    async _loadPostsRows(): Promise<void> {
        try {
            const response = await fetch(`${VITE_API_URL}/api/admin/posts`);

            if (!response.ok) {
                throw new Error(`Failed to fetch admin posts: ${response.status} ${response.statusText}`);
            };

            const payload = await response.json();

            const rows = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];

            this.posts = rows.map(normalizePost);
            this.load_error = "";
        } catch (error) {
            console.error("Failed to load author posts:", error);
            this.posts = [];
            this.load_error = "Couldn't load posts from the database.";
        }
    };

    async _loadDashboard(): Promise<void> {
        if (this.is_initialized) {
            return;
        }
        this.is_loading = true;
        this.load_error = "";

        try {
            await Promise.all([
                this._loadProfileRow(),
                this._loadPostsRows(),
            ]);

            this.is_initialized = true;
        } finally {
            this.is_loading = false;
        }
    }

    async _refresh(): Promise<void> {
        this.is_initialized = false;
        await this._loadDashboard();
    }

    _totalPosts(): number {
        return this.posts.length;
    }

    _publishedCount(): number {
        return this.posts.filter((post) => post.status === "published").length;
    }

    _draftCount(): number {
        return this.posts.filter((post) => post.status === "draft").length;
    }

    _totalViews(): number {
        return this.posts.reduce((total, post) => total + post.views, 0);
    }

    _recentPosts(): AuthorPost[] {
        return this.posts.slice(0, 5);
    }

    _drafts(): AuthorPost[] {
        return this.posts.filter((post) => post.status === "draft");
    }

    _publishedPosts(): AuthorPost[] {
        return this.posts.filter((post) => post.status === "published");
    }

    _editorTagsList(): string[] {
        return parseTags(this.editor_tags_input);
    }

    _editorWordCount(): number {
        return this.editor_content.trim().split(/\s+/).filter(Boolean).length;
    }

    _editorReadTime(): string {
        return calculateReadTime(this.editor_content);
    }

    _setEditorTitle(value: string): void {
        this.editor_title = value;
    }

    _setEditorExcerpt(value: string): void {
        this.editor_excerpt = value;
    }

    _setEditorContent(value: string): void {
        this.editor_content = value;
    }

    _setEditorCategory(value: string): void {
        this.editor_category = value;
    }

    _setEditorTags(value: string): void {
        this.editor_tags_input = value;
    }

    _setEditorCover(value: string): void {
        this.editor_cover_image = value;
    }

    _togglePreview(): void {
        this.show_preview = !this.show_preview;
    }

    _startNewPost(): void {
        this.editor_mode = "new";
        this.editor_id = "";
        this.editor_title = "";
        this.editor_excerpt = "";
        this.editor_content = "";
        this.editor_category = "General";
        this.editor_tags_input = "";
        this.editor_cover_image = DEFAULT_COVER_IMAGE;
        this.editor_status = "draft";
        this.editor_error = "";
        this.show_preview = false;
    }

    async _loadEditor(postId: string | undefined): Promise<void> {
        if (!postId || postId === "new") {
            this._startNewPost();
            return;
        }
        this.is_loading = true;
        this.editor_error = "";

        try {
            const response = await fetch(`${VITE_API_URL}/api/admin/posts/${postId}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
            }

            const payload = await response.json();

            const row = Array.isArray(payload) ? payload[0] : Array.isArray(payload?.data) ? payload.data[0] : payload?.data ?? payload;

            if (!row) {
                throw new Error("Post not found.");
            }

            const post = normalizePost(row);

            this.editor_mode = "edit";
            this.editor_id = post.id;
            this.editor_title = post.title;
            this.editor_excerpt = post.excerpt;
            this.editor_content = post.content;
            this.editor_category = post.category;
            this.editor_tags_input = post.tags.join(", ");
            this.editor_cover_image = post.cover_image || DEFAULT_COVER_IMAGE;
            this.editor_status = post.status;
            this.editor_error = "";
            this.show_preview = false;
        } catch (error) {
            console.error("Failed to load editor:", error);
            this.editor_error = "Post not found.";
        } finally {
            this.is_loading = false;
        }
    }

    _validateEditor(): string {
        if (this.editor_title.trim().length < 4) {
            return "Title must be at least 4 characters.";
        }
        if (this.editor_excerpt.trim().length < 10) {
            return "Excerpt must be at least 10 characters.";
        }
        if (this.editor_content.trim().length < 20) {
            return "Content must be at least 20 characters.";
        }
        if (!this.editor_category) {
            return "Please choose a category.";
        }
        return "";
    }


    async _savePost(status: PostStatus): Promise<boolean> {
        const validationError = this._validateEditor();

        if (validationError) {
            this.editor_error = validationError;
            return false;
        }

        const now = formatPublishDate();
        const tags = parseTags(this.editor_tags_input);
        const readTime = calculateReadTime(this.editor_content);

        const payload = {
            title: this.editor_title.trim(),
            excerpt: this.editor_excerpt.trim(),
            content: this.editor_content,
            category: this.editor_category,
            tags,
            cover_image: this.editor_cover_image || DEFAULT_COVER_IMAGE,
            status,
            published_date: now,
            read_time: readTime,
            is_featured:
                this.posts.find(p => p.id === this.editor_id)?.is_featured ?? false,
        };

        try {
            if (this.editor_mode === "edit" && this.editor_id) {
                const response = await fetch(
                    `${VITE_API_URL}/api/admin/posts/${this.editor_id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to update post.");
                }
            } else {
                const newId = createSlug(this.editor_title);

                const response = await fetch(`${VITE_API_URL}/api/admin/posts`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id: newId,
                        ...payload,
                        views: 0,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to create post.");
                }

                this.editor_id = newId;
                this.editor_mode = "edit";
            }

            this.editor_status = status;
            await this._loadPostsRows();

            return true;
        } catch (error) {
            console.error("Failed to save post:", error);
            this.editor_error = "Could not save post to the database.";
            return false;
        }
    }


    async _deletePost(postId: string): Promise<boolean> {
        try {
            const response = await fetch(`${VITE_API_URL}/api/admin/posts/${postId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete post.");
            }

            this.posts = this.posts.filter((post) => post.id !== postId);

            return true;
        } catch (error) {
            console.error("Failed to delete post:", error);
            this.load_error = "Could not delete post.";
            return false;
        }
    }


    async _togglePublishStatus(postId: string): Promise<boolean> {
        const target = this.posts.find((post) => post.id === postId);

        if (!target) {
            this.load_error = "Post not found.";
            return false;
        }

        const newStatus: PostStatus =
            target.status === "published" ? "draft" : "published";

        try {
            const response = await fetch(
                `${VITE_API_URL}/api/admin/posts/${postId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: newStatus,
                        published_date: formatPublishDate(),
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update post status.");
            }

            await this._loadPostsRows();

            return true;
        } catch (error) {
            console.error("Failed to toggle post status:", error);
            this.load_error = "Could not update post status.";
            return false;
        }
    }

    async _updateProfile(nextProfile: AuthorProfile): Promise<boolean> {
        try {
            const response = await fetch(`${VITE_API_URL}/api/admin/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nextProfile),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile.");
            }

            const savedProfile = await response.json();
            this.profile = normalizeProfile(savedProfile);

            return true;
        } catch (error) {
            console.error("Failed to update profile:", error);
            this.load_error = "Could not save profile.";
            return false;
        }
    }

}