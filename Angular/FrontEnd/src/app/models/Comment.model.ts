// comment.model.ts
export interface Comment {
    idcom: number;
    content: string;
    createdAt: Date;
    likes: number;
    likedByUser: boolean;
    blogId: number;  // Changed from 'blog: any' to 'blogId: number'
  }   // The ID of the blog post this comment belongs to
