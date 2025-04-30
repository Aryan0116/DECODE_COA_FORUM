
import { useState, useEffect } from 'react';
import { Comment } from '@/types/forum';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { createComment, deleteComment, supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface CommentListProps {
  comments: Comment[];
  postId: string;
  onCommentAdded: () => void;
  onCommentDeleted: () => void;
}

export default function CommentList({ comments, postId, onCommentAdded, onCommentDeleted }: CommentListProps) {
  const { user } = useAuth();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  // Initialize localComments when comments load
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  // Group comments by parent
  const parentComments = localComments.filter(comment => !comment.parent_id);
  const childComments = localComments.filter(comment => comment.parent_id);

  const getChildComments = (parentId: string) => {
    return childComments.filter(comment => comment.parent_id === parentId);
  };

  // Handle new comment submission
  const handleSubmitComment = async () => {
    if (!user) {
      toast.error('You must be logged in to comment');
      return;
    }

    if (commentContent.trim() === '') return;

    setIsSubmitting(true);
    try {
      const { comment, error } = await createComment({
        content: commentContent,
        user_id: user.id,
        post_id: postId,
        parent_id: null,
      });

      if (error) throw error;

      setCommentContent('');
      onCommentAdded();
      toast.success('Comment added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add comment');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reply submission
  const handleSubmitReply = async (parentId: string) => {
    if (!user) {
      toast.error('You must be logged in to reply');
      return;
    }

    if (replyContent.trim() === '') return;

    setIsSubmitting(true);
    try {
      const { comment, error } = await createComment({
        content: replyContent,
        user_id: user.id,
        post_id: postId,
        parent_id: parentId,
      });

      if (error) throw error;

      setReplyContent('');
      setReplyingTo(null);
      onCommentAdded();
      toast.success('Reply added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add reply');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string, authorId: string) => {
    if (!user || user.id !== authorId) {
      toast.error('You are not authorized to delete this comment');
      return;
    }

    try {
      const { error } = await deleteComment(commentId);
      if (error) throw error;
      
      // Update local comments state to remove the deleted comment
      setLocalComments(prevComments => prevComments.filter(comment => 
        comment.id !== commentId && comment.parent_id !== commentId
      ));
      
      onCommentDeleted();
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const renderComment = (comment: Comment) => (
    <div key={comment.id} className="py-4">
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.user?.avatar_url} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {comment.user?.username?.substring(0, 2)?.toUpperCase() || 'UN'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">{comment.user?.username || 'Anonymous User'}</p>
              {comment.user?.role === 'teacher' && (
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                  Teacher
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {user && (
                <>
                  <Button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    variant="ghost"
                    size="sm"
                    className="h-8"
                  >
                    Reply
                  </Button>
                  {user.id === comment.user_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id, comment.user_id)}
                      className="h-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="mt-1 text-sm">
            {comment.content}
          </div>

          {/* Reply form */}
          {replyingTo === comment.id && (
            <div className="mt-3">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-24"
              />
              <div className="mt-2 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={isSubmitting || !replyContent.trim()}
                >
                  {isSubmitting ? 'Submitting...' : 'Reply'}
                </Button>
              </div>
            </div>
          )}

          {/* Render child comments */}
          {getChildComments(comment.id).map((childComment) => (
            <div key={childComment.id} className="nested-comment">
              <div className="flex space-x-3 mt-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={childComment.user?.avatar_url} />
                  <AvatarFallback className="bg-secondary text-xs">
                    {childComment.user?.username?.substring(0, 2)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">
                        {childComment.user?.username || 'User'}
                      </p>
                      {childComment.user?.role === 'teacher' && (
                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                          Teacher
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(childComment.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user && user.id === childComment.user_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(childComment.id, childComment.user_id)}
                          className="h-6 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="mt-1 text-sm">
                    {childComment.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Comments ({comments.length})
      </h2>

      {/* Comment input for logged in users */}
      {user && (
        <div className="flex space-x-3 pb-6">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.username?.substring(0, 2)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-24"
            />
            <div className="mt-2 flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={isSubmitting || !commentContent.trim()}
              >
                {isSubmitting ? 'Submitting...' : 'Comment'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Login prompt for non-logged in users */}
      {!user && (
        <div className="rounded-md bg-secondary p-4 text-center">
          <p>Please login to join the discussion</p>
        </div>
      )}

      {/* Comments list */}
      <div className="divide-y">
        {parentComments.length > 0 ? (
          parentComments.map(renderComment)
        ) : (
          <p className="py-4 text-center text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
