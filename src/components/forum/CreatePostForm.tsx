import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { createPost, uploadImage } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100),
  content: z.string().min(10, { message: 'Content must be at least 10 characters' }),
  category: z.enum(['question', 'announcement', 'discussion', 'resource'], {
    required_error: 'Please select a category',
  }),
  image: z.instanceof(FileList).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreatePostFormProps {
  onSuccess?: () => void;
}

export default function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'discussion',
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to create a post");
      return;
    }

    console.log('Creating post with values:', values);
    console.log('User creating post:', user);

    setIsLoading(true);
    try {
      let imageUrl = undefined;

      // Upload image if provided
      const files = values.image as FileList | undefined;
      if (files && files.length > 0) {
        const file = files[0];
        console.log('Uploading image:', file.name);
        const { url, error } = await uploadImage(file, `posts/${user.id}`);
        if (error) {
          console.error('Error uploading image:', error);
          throw error;
        }
        console.log('Image uploaded successfully, URL:', url);
        imageUrl = url;
      }

      // Create post
      const postData = {
        title: values.title,
        content: values.content,
        category: values.category,
        user_id: user.id,
        image_url: imageUrl,
      };

      console.log('Creating post with data:', postData);

      const { post, error } = await createPost(postData);

      if (error) {
        console.error('Error creating post:', error);
        throw error;
      }

      console.log('Post created successfully:', post);
      toast.success("Post created successfully!");
      form.reset();
      setPreviewImage(null);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error(error.message || 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 max-h-[calc(100vh-200px)] overflow-y-hidden"> {/* Added max-h and overflow-y-hidden to the Card */}
      <ScrollArea className="h-[calc(100vh-300px)] md:h-[calc(100vh-260px)]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a title for your post" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="question">Question</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="discussion">Discussion</SelectItem>
                      <SelectItem value="resource">Resource</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your post content here..."
                      className="min-h-48"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Image (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        onChange(e.target.files);
                        handleImageChange(e);
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  {previewImage && (
                    <div className="mt-2 rounded-md overflow-hidden">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-40 w-full object-contain bg-muted"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? 'Creating post...' : 'Create Post'}
            </Button>
          </form>
        </Form>
      </ScrollArea>
    </Card>
  );
}