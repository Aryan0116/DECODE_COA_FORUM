
import { createClient } from '@supabase/supabase-js';
import { User, Post, Comment, Like } from '@/types/forum';

// Use environment variables for Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Auth functions
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string, metadata: { username: string, role: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Posts
export const getPosts = async (category?: string) => {
  console.log('Getting posts with category:', category);
  
  let query = supabase
    .from('posts')
    .select(`
      *,
      user:users(
        id,
        name,
        user_type,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  console.log('Posts query result:', { data, error });
  
  // Transform the data to match the Post type
  const posts = data?.map(item => ({
    ...item,
    user: item.user ? {
      id: item.user.id,
      username: item.user.name,
      role: item.user.user_type,
      avatar_url: item.user.avatar_url
    } : undefined
  })) as Post[];
  
  return { posts, error };
};

export const getPost = async (id: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, user:users(id, name, user_type, avatar_url)')
    .eq('id', id)
    .single();
    
  // Transform to match Post type
  let post = null;
  if (data) {
    post = {
      ...data,
      user: data.user ? {
        id: data.user.id,
        username: data.user.name,
        role: data.user.user_type,
        avatar_url: data.user.avatar_url
      } : undefined
    } as Post;
  }
  
  return { post, error };
};

export const createPost = async (post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count'>) => {
  console.log('Creating post with data:', post);
  
  const { data, error } = await supabase
    .from('posts')
    .insert([post])
    .select(`
      *,
      user:users(
        id,
        name,
        user_type,
        avatar_url
      )
    `);
  
  console.log('Create post response:', { data, error });
  
  let createdPost = null;
  if (data && data.length > 0) {
    createdPost = {
      ...data[0],
      user: data[0].user ? {
        id: data[0].user.id,
        username: data[0].user.name,
        role: data[0].user.user_type,
        avatar_url: data[0].user.avatar_url
      } : undefined
    } as Post;
  }
  
  return { post: createdPost, error };
};

export const updatePost = async (id: string, updates: Partial<Post>) => {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select();
  return { post: data?.[0] as Post, error };
};

export const deletePost = async (id: string) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);
  return { error };
};

// Comments
export const getComments = async (postId: string) => {
  console.log('Fetching comments for post:', postId);
  const { data, error } = await supabase
    .from('comments')
    .select('*, user:users(id, name, user_type, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  
  // Transform data to match Comment type
  const comments = data?.map(item => ({
    ...item,
    user: item.user ? {
      id: item.user.id,
      username: item.user.name,
      role: item.user.user_type,
      avatar_url: item.user.avatar_url
    } : undefined
  })) as Comment[];
  
  console.log('Comments result:', { comments, error });
  return { comments, error };
};

export const createComment = async (comment: Omit<Comment, 'id' | 'created_at' | 'likes_count'>) => {
  console.log('Creating comment with data:', comment);
  const { data, error } = await supabase
    .from('comments')
    .insert([comment])
    .select('*, user:users(id, name, user_type, avatar_url)');
  
  console.log('Create comment response:', { data, error });
  
  let createdComment = null;
  if (data && data.length > 0) {
    createdComment = {
      ...data[0],
      user: data[0].user ? {
        id: data[0].user.id,
        username: data[0].user.name,
        role: data[0].user.user_type,
        avatar_url: data[0].user.avatar_url
      } : undefined
    } as Comment;
  }
  
  return { comment: createdComment, error };
};

export const updateComment = async (id: string, content: string) => {
  const { data, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', id)
    .select();
  return { comment: data?.[0] as Comment, error };
};

export const deleteComment = async (id: string) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);
  return { error };
};

// Likes
export const likePost = async (userId: string, postId: string) => {
  // First check if the user has already liked this post
  const { data: existingLike, error: checkError } = await supabase
    .from('likes')
    .select('id')
    .match({ user_id: userId, post_id: postId })
    .maybeSingle();
    
  if (checkError) {
    return { data: null, error: checkError };
  }
  
  // If like already exists, return early
  if (existingLike) {
    return { data: existingLike, error: null };
  }
  
  // Otherwise create the new like
  const { data, error } = await supabase
    .from('likes')
    .insert([{ user_id: userId, post_id: postId }])
    .select();
    
  return { data, error };
};

export const unlikePost = async (userId: string, postId: string) => {
  const { error } = await supabase
    .from('likes')
    .delete()
    .match({ user_id: userId, post_id: postId });
  return { error };
};

export const likeComment = async (userId: string, commentId: string) => {
  try {
    // First check if the user has already liked this comment
    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select('id')
      .match({ user_id: userId, comment_id: commentId })
      .maybeSingle();
      
    if (checkError) {
      return { data: null, error: checkError };
    }
    
    // If like already exists, return early without error
    if (existingLike) {
      return { data: existingLike, error: null };
    }
    
    // Otherwise create the new like
    const { data, error } = await supabase
      .from('likes')
      .insert([{ user_id: userId, comment_id: commentId }])
      .select();
      
    return { data, error };
  } catch (error) {
    console.error('Error in likeComment function:', error);
    return { data: null, error };
  }
};

export const unlikeComment = async (userId: string, commentId: string) => {
  try {
    const { error } = await supabase
      .from('likes')
      .delete()
      .match({ user_id: userId, comment_id: commentId });
    return { error };
  } catch (error) {
    console.error('Error in unlikeComment function:', error);
    return { error };
  }
};

// Check if user has liked a post or comment
export const checkUserLiked = async (userId: string, postId?: string, commentId?: string) => {
  try {
    const query = supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId);
      
    if (postId) {
      query.eq('post_id', postId);
    }
    
    if (commentId) {
      query.eq('comment_id', commentId);
    }
    
    const { data, error } = await query.maybeSingle();
    
    if (error) throw error;
    
    return { hasLiked: !!data, error: null };
  } catch (error) {
    console.error('Error checking if user liked:', error);
    return { hasLiked: false, error };
  }
};

// File uploads
export const uploadImage = async (file: File, path: string) => {
  console.log('Uploading image:', file.name, 'to path:', path);
  
  const { data, error } = await supabase.storage
    .from('forum-images')
    .upload(`${path}/${Date.now()}_${file.name}`, file);
  
  console.log('Upload response:', { data, error });
  
  let imageUrl = null;
  if (data) {
    const { data: urlData } = supabase.storage
      .from('forum-images')
      .getPublicUrl(data.path);
    imageUrl = urlData.publicUrl;
    console.log('Generated public URL:', imageUrl);
  }
  
  return { url: imageUrl, error };
};

// User profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  return { profile: data, error };
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const updateData: any = {};
  
  // Map User properties to the actual database column names
  if (updates.username) {
    updateData.name = updates.username;
  }
  if (updates.role) {
    updateData.user_type = updates.role;
  }
  if (updates.avatar_url !== undefined) {
    updateData.avatar_url = updates.avatar_url;
  }
  
  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select();
  return { profile: data?.[0], error };
};

export const uploadAvatar = async (userId: string, file: File) => {
  console.log('Uploading avatar for user:', userId);
  
  // Upload to storage
  const { data, error: uploadError } = await supabase.storage
    .from('forum-images')
    .upload(`avatars/${userId}/${Date.now()}_${file.name}`, file);
  
  if (uploadError || !data) {
    console.error('Error uploading avatar:', uploadError);
    return { url: null, error: uploadError };
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('forum-images')
    .getPublicUrl(data.path);
  
  const url = urlData.publicUrl;
  console.log('Avatar uploaded successfully, URL:', url);
  
  // Update user profile with avatar URL
  const { profile, error } = await updateUserProfile(userId, { avatar_url: url });
  
  return { url, profile, error };
};

export const verifyTeacherCode = async (code: string) => {
  const { data, error } = await supabase
    .from('teacher_codes')
    .select('*')
    .eq('code', code)
    .eq('is_used', false)
    .single();
  return { isValid: !!data, error };
};
