export type Category = "Image" | "Video" | "Copy" | "Voice" | "3D" | "Automation";

export const CATEGORIES: Category[] = ["Image", "Video", "Copy", "Voice", "3D", "Automation"];

export interface Creator {
  id: string;
  name: string;
  handle: string;
  headline: string;
  bio: string;
  category: Category;
  tools: string[];
  verified: boolean;
  commercialUse: boolean;
  rating: number;
  jobs: number;
  startingRate: number;
  responseHours: number;
  location: string;
  score: number;
}

export type SortKey = "top" | "rating" | "price" | "fast";

export interface CreatorFilters {
  q: string;
  category: Category | "All";
  tools: string[];
  verifiedOnly: boolean;
  commercialOnly: boolean;
  sort: SortKey;
}
