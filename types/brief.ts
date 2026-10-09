import type { Category, Creator } from "./creator";

export type BriefStatus = "open" | "in_progress" | "done";

export interface Brief {
  id: string;
  ownerId: string;
  title: string;
  category: Category;
  budget: number;
  deadline: string;
  description: string;
  needsCommercialUse: boolean;
  status: BriefStatus;
  progress: number;
  hiredCreatorId?: string;
  preferredCreatorId?: string;
  createdAt: string;
}

export type BriefInput = Omit<Brief, "id" | "ownerId" | "status" | "progress" | "createdAt" | "hiredCreatorId">;

export interface MatchCheck {
  label: string;
  pass: boolean;
}

export interface Match {
  creator: Creator;
  score: number;
  checks: MatchCheck[];
}
