"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Dumbbell, ClipboardList, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/meu-treino",
    label: "Meu Treino",
    icon: Dumbbell,
  },
  {
    href: "/dashboard/evolucao",
    label: "Evolução",
    icon: BarChart3,
  },










  
{
  href: "/dashboard/registrar-treino",
  label: "Registrar Treino",
  icon: ClipboardList,   // importa: import { ..., ClipboardList } from "lucide-react"
},








  
  
  {
    href: "/dashboard/perfil",
    label: "Perfil",
    icon: User,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">PROGRESS</span>
          <span className="text-xl font-light text-sidebar-foreground">FIT</span>
        </Link>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
