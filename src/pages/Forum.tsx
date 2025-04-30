import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPosts } from '@/lib/supabaseClient';
import { Post } from '@/types/forum';
import PostList from '@/components/forum/PostList';
import CreatePostForm from '@/components/forum/CreatePostForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Search, PlusCircle, MessageSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export default function Forum() {
  const { user, isLoading: authLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeCategory = searchParams.get('category') || 'all';
  
  useEffect(() => {
    loadPosts();
  }, [activeCategory]);
  
  const loadPosts = async () => {
    setIsLoading(true);
    try {
      // console.log('Loading posts for category:', activeCategory);
      const { posts: fetchedPosts, error } = await getPosts(activeCategory === 'all' ? undefined : activeCategory);
      
      if (error) {
        // console.error('Error loading posts:', error);
        toast('Failed to load posts', {
          description: error.message,
          position: 'bottom-right',
        });
      } else if (fetchedPosts) {
        // console.log('Posts loaded successfully:', fetchedPosts);
        setPosts(fetchedPosts);
      }
    } catch (error) {
      // console.error('Error in loadPosts:', error);
      toast('Failed to load posts', {
        description: 'There was an error loading posts. Please try again.',
        position: 'bottom-right',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTabChange = (value: string) => {
    setSearchParams({ category: value });
  };
  
  const handleCreateSuccess = () => {
    // console.log('Post created successfully, reloading posts');
    setCreateDialogOpen(false);
    toast('Post created successfully', {
      description: 'Your post has been published to the forum.',
      position: 'bottom-right',
    });
    loadPosts();
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side filter
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };
  
  const filteredPosts = searchQuery
    ? posts.filter(
        post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className="container py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="mb-8" variants={itemVariants}>
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="text-primary h-8 w-8" />
          <h1 className="text-3xl font-bold">DECODE CO-A Forum</h1>
        </div>
        <p className="text-muted-foreground">
          Join the discussion, ask questions, and share knowledge with the community.
        </p>
      </motion.div>
      
      <motion.div 
        className="flex flex-col md:flex-row justify-between gap-4 mb-6"
        variants={itemVariants}
      >
        <form 
          className="flex w-full md:w-96 items-center space-x-2 relative group" 
          onSubmit={handleSearch}
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              className="pl-10 pr-4 w-full transition-all focus:ring-2 focus:ring-primary/20"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            type="submit" 
            className="transition-all duration-300 hover:shadow-md"
          >
            Search
          </Button>
        </form>
        
        {user && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="flex items-center gap-2 transition-all duration-300 hover:shadow-md hover:scale-105"
                size="lg"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Create Post</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-primary" />
                  Create a New Post
                </DialogTitle>
                <DialogDescription>
                  Share your thoughts, questions, or resources with the community.
                </DialogDescription>
              </DialogHeader>
              <CreatePostForm onSuccess={handleCreateSuccess} />
            </DialogContent>
          </Dialog>
        )}
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Tabs defaultValue={activeCategory} onValueChange={handleTabChange}>
          <div className="overflow-x-auto pb-2">
            <TabsList className="p-1">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="question"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                Questions
              </TabsTrigger>
              <TabsTrigger 
                value="announcement"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                Announcements
              </TabsTrigger>
              <TabsTrigger 
                value="discussion"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                Discussions
              </TabsTrigger>
              <TabsTrigger 
                value="resource"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200"
              >
                Resources
              </TabsTrigger>
            </TabsList>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value={activeCategory} className="mt-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-2/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <PostList posts={filteredPosts} isLoading={isLoading} />
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
      
      {!authLoading && !user && (
        <motion.div 
          className="mt-8 p-6 bg-secondary/50 backdrop-blur-sm rounded-lg text-center shadow-sm border border-secondary"
          variants={itemVariants}
          animate={{ 
            boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 20px rgba(0,0,0,0.1)", "0px 0px 0px rgba(0,0,0,0)"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="text-primary h-5 w-5" />
            <p className="font-medium text-lg">Want to join the discussion?</p>
          </div>
          <div className="space-x-4">
            <Button 
              variant="outline" 
              asChild
              className="transition-all duration-300 hover:shadow-md hover:bg-background"
            >
              <a href="/login">Log in</a>
            </Button>
            <Button 
              asChild
              className="transition-all duration-300 hover:shadow-md hover:scale-105"
            >
              <a href="/register">Sign up</a>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}