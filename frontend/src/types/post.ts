export type PostStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: PostStatus;
  published_date: Date | null;
  updated_at: Date | null;
  created_at: Date | null;
  cover_image: string | null;
  read_time: string | null;
  views: number;
  is_featured: boolean;
};