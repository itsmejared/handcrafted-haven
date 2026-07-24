// Shared model interfaces representing our PostgreSQL database schema

export interface User {
  id: string; // UUID format
  email: string;
  password_hash: string;
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
  id: string; // UUID format
  title: string;
  description: string;
  price: number; // Mapped from DECIMAL
  image_url: string;
  image_alt: string;
  seller_id: string;
  category_id: number;
  created_at: string;
}

// Product joined with seller and category names, used wherever a product
// listing needs to display "by <seller>" / "<category>" without a second
// round trip (e.g. search results, product grids).
export interface ProductWithDetails extends Product {
  seller_name: string;
  category_name: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number; // Enforced 1 to 5
  comment?: string | null;
  created_at: string;
}