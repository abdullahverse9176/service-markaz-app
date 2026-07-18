// ─── Business ──────────────────────────────────────────────────────────────

export type BusinessStatus = 'pending' | 'active' | 'blocked';
export type Availability = 'Available' | 'Unavailable';

export interface Pricing {
  calloutFee: string;
  hourlyRate: string;
  minCharge: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  website: string;
  linkedin: string;
  tiktok: string;
}

export interface GeoLocation {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface Business {
  _id: string;
  id?: string;
  owner: string | { _id: string; name: string; phone: string };
  // Contact
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  // Details
  title: string;
  category: string;
  city: string;
  area: string;
  about: string;
  // Expertise
  services: string[];
  experience: number;
  completedProjects: number;
  specializations: string[];
  serviceAreas: string[];
  // Location
  location?: GeoLocation;
  distanceKm?: number | null;
  // Pricing & availability
  pricing: Pricing;
  availability: Availability;
  responseTime: string;
  // Social
  socialLinks: SocialLinks;
  // Images
  profileImage: string;
  bannerImage: string;
  // Admin
  status: BusinessStatus;
  rating: number;
  reviewsCount: number;
  verification: boolean;
  featured: boolean;
  // Analytics
  viewCount: number;
  weeklyViews: number;
  monthlyViews: number;
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ─── Review ────────────────────────────────────────────────────────────────

export interface Review {
  _id: string;
  business: string;
  user: string | { _id: string; name: string };
  rating: number;
  comment: string;
  status: 'published' | 'flagged';
  createdAt: string;
}

// ─── Category & City ───────────────────────────────────────────────────────

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface City {
  _id: string;
  name: string;
  slug: string;
}
