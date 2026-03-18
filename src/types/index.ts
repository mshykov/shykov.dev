export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  // Firebase Timestamps provide a `toDate()` method; allow a minimal shape here instead of `any`
  createdAt?: { toDate?: () => Date } | string | number | null;
  tags: string[];
  published: boolean;
}

export interface User {
  id: string;
  displayName: string;
  role: string;
}
