import type { Category } from "./creator";

export interface WorkflowStep {
  title: string;
  detail: string;
  tool?: string;
}

export interface PortfolioItem {
  id: string;
  creatorId: string;
  title: string;
  category: Category;
  prompt: string;
  tools: string[];
  artIndex: number;
  commercialUse: boolean;
  workflow: WorkflowStep[];
  createdAt: string;
}
