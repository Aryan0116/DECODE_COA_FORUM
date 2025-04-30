import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPost, getComments, deletePost, supabase } from '@/lib/supabaseClient';
import { Post, Comment } from '@/types/forum';
import { useAuth } from '@/contexts/AuthContext';
import CommentList from '@/components/forum/CommentList';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Trash2, MessageCircle, ArrowLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadPost();
      loadComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadPost = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const { post, error: postError } = await getPost(id);
      if (postError) {
        console.error("Error loading post:", postError);
        throw postError;
      }
      setPost(post);
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Failed to load the post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadComments = async () => {
    if (!id) return;
    
    setCommentsLoading(true);
    try {
      const { comments, error: commentsError } = await getComments(id);
      if (commentsError) {
        console.error("Error loading comments:", commentsError);
        throw commentsError;
      }
      setComments(comments || []);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments. Please try again.');
    } finally {
      setCommentsLoading(false);
    }
  };

  const loadPostAndComments = async () => {
    await loadPost();
    await loadComments();
  };

  const handleDeletePost = async () => {
    if (!post || !user || user.id !== post.user_id) {
      toast.error('You are not authorized to delete this post');
      return;
    }

    try {
      const { error } = await deletePost(post.id);
      if (error) throw error;
      
      toast.success('Post deleted successfully');
      navigate('/forum');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleSharePost = () => {
    setIsShareMenuOpen(!isShareMenuOpen);
    if (navigator.share) {
      navigator.share({
        title: post?.title || 'Shared Post',
        text: `Check out this post: ${post?.title}`,
        url: window.location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'question':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'announcement':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'discussion':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'resource':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUsernameInitials = (username: string | undefined) => {
    if (!username) return 'UN';
    return username.substring(0, 2).toUpperCase();
  };

  const getUserRoleStyle = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'bg-amber-100 text-amber-800 border border-amber-200 text-xs px-2 py-1 rounded-full';
      case 'admin':
        return 'bg-red-100 text-red-800 border border-red-200 text-xs px-2 py-1 rounded-full';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200 text-xs px-2 py-1 rounded-full';
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6 opacity-50">
            <ArrowLeft className="mr-2" size={18} />
            <span>Back to Forum</span>
          </div>
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded-lg w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-40 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-4xl mx-auto py-12 px-4"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Post not found</h1>
          <p className="mb-6 text-lg text-gray-600">The post you're looking for doesn't exist or has been removed.</p>
          <Button asChild size="lg">
            <Link to="/forum">Back to Forum</Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-4xl mx-auto py-12 px-4"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Button 
            asChild 
            variant="ghost" 
            className="group mb-6 hover:bg-secondary/80 transition-all"
          >
            <Link to="/forum" className="flex items-center">
              <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={18} />
              Back to Forum
            </Link>
          </Button>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <motion.h1 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="text-3xl font-bold"
                  >
                    {post.title}
                  </motion.h1>
                  
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <Badge 
                        className={`${getCategoryColor(post.category)} px-3 py-1 text-sm border rounded-full`}
                      >
                        {post.category}
                      </Badge>
                    </motion.div>
                    
                    {user && user.id === post.user_id && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDeletePost}
                          className="h-9 w-9 rounded-full p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
                
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="flex items-center space-x-3 mb-6 bg-secondary/30 p-3 rounded-lg"
                >
                  <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage src={post.user?.avatar_url} />
                    <AvatarFallback className="bg-primary/90 text-primary-foreground">
                      {getUsernameInitials(post.user?.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {post.user?.username || 'Anonymous User'}
                      </span>
                      {post.user?.role && (
                        <span className={getUserRoleStyle(post.user.role)}>
                          {post.user.role}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Posted {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="prose max-w-none mb-8 whitespace-pre-line text-lg leading-relaxed"
                >
                  {post.content}
                </motion.div>
                
                {post.image_url && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-6 mb-6"
                  >
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="rounded-lg mx-auto max-w-full h-auto max-h-[500px] object-contain shadow-md hover:shadow-xl transition-shadow duration-300"
                    />
                  </motion.div>
                )}
              </CardContent>
              
              <CardFooter className="bg-secondary/30 px-8 py-4 flex justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2"
                  >
                    <Button
                      variant="ghost"
                      className="space-x-2 flex items-center"
                      onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      <MessageCircle size={18} />
                      <span>{post.comments_count || 0} comments</span>
                    </Button>
                  </motion.div>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    className="space-x-2 flex items-center"
                    onClick={handleSharePost}
                  >
                    <Share2 size={18} />
                    <span>Share</span>
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
        
        <Separator className="my-10" />
        
        <motion.div
          id="comments-section"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {commentsLoading ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Comments</h2>
              <div className="animate-pulse space-y-4">
                <div className="h-24 bg-gray-100 rounded-lg"></div>
                <div className="h-24 bg-gray-100 rounded-lg"></div>
                <div className="h-24 bg-gray-100 rounded-lg"></div>
              </div>
            </div>
          ) : (
            <CommentList
              comments={comments}
              postId={post.id}
              onCommentAdded={loadPostAndComments}
              onCommentDeleted={loadPostAndComments}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}