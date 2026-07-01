from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.db.supabase import get_supabase

app = FastAPI()

origins = [
    "http://localhost:5173",
    "localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.app\.github\.dev",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Public API endpoints for fetching blog posts, tags, categories, and authors from the Supabase database.

@app.get("/api/posts")
async def get_posts():
    client = get_supabase()

    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable."
        )

    try:
        result = (
            client.table("blog_posts")
            .select("*")
            .eq("status", "published")
            .order("published_date", desc=True)
            .execute()
        )
        return result.data or []
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch posts: {str(e)}"
        )


@app.get("/api/posts/{post_id}")
async def get_post(post_id: str):
    client = get_supabase()

    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable."
        )

    try:
        result = (
            client.table("blog_posts")
            .select("*")
            .eq("id", post_id)
            .eq("status", "published")
            .limit(1)
            .execute()
        )
        return result.data or []
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch post: {str(e)}"
        )

@app.get("/api/tags")
async def get_tags():
    client = get_supabase()

    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable."
        )

    try:
        result = (
            client.table("blog_posts")
            .select("tags")
            .execute()
        )

        if not result.data:
            return []

        unique_tags = set()
        for row in result.data:
            tags = row.get("tags") or []
            if isinstance(tags, list):
                unique_tags.update(tags)
            elif tags:
                unique_tags.add(tags)

        return sorted(unique_tags)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch tags: {str(e)}"
        )

@app.get("/api/tags/{tag_name}/posts")
async def get_posts_by_tag(tag_name: str):
    client = get_supabase()

    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable."
        )

    try:
        result = (
            client.table("blog_posts")
            .select("*")
            .eq("status", "published")
            .contains("tags", [tag_name])
            .order("published_date", desc=True)
            .execute()
        )
        return result.data or []
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch {tag_name}-related posts: {str(e)}"
        )

@app.get("/api/categories")
async def get_categories():
    client = get_supabase()

    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable."
        )

    try:
        result = (
            client.table("blog_posts")
            .select("category")
            .execute()
        )

        if not result.data:
            return []

        unique_categories = set()
        for row in result.data:
            category = row.get("category")
            if category:
                unique_categories.add(category)

        return sorted(unique_categories)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch categories: {str(e)}"
        )

@app.get("/api/categories/{category}/posts")
async def get_posts_by_category(category: str):
    client = get_supabase()

    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable."
        )

    try:
        result = (
            client.table("blog_posts")
            .select("*")
            .eq("status", "published")
            .eq("category", category)
            .order("published_date", desc=True)
            .execute()
        )
        return result.data or []
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch {category}-related posts: {str(e)}"
        )

@app.get("/api/authors")
async def get_authors():
    client = get_supabase()

    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable."
        )

    try:
        result = (
            client.table("blog_author_profile")
            .select("*")
            .eq("id", "primary")
            .limit(1)
            .execute()
        )
        return result.data or []
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch posts: {str(e)}"
        )

# Author API


#Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)