
# Educational Forum Application

Welcome to the Educational Forum Application! This project is a web-based forum designed for educational environments, allowing students and teachers to interact through posts, comments, and various engagement features.

## Project Overview

This forum application is built with:
- Vite
- TypeScript
- React
- Supabase (for backend services)
- shadcn-ui
- Tailwind CSS

## Key Features

- **User Authentication**: Login, registration with role-based access (student, teacher, admin)
- **Forum Posts**: Create, view, edit, and delete posts with various categories
- **Comments**: Nested comment structure for discussions
- **Post Likes**: Engage with content through likes
- **User Profiles**: Personalized user profiles with avatars
- **Image Uploads**: Support for uploading images in posts and profiles
- **Responsive Design**: Mobile-friendly interface

## Getting Started

### Prerequisites
- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account for backend services

### Local Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start the development server
npm run dev
```

## Documentation

This project has several documentation files to help you understand its architecture:

- [Data Flow Diagram (DFD)](./README_DFD.md) - Visualizes how data flows through the application
- [Entity-Relationship (ER) Diagram](./README_ER.md) - Illustrates the database structure
- [Database Setup](./README_DATABASE.md) - Details the Supabase database configuration
- [Function Flow](./README_FUNCTIONS.md) - Lists key functions and their interactions

## Project Structure

```
src/
├── components/               # Reusable UI components
│   ├── forum/                # Forum-specific components
│   ├── layout/               # Layout components
│   ├── profile/              # User profile components
│   ├── theme/                # Theme components
│   └── ui/                   # UI components (shadcn)
├── contexts/                 # React contexts
│   └── AuthContext.tsx       # Authentication context
├── hooks/                    # Custom React hooks
├── integrations/             
│   └── supabase/             # Supabase integration
├── lib/                      # Utility functions
│   └── supabaseClient.ts     # Supabase client functions
├── pages/                    # Application pages
│   ├── Forum.tsx             # Forum listing page
│   ├── Index.tsx             # Landing page
│   ├── Login.tsx             # Login page
│   ├── PostDetail.tsx        # Individual post page
│   ├── Profile.tsx           # User profile page
│   └── Register.tsx          # Registration page
├── styles/                   # CSS stylesheets
│   └── globals.css           # Global styles
├── types/                    # TypeScript type definitions
│   └── forum.ts              # Forum-related types
├── App.tsx                   # Main application component
└── main.tsx                  # Application entry point
```

## Deployment

The application can be deployed using various hosting platforms that support Vite applications. Make sure to set up the appropriate environment variables for your Supabase project.

## Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
