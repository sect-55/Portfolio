export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tech: string[];
  github?: string;
  live?: string;
  featured: boolean;
  year: number;
  category: "platform" | "backend" | "frontend" | "devtools" | "other" | "web3";
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: number;
  tags: string[];
  published: boolean;
}

export interface Skill {
  name: string;
  level: number; // 0–100
  category: "language" | "framework" | "platform" | "tool" | "cloud";
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
  tech: string[];
  current?: boolean;
  statusLabel?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
