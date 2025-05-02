
# Function Flow and Function List

## Overview
This document details the key functions and their flow in the educational forum application, organized by feature area.

## Authentication Functions

### Authentication Flow
1. User inputs credentials → `signIn()` or `signUp()`
2. Supabase validates credentials
3. On success, AuthContext is updated with user data
4. UI updates based on authentication state

### Key Authentication Functions

| Function | File | Description |
|----------|------|-------------|
| `signIn(email, password)` | `src/lib/supabaseClient.ts` | Signs in a user with email and password |
| `signUp(email, password, metadata)` | `src/lib/supabaseClient.ts` | Registers a new user with email, password, and additional metadata |
| `signOut()` | `src/lib/supabaseClient.ts` | Signs out the current user |
| `getSession()` | `src/lib/supabaseClient.ts` | Retrieves the current session if it exists |
| `verifyTeacherCode(code)` | `src/lib/supabaseClient.ts` | Verifies if a teacher registration code is valid |

## Post Management Functions

### Post Creation Flow
1. User fills form → `handleSubmit()` in CreatePostForm
2. `CreatePostForm` calls `uploadImage()` if an image is present
3. `CreatePostForm` calls `createPost()` with post data
4. UI updates with new post or displays error

### Post Viewing Flow
1. Forum component loads → calls `getPosts()` 
2. Posts are rendered in `PostList` component
3. User clicks on post → navigates to `PostDetail` page
4. `PostDetail` loads → calls `getPost()` with post ID

### Key Post Functions

| Function | File | Description |
|----------|------|-------------|
| `getPosts(category)` | `src/lib/supabaseClient.ts` | Fetches all posts, optionally filtered by category |
| `getPost(id)` | `src/lib/supabaseClient.ts` | Fetches a single post by ID with user data |
| `createPost(post)` | `src/lib/supabaseClient.ts` | Creates a new post in the database |
| `updatePost(id, updates)` | `src/lib/supabaseClient.ts` | Updates an existing post |
| `deletePost(id)` | `src/lib/supabaseClient.ts` | Deletes a post by ID |
| `uploadImage(file, path)` | `src/lib/supabaseClient.ts` | Uploads an image to Supabase storage |

## Comment Management Functions

### Comment Creation Flow
1. User writes comment → submits comment form
2. Component calls `createComment()` with comment data
3. New comment is added to UI (optimistically)
4. Backend confirms comment creation

### Key Comment Functions

| Function | File | Description |
|----------|------|-------------|
| `getComments(postId)` | `src/lib/supabaseClient.ts` | Fetches all comments for a specific post |
| `createComment(comment)` | `src/lib/supabaseClient.ts` | Creates a new comment |
| `updateComment(id, content)` | `src/lib/supabaseClient.ts` | Updates an existing comment |
| `deleteComment(id)` | `src/lib/supabaseClient.ts` | Deletes a comment by ID |

## Like Management Functions

### Like Flow
1. User clicks like button → component calls appropriate like function
2. UI updates like count (optimistically)
3. Backend confirms like action

### Key Like Functions

| Function | File | Description |
|----------|------|-------------|
| `likePost(userId, postId)` | `src/lib/supabaseClient.ts` | Adds a like to a post |
| `unlikePost(userId, postId)` | `src/lib/supabaseClient.ts` | Removes a like from a post |
| `likeComment(userId, commentId)` | `src/lib/supabaseClient.ts` | Adds a like to a comment |
| `unlikeComment(userId, commentId)` | `src/lib/supabaseClient.ts` | Removes a like from a comment |
| `checkUserLiked(userId, postId, commentId)` | `src/lib/supabaseClient.ts` | Checks if a user has liked a post or comment |

## User Profile Functions

### Profile Update Flow
1. User modifies profile → submits profile form
2. Component calls `uploadAvatar()` if a new avatar is provided
3. Component calls `updateUserProfile()` with profile data
4. UI updates with new profile information

### Key Profile Functions

| Function | File | Description |
|----------|------|-------------|
| `getUserProfile(userId)` | `src/lib/supabaseClient.ts` | Fetches user profile data |
| `updateUserProfile(userId, updates)` | `src/lib/supabaseClient.ts` | Updates user profile information |
| `uploadAvatar(userId, file)` | `src/lib/supabaseClient.ts` | Uploads a user avatar image |

## Component Hierarchy and Data Flow

```
App
├── AuthContext (manages auth state)
├── Layout
│   ├── Header (navigation, auth state display)
│   ├── Content Routes
│   │   ├── Index (landing page)
│   │   ├── Forum (post listing)
│   │   │   ├── PostList (displays posts)
│   │   │   └── CreatePostForm (creates posts)
│   │   ├── PostDetail (single post view)
│   │   │   └── CommentList (displays comments)
│   │   ├── Login (auth page)
│   │   ├── Register (auth page)
│   │   ├── Profile (user profile page)
│   │   └── NotFound (404 page)
│   └── Footer
└── QueryClient (manages data fetching)
```

## Key Data Flows

### Post Creation
```
CreatePostForm.tsx
├── handleSubmit()
│   ├── uploadImage() → supabaseClient.ts
│   └── createPost() → supabaseClient.ts
│       └── supabase.from('posts').insert()
```

### Post Viewing
```
Forum.tsx
├── getPosts() → supabaseClient.ts
│   └── supabase.from('posts').select()
│       └── transform data → PostList.tsx
```

### Post Detail
```
PostDetail.tsx
├── getPost() → supabaseClient.ts
│   └── supabase.from('posts').select().single()
├── getComments() → supabaseClient.ts
│   └── supabase.from('comments').select()
│       └── transform data → CommentList.tsx
```

### Like Management
```
PostDetail.tsx
├── Like button clicked
│   ├── checkUserLiked() → supabaseClient.ts
│   │   └── supabase.from('likes').select()
│   ├── If not liked → likePost() → supabaseClient.ts
│   │   └── supabase.from('likes').insert()
│   ├── If liked → unlikePost() → supabaseClient.ts
│   │   └── supabase.from('likes').delete()
│   └── Update UI state
```

## Error Handling Flow

Most functions follow this error handling pattern:
1. Call Supabase client function
2. Check for error response
3. If error, display toast notification
4. Update UI accordingly (revert optimistic updates if needed)

This document provides a comprehensive overview of the key functions and their flow in the educational forum application. Understanding these functions and their interactions is crucial for maintaining and extending the application.
