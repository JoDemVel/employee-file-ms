import { SidebarItemsTexts } from "@/constants/localize";
import { Building, UsersRound, type LucideIcon } from "lucide-react";

export interface SidebarGroupItem {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: {
    title: string;
    url: string;
  }[];
}

export interface SidebarItem {
  name: string;
  url: string;
  icon: LucideIcon;
};

export const sidebarItems: SidebarItem[] = [
  {
    name: SidebarItemsTexts.departments.title,
    icon: Building,
    url: "/departments"
  }
];

export const sidebarGroupItems: SidebarGroupItem[] = [
  {
    title: SidebarItemsTexts.employees.title,
    icon: UsersRound,
    url: "/employees",
    items: [
      { title: SidebarItemsTexts.employees.list, url: "/employees/list" },
      { title: SidebarItemsTexts.employees.memos, url: "/employees/memos" }
    ]
  }
];