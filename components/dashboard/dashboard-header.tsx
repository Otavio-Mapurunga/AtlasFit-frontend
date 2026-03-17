"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/app-context";

export function DashboardHeader() {
  const { user, logout } = useApp();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-medium text-foreground">
          Olá, {user?.name || "Usuário"}{" "}
          <span className="text-xl">&#128075;</span>
        </h1>
        <span className="text-sm text-muted-foreground">
          Objetivo: {user?.goal === "hipertrofia" ? "Hipertrofia" : user?.goal} • 5
          treinos/semana
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/dashboard/perfil" className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt={user?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-foreground">{user?.name}</span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground"
        >
          Sair
        </Button>
      </div>
    </header>
  );
}
