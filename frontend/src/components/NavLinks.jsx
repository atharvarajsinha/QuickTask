import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

export const navLinks = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <ChartBarIcon className="w-5 h-5" />,
  },
  {
    to: "/tasks",
    label: "Tasks",
    icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
  },
  {
    to: "/categories",
    label: "Categories",
    icon: <TagIcon className="w-5 h-5" />,
  },
  {
    to: "/profile",
    label: "Profile",
    icon: <UserCircleIcon className="w-5 h-5" />,
  },
];