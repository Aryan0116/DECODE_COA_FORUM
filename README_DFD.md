
# Data Flow Diagram (DFD) for Forum Application

## Overview
This document presents the Data Flow Diagram for the educational forum application, illustrating how data moves through the system and between different components.

## User Authentication Flow
```
┌───────────┐     ┌───────────┐     ┌───────────┐
│           │     │           │     │           │
│   User    ├────►│  Auth UI  ├────►│  Supabase │
│           │     │           │     │   Auth    │
│           │◄────┤           │◄────┤           │
└───────────┘     └───────────┘     └───────────┘
                       │                  │
                       ▼                  ▼
                  ┌───────────┐     ┌───────────┐
                  │           │     │           │
                  │  AuthCtx  │     │  Database │
                  │           │     │           │
                  └───────────┘     └───────────┘
```

## Forum Posting Flow
```
┌───────────┐     ┌───────────┐     ┌───────────┐
│           │     │           │     │           │
│   User    ├────►│ Forum UI  ├────►│ Supabase  │
│           │     │           │     │   Client  │
│           │◄────┤           │◄────┤           │
└───────────┘     └───────────┘     └───────────┘
                                         │
                                         ▼
                                    ┌───────────┐
                                    │           │
                                    │  Database │
                                    │           │
                                    └───────────┘
```

## Post Detail and Comments Flow
```
┌───────────┐     ┌───────────┐     ┌───────────┐
│           │     │           │     │           │
│   User    ├────►│ Post UI   ├────►│ Supabase  │
│           │     │           │     │   Client  │
│           │◄────┤           │◄────┤           │
└───────────┘     └───────────┘     └───────────┘
                       │                  │
                       ▼                  ▼
                  ┌───────────┐     ┌───────────┐
                  │  Comment  │     │           │
                  │    UI     │     │  Database │
                  │           │     │           │
                  └───────────┘     └───────────┘
```

## User Profile Flow
```
┌───────────┐     ┌───────────┐     ┌───────────┐
│           │     │           │     │           │
│   User    ├────►│ Profile UI├────►│ Supabase  │
│           │     │           │     │   Client  │
│           │◄────┤           │◄────┤           │
└───────────┘     └───────────┘     └───────────┘
                                         │
                                         ▼
                                    ┌───────────┐
                                    │           │
                                    │  Database │
                                    │  Storage  │
                                    │           │
                                    └───────────┘
```

## Main Data Flows

1. **Authentication Flow**:
   - User inputs credentials → Auth UI → Supabase Auth
   - Supabase Auth → Auth Context → Application (authorize access)

2. **Post Creation Flow**:
   - User creates post → Forum UI → Supabase Client
   - Optional: User uploads image → Forum UI → Supabase Storage
   - Supabase Client → Database (store post data)

3. **Post Interaction Flow**:
   - User views posts → Forum UI → Supabase Client → Database (fetch posts)
   - User likes post → Post UI → Supabase Client → Database (store like)
   - User comments → Comment UI → Supabase Client → Database (store comment)

4. **Profile Management Flow**:
   - User updates profile → Profile UI → Supabase Client
   - Optional: User uploads avatar → Profile UI → Supabase Storage
   - Supabase Client → Database (store profile data)

This DFD provides a high-level overview of how data moves through the application. The actual implementation may involve additional complexities, especially regarding error handling, data validation, and optimistic UI updates.
