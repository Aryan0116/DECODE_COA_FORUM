import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '@/types/forum';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Calendar, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
}

const getCategoryBadge = (category: string) => {
  const styles = {
    question: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      icon: '❓',
      label: 'Question'
    },
    announcement: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: '📢',
      label: 'Announcement'
    },
    discussion: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: '💬',
      label: 'Discussion'
    },
    resource: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      icon: '📚',
      label: 'Resource'
    },
    default: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      icon: '📝',
      label: category
    }
  };

  const style = styles[category as keyof typeof styles] || styles.default;
  
  return (
    <Badge 
      className={`${style.bg} ${style.text} hover:opacity-90 transition-opacity border-none px-2 py-1 text-xs font-medium sm:px-3`}
      variant="outline"
    >
      <span className="mr-1">{style.icon}</span>
      <span className="hidden xs:inline">{style.label}</span>
    </Badge>
  );
};

const getUserRoleBadge = (role: string) => {
  const styles = {
    teacher: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-200',
      label: 'Teacher'
    },
    admin: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      label: 'Admin'
    },
    default: {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      border: 'border-gray-200',
      label: role
    }
  };

  const style = styles[role as keyof typeof styles] || styles.default;
  
  return (
    <span className={`${style.bg} ${style.text} ${style.border} text-xs px-2 py-0.5 rounded-full border`}>
      {style.label}
    </span>
  );
};

export default function PostList({ posts, isLoading }: PostListProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden border border-muted">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <div className="flex justify-between items-start gap-2">
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-5 w-16 sm:w-24 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="pb-2 px-3 sm:px-6">
              <Skeleton className="h-4 w-full rounded-md mb-2" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
              <div className="mt-4">
                <Skeleton className="h-32 sm:h-40 w-full rounded-md" />
              </div>
            </CardContent>
            <CardFooter className="pt-2 px-3 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                </div>
                <Skeleton className="h-5 w-full sm:w-32 rounded-md" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-4 sm:p-8 text-center border-dashed border-2 border-muted">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="bg-muted/20 p-3 sm:p-4 rounded-full">
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
            <p className="text-lg sm:text-xl font-medium">No posts yet</p>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              Be the first to start a discussion! Create a post to share your thoughts, questions, or resources with the community.
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-4 sm:space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {posts.map((post) => (
        <motion.div key={post.id} variants={itemVariants}>
          <Link to={`/forum/post/${post.id}`} className="block">
            <Card className="overflow-hidden border hover:shadow-md transition-all duration-300 hover:border-primary">
              <CardHeader className="pb-2 px-3 sm:px-6">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-base sm:text-xl font-semibold line-clamp-2">
                    {post.title}
                  </CardTitle>
                  {getCategoryBadge(post.category)}
                </div>
              </CardHeader>
              
              <CardContent className="pb-3 px-3 sm:px-6">
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 line-clamp-2">{post.content}</p>
                
                {post.image_url && (
                  <motion.div 
                    className="mt-2 rounded-md overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full object-contain max-h-64 sm:max-h-96" 
                      loading="lazy"
                    />
                  </motion.div>
                )}
              </CardContent>
              
              <CardFooter className="pt-2 px-3 sm:px-6 border-t bg-muted/10">
                <div className="flex flex-col sm:flex-row sm:justify-between w-full gap-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 border-2 border-background">
                      <AvatarImage src={post.user?.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {post.user?.username ? post.user.username.substring(0, 2).toUpperCase() : 'UN'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs sm:text-sm font-medium truncate max-w-32 sm:max-w-full">
                          {post.user?.username || 'Unknown User'}
                        </span>
                        {post.user?.role && (
                          <div className="hidden xs:inline">
                            {getUserRoleBadge(post.user.role)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="whitespace-nowrap">{post.comments_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="whitespace-nowrap">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}