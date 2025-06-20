import type { LucideIcon } from "lucide-react";

export interface SidebarGroupItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
}
