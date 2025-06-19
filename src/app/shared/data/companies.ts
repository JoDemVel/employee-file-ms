import { Command, GalleryVerticalEnd } from "lucide-react";

export interface Company {
  name: string;
  subname: string;
  logo: React.ElementType;
}

export const companies: Company[] = [
  {
    name: "TECHOBOL",
    subname: "S.R.L.",
    logo: GalleryVerticalEnd,
  },
  {
    name: "Megadis",
    subname: "S.A.",
    logo: Command,
  }
];