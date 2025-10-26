# StackOverflow Clone with Appwrite

A modern, full-stack Q&A platform inspired by Stack Overflow, built with Next.js 15, Appwrite, and TypeScript. This application provides a seamless developer experience for asking questions, sharing knowledge, and building a community.

## ✨ Features

- 🔐 **User Authentication** - Secure sign-up and login with Appwrite Auth
- ❓ **Ask Questions** - Post questions with rich text formatting
- 💬 **Answer & Comment** - Engage with the community through answers and comments
- ⬆️ **Voting System** - Upvote/downvote questions and answers
- 🏷️ **Tags & Categories** - Organize questions with tags for easy discovery
- 🔍 **Search & Filter** - Powerful search functionality to find relevant questions
- 👤 **User Profiles** - View user activity, reputation, and contributions
- 📊 **Reputation System** - Earn reputation points for helpful contributions
- 🎨 **Modern UI/UX** - Clean, responsive design with Tailwind CSS
- ⚡ **Real-time Updates** - Instant updates powered by Appwrite

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Backend:** Appwrite (BaaS)
- **Styling:** Tailwind CSS
- **Font:** Geist Font Family (optimized with next/font)
- **Deployment:** Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun
- An Appwrite account ([Sign up here](https://cloud.appwrite.io/))

## 📁 Project Structure

```
stackoverflow-appwrite/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
│   ├── appwrite.ts       # Appwrite client setup
│   └── utils.ts          # Helper functions
├── public/               # Static assets
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## 🎯 Key Features Explained

### Authentication Flow

- Users can sign up with email/password or OAuth providers
- Session management handled by Appwrite
- Protected routes for authenticated users

### Question & Answer System

- Create questions with rich text editor
- Add tags for better categorization
- Accept answers to mark them as solutions
- Vote on questions and answers

### Reputation System

- Earn points for helpful contributions
- Upvotes on your questions/answers increase reputation
- Accepted answers provide bonus points
