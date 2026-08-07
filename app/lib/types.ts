// Shared model interfaces representing our PostgreSQL database schema

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  role: "customer" | "seller";
  name: string;
  bio?: string | null;
  profile_image_url?: string | null;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  image_url: string;
  image_alt: string;
  description: string;
  created_at?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  image_alt: string;
  seller_id: string;
  category_id: number;
  created_at: string;
}

export interface ProductDetails extends Product {
  category_name: string;
  reviews_count: number;
  rating_average: number;
  seller_name: string;
  seller_bio: string;
  seller_image: string | null;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number; // Enforced 1 to 5
  comment?: string | null;
  created_at: string;
  reviewer_name: string;
}

export interface ProductReview {
  id?: string;
  product_id: string;
  product_title: string;
  product_image: string;
  category_name: string;
  seller_name: string;
  rating?: number | null;
  comment?: string | null;
  review_date?: string | null;
  has_reviewed: boolean;
}

export interface ServiceResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}
