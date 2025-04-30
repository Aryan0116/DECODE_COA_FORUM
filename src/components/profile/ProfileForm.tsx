
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@/types/forum';
import { updateUserProfile, uploadAvatar } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const formSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  avatar: z.instanceof(FileList).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  user: User;
  onUpdate: (user: User) => void;
}

export default function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(user.avatar_url || null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username,
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      let avatarUrl = user.avatar_url;
      
      // Upload avatar if provided
      const files = values.avatar as FileList | undefined;
      if (files && files.length > 0) {
        const file = files[0];
        const { url, error } = await uploadAvatar(user.id, file);
        if (error) throw error;
        avatarUrl = url;
      }
      
      // Update profile
      const { profile, error } = await updateUserProfile(user.id, {
        username: values.username,
        avatar_url: avatarUrl,
      });
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
      onUpdate({ ...user, ...profile, avatar_url: avatarUrl });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-2">
                  <AvatarImage src={previewImage || undefined} />
                  <AvatarFallback className="text-xl">
                    {user.username ? user.username.substring(0, 2).toUpperCase() : 'UN'}
                  </AvatarFallback>
                </Avatar>
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex justify-center">
                          <label
                            htmlFor="avatar-upload"
                            className="cursor-pointer text-sm text-primary hover:underline"
                          >
                            Change avatar
                            <Input
                              id="avatar-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                onChange(e.target.files);
                                handleAvatarChange(e);
                              }}
                              {...fieldProps}
                            />
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <div>
                <span className="text-sm font-medium">Email: </span>
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div>
                <span className="text-sm font-medium">Role: </span>
                <span className="text-sm text-muted-foreground capitalize">{user.role}</span>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Saving changes...' : 'Save changes'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
