# Project: Personal Web Blog

## Overview
This is a personal web blog application.
- **Frontend:** React
- **Backend/Database:** Firebase Firestore
- **Hosting:** Firebase Hosting

## Tech Stack & Conventions
- **Language:** TypeScript / JavaScript
- **Styling:** Tailwind CSS
- **State Management:** React Context / Zustand (or adapt as needed)

## Development Workflows
- **Install dependencies:** `npm install`
- **Run local development server:** `npm run dev` (or `npm start` depending on setup)
- **Build for production:** `npm run build`
- **Deploy:** `firebase deploy`

## Firestore Database Structure
- **Collection `posts`:**
  - `id`: string
  - `title`: string
  - `content`: string (Markdown/HTML)
  - `author`: string
  - `createdAt`: timestamp
  - `tags`: string[]
  - `published`: boolean

- **Collection `users`** *(for blog author authentication)*:
  - `id`: string
  - `displayName`: string
  - `role`: string

## Gemini Agent Instructions
- **Styling:** Strictly use **Tailwind CSS** for styling components. Avoid writing custom CSS unless absolutely necessary.
- **Components:** Create reusable, functional React components.
- **Database:** Prioritize using Firebase Web SDK best practices for Firestore queries and pagination.
- **Security:** Ensure Firestore security rules are considered when designing data models, keeping writes restricted to authenticated authors and reads open to the public for published posts.
