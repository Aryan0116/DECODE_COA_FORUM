
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  category: PostCategory;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  image_url?: string;
  user?: User;
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  parent_id: string | null;
  created_at: string;
  likes_count: number;
  user?: User;
}

export type PostCategory = 'question' | 'announcement' | 'discussion' | 'resource';

export interface Like {
  id: string;
  user_id: string;
  post_id?: string;
  comment_id?: string;
  created_at: string;
}
