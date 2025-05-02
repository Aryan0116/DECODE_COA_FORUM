
# Database Setup and Configuration

## Overview
This document details the database setup for the educational forum application built with Supabase. It covers table structures, relationships, and database functions.

## Supabase Configuration
The application uses Supabase as its backend, which provides PostgreSQL database, authentication, storage, and real-time capabilities.

### Project Configuration
```
project_id = "stcvdirvaybkggnhpqus"
```

## Database Schema

### Tables

#### users
```sql
CREATE TABLE public.users (
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  avatar_url TEXT,
  name TEXT NOT NULL,
  teacher_code TEXT,
  email TEXT NOT NULL,
  id UUID NOT NULL PRIMARY KEY,
  user_type USER-DEFINED NOT NULL DEFAULT 'student'::user_role
);
```

#### posts
```sql
CREATE TABLE public.posts (
  title TEXT NOT NULL,
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  category USER-DEFINED NOT NULL DEFAULT 'discussion'::post_category,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  content TEXT NOT NULL,
  image_url TEXT
);
```

#### comments
```sql
CREATE TABLE public.comments (
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  likes_count INTEGER DEFAULT 0,
  content TEXT NOT NULL,
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  post_id UUID NOT NULL,
  parent_id UUID
);
```

#### likes
```sql
CREATE TABLE public.likes (
  post_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  comment_id UUID
);
```

#### teacher_codes
```sql
CREATE TABLE public.teacher_codes (
  code TEXT NOT NULL PRIMARY KEY,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### Enums

#### user_role
```sql
CREATE TYPE public.user_role AS ENUM ('student', 'teacher', 'admin');
```

#### post_category
```sql
CREATE TYPE public.post_category AS ENUM ('question', 'announcement', 'discussion', 'resource');
```

## Database Functions

### Handle New User
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO public.users (id, email, name, user_type, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        (NEW.raw_user_meta_data->>'role')::user_role,
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$function$
```

### Increment Post Likes
```sql
CREATE OR REPLACE FUNCTION public.increment_post_likes(post_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE posts
  SET likes_count = COALESCE(likes_count, 0) + 1
  WHERE id = post_id;
END;
$function$
```

### Decrement Post Likes
```sql
CREATE OR REPLACE FUNCTION public.decrement_post_likes(post_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE posts
  SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
  WHERE id = post_id;
END;
$function$
```

### Increment Post Likes Count (Trigger Function)
```sql
CREATE OR REPLACE FUNCTION public.increment_post_likes_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE public.posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$function$
```

### Decrement Post Likes Count (Trigger Function)
```sql
CREATE OR REPLACE FUNCTION public.decrement_post_likes_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE public.posts
    SET likes_count = likes_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
END;
$function$
```

### Increment Comments Count
```sql
CREATE OR REPLACE FUNCTION public.increment_comments_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE public.posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$function$
```

### Decrement Comments Count
```sql
CREATE OR REPLACE FUNCTION public.decrement_comments_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE public.posts
    SET comments_count = comments_count - 1
    WHERE id = OLD.post_id;
    RETURN OLD;
END;
$function$
```

## Setting Up Row-Level Security (RLS)

The database should have Row-Level Security enabled for all tables, with appropriate policies configured to:

1. Allow users to view all posts and comments
2. Allow users to create posts and comments
3. Allow users to update only their own posts and comments
4. Allow users to delete only their own posts and comments
5. Allow teacher and admin roles additional permissions

## Storage Configuration

The application uses Supabase Storage for storing:
1. Post images in the "forum-images" bucket
2. User avatars in the "forum-images/avatars/{user_id}" path

## Setting Up the Database

To set up the database for this application:

1. Create a new Supabase project
2. Execute the SQL commands to create tables, enums, and functions
3. Configure storage buckets
4. Set up authentication (email/password)
5. Configure Row-Level Security policies
6. Seed any initial data (e.g., teacher codes)

## Database Maintenance

Regular maintenance tasks to consider:

1. Monitoring database size and performance
2. Setting up backups
3. Cleaning up unused images in storage
4. Monitoring authentication attempts

This database setup provides a solid foundation for the educational forum application, supporting all required features while maintaining good security practices through Row-Level Security.
