from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.db.supabase import get_supabase
import os
import logging

# App metadata
app = FastAPI(title="journal-on", version=os.getenv("APP_VERSION", "1.0.0"))

# Configure logging for production
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=LOG_LEVEL)
logger = logging.getLogger("journal-on")

cors_origins = os.getenv("CORS_ORIGINS")
if cors_origins:
    origins = [o.strip() for o in cors_origins.split(",") if o.strip()]


app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
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
        logger.exception("Failed to fetch posts")
        raise HTTPException(status_code=500, detail="Failed to fetch posts")


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
        logger.exception("Failed to fetch post %s", post_id)
        raise HTTPException(status_code=500, detail="Failed to fetch post")

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
        logger.exception("Failed to fetch tags")
        raise HTTPException(status_code=500, detail="Failed to fetch tags")

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
        logger.exception("Failed to fetch posts for tag %s", tag_name)
        raise HTTPException(status_code=500, detail="Failed to fetch tag-related posts")

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
        logger.exception("Failed to fetch categories")
        raise HTTPException(status_code=500, detail="Failed to fetch categories")

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
        logger.exception("Failed to fetch posts for category %s", category)
        raise HTTPException(status_code=500, detail="Failed to fetch category-related posts")

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
        logger.exception("Failed to fetch authors")
        raise HTTPException(status_code=500, detail="Failed to fetch authors")

# Admin API for fetching author's posts, running edits, deletes and profile updates.

# this one fetchs all posts, not just published posts.
@app.get("/api/admin/posts")
async def get_admin_posts():
    client = get_supabase()

    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable.",
        )
    
    try:
        result = (
            client.table("blog_posts")
            .select("*")
            .order("published_date", desc=True)
            .execute()
        )
        return result.data or []
    except Exception:
        logger.exception("Failed to fetch admin posts.")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch admin posts",
        )

@app.get("/api/admin/posts/{post_id}")
async def get_admin_post(post_id: str):
    client = get_supabase()

    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable.",
        )
    
    try:
        result = (
            client.table("blog_posts")
            .select("*")
            .eq("id", post_id)
            .limit(1)
            .execute()
        )
        rows = result.data or []

        if not rows:
            raise HTTPException(
                status_code=404,
                detail="Post not found.",
            )
        
        return rows[0]
    except Exception:
        logger.exception("Failed to fetch admin posts %s.", post_id)
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch post.",
        )

@app.post("/api/admin/posts")
async def create_admin_post(payload: dict):
    client = get_supabase()

    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable.",
        )

    try:
        result = (
            client.table("blog_posts")
            .insert(payload)
            .execute()
        )

        rows = result.data or []

        if not rows:
            raise HTTPException(
                status_code=500,
                detail="Insert failed"
            )

        return rows[0]

    except HTTPException:
        raise

    except Exception:
        logger.exception(
            "Failed to create post"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to create post"
        )

@app.patch("/api/admin/posts/{post_id}")
async def update_admin_post(
    post_id: str,
    payload: dict
):
    client = get_supabase()

    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable.",
        )

    try:
        result = (
            client.table("blog_posts")
            .update(payload)
            .eq("id", post_id)
            .execute()
        )

        rows = result.data or []

        if not rows:
            raise HTTPException(
                status_code=404,
                detail="Post not found",
            )

        return rows[0]

    except HTTPException:
        raise

    except Exception:
        logger.exception(
            "Failed to update post %s",
            post_id,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to update post",
        )

@app.delete("/api/admin/posts/{post_id}")
async def delete_admin_post(post_id: str):
    client = get_supabase()

    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable.",
        )

    try:
        (
            client.table("blog_posts")
            .delete()
            .eq("id", post_id)
            .execute()
        )

        return {
            "success": True
        }

    except Exception:
        logger.exception(
            "Failed to delete post %s",
            post_id,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to delete post",
        )

@app.patch("/api/admin/posts/{post_id}/status")
async def update_post_status(
    post_id: str,
    payload: dict,
):
    client = get_supabase()

    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable.",
        )

    try:
        result = (
            client.table("blog_posts")
            .update(
                {
                    "status": payload.status,
                    "published_date":
                        payload.published_date,
                }
            )
            .eq("id", post_id)
            .execute()
        )

        rows = result.data or []

        if not rows:
            raise HTTPException(
                status_code=404,
                detail="Post not found",
            )

        return rows[0]

    except HTTPException:
        raise

    except Exception:
        logger.exception(
            "Failed to update status"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to update status",
        )

@app.get("/api/admin/profile")
async def get_admin_profile():
    client = get_supabase()

    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable.",
        )

    try:
        result = (
            client.table("blog_author_profile")
            .select("*")
            .eq("id", "primary")
            .limit(1)
            .execute()
        )

        rows = result.data or []

        if not rows:
            return {}

        return rows[0]

    except Exception:
        logger.exception(
            "Failed to fetch profile"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch profile",
        )

@app.patch("/api/admin/profile")
async def update_admin_profile(
    payload: dict
):
    client = get_supabase()

    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable.",
        )

    try:
        result = (
            client.table("blog_author_profile")
            .update(payload)
            .eq("id", "primary")
            .execute()
        )

        rows = result.data or []

        if not rows:
            raise HTTPException(
                status_code=404,
                detail="Profile not found",
            )

        return rows[0]

    except HTTPException:
        raise

    except Exception:
        logger.exception(
            "Failed to update profile"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to update profile",
        )
    

@app.get("/health")
async def health_check():
    return {"status": "ok"}


#Run the app
if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST_VAR", "0.0.0.0")
    port = int(os.getenv("PORT_VAR", "8000"))
    uvicorn.run(app, host=host, port=port)