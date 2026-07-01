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

#Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)