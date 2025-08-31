"use client";

import { Folder, Share2, ShieldIcon, User } from "lucide-react";
import Link from "next/link";

const cards = [
  {
    title: "My Vault",
    desc: "Manage and view your vault.",
    href: "/vault",
    icon: ShieldIcon,
    bg: "bg-gradient-to-br from-pink-500 to-rose-600",
  },
  {
    title: "Profile",
    desc: "View and edit your profile settings.",
    href: "/profile",
    icon: User,
    bg: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
  {
    title: "Projects",
    desc: "Manage and view your projects.",
    href: "/project",
    icon: Folder,
    bg: "bg-gradient-to-br from-blue-500 to-indigo-600",
  },
  {
    title: "Sharing",
    desc: "Manage shared resources and access.",
    href: "/sharing",
    icon: Share2,
    bg: "bg-gradient-to-br from-pink-500 to-rose-600",
  },
];

export default function HomePage() {
  return (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Link key={card.title} href={card.href}>
          <div className="cursor-pointer rounded-2xl bg-white shadow hover:shadow-xl transition group h-48 flex flex-col p-6">
            {/* Icon block with gradient bg */}
            <div
              className={`${card.bg} w-12 h-12 flex items-center justify-center rounded-xl text-white mb-4 group-hover:scale-110 transition`}
            >
              <card.icon size={24} />
            </div>

            {/* Title + description */}
            <h2 className="text-lg font-semibold mb-2">{card.title}</h2>
            <p className="text-gray-600 text-sm">{card.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
