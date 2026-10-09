export type UserRole = "brand" | "creator";

export interface AppUser {
  uid: string;
  email: string;
  name: string;
  handle: string;
  role: UserRole;
}
