
# Entity-Relationship (ER) Diagram for Forum Application

## Overview
This document presents the Entity-Relationship diagram for the educational forum application, illustrating the database schema and relationships between entities.

## ER Diagram
```
┌───────────┐     ┌───────────┐     ┌───────────┐
│   Users   │     │   Posts   │     │ Comments  │
├───────────┤     ├───────────┤     ├───────────┤
│ id (PK)   │◄───┤ user_id   │     │ id (PK)   │
│ email     │     │ id (PK)   │◄───┤ post_id   │
│ username  │     │ title     │     │ user_id   │
│ role      │     │ content   │     │ content   │
│ avatar_url│     │ category  │     │ parent_id │
│ created_at│     │ created_at│     │ created_at│
└───────────┘     │ updated_at│     │ likes_cnt │
                  │ likes_cnt │     └───────────┘
                  │ cmts_cnt  │           ▲
                  │ image_url │           │
                  └───────────┘           │
                        ▲                 │
                        │                 │
                  ┌───────────┐     ┌───────────┐
                  │   Likes   │     │ Teacher   │
                  ├───────────┤     │   Codes   │
                  │ id (PK)   │     ├───────────┤
                  │ user_id   │     │ code (PK) │
                  │ post_id   ├─────┤ is_used   │
                  │ comment_id│     │ created_at│
                  │ created_at│     └───────────┘
                  └───────────┘
```

## Entity Relationships

### Users
- **Primary Key**: id (UUID)
- **Attributes**:
  - email: User's email address (text, not null)
  - username: User's display name (text, not null)
  - role: User's role (user_role enum: 'student', 'teacher', 'admin')
  - avatar_url: URL to user's profile picture (text, nullable)
  - created_at: Timestamp when user was created

### Posts
- **Primary Key**: id (UUID)
- **Foreign Keys**:
  - user_id: References Users(id)
- **Attributes**:
  - title: Post title (text, not null)
  - content: Post content (text, not null)
  - category: Post category (post_category enum: 'question', 'announcement', 'discussion', 'resource')
  - created_at: Timestamp when post was created
  - updated_at: Timestamp when post was last updated
  - likes_count: Count of likes on the post (integer, default 0)
  - comments_count: Count of comments on the post (integer, default 0)
  - image_url: URL to attached image (text, nullable)

### Comments
- **Primary Key**: id (UUID)
- **Foreign Keys**:
  - user_id: References Users(id)
  - post_id: References Posts(id)
  - parent_id: Self-referential for nested comments, references Comments(id)
- **Attributes**:
  - content: Comment content (text, not null)
  - created_at: Timestamp when comment was created
  - likes_count: Count of likes on the comment (integer, default 0)

### Likes
- **Primary Key**: id (UUID)
- **Foreign Keys**:
  - user_id: References Users(id)
  - post_id: References Posts(id) (nullable for comment likes)
  - comment_id: References Comments(id) (nullable for post likes)
- **Attributes**:
  - created_at: Timestamp when like was created

### Teacher Codes
- **Primary Key**: code (text)
- **Attributes**:
  - is_used: Whether code has been used (boolean, default false)
  - created_at: Timestamp when code was created

## Key Relationships

1. **User-Post Relationship**:
   - One-to-Many: One user can create many posts
   - Represented by user_id foreign key in Posts table

2. **User-Comment Relationship**:
   - One-to-Many: One user can create many comments
   - Represented by user_id foreign key in Comments table

3. **Post-Comment Relationship**:
   - One-to-Many: One post can have many comments
   - Represented by post_id foreign key in Comments table

4. **Comment-Comment Relationship (Nesting)**:
   - One-to-Many: One comment can have many replies
   - Represented by parent_id self-referential foreign key

5. **User-Like Relationship**:
   - One-to-Many: One user can create many likes
   - Represented by user_id foreign key in Likes table

6. **Post-Like Relationship**:
   - One-to-Many: One post can have many likes
   - Represented by post_id foreign key in Likes table

7. **Comment-Like Relationship**:
   - One-to-Many: One comment can have many likes
   - Represented by comment_id foreign key in Likes table

This ER diagram represents the database schema for the educational forum application. The schema is designed to support all required functionality, including nested comments, post and comment likes, and different user roles.
