export interface BlogArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  author_id: string;
  featured: boolean;
  published: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'author';
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  id: string;
  email: string;
  role: 'admin' | 'author';
}
