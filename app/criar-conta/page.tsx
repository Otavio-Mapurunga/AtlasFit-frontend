"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from "@/context/app-context";

const goals = [
  { value: "hipertrofia", label: "Hipertrofia", color: "bg-primary" },
  { value: "emagrecimento", label: "Emagrecimento", color: "bg-blue-500" },
  { value: "forca", label: "Força", color: "bg-orange-500" },
  { value: "resistencia", label: "Resistência", color: "bg-purple-500" },
];

export default function CreateAccountPage() {
  const router = useRouter();
  const { setUser } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    height: "",
    weight: "",
    age: "",
    goal: "hipertrofia",
    experienceLevel: "iniciante",
  });
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["hipertrofia"]);

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
    setFormData((prev) => ({ ...prev, goal }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setUser({
      id: "1",
      name: formData.name || "Usuário",
      email: formData.email,
      height: Number(formData.height) || 175,
      weight: Number(formData.weight) || 70,
      age: Number(formData.age) || 25,
      goal: formData.goal as "hipertrofia" | "emagrecimento" | "forca" | "resistencia",
      experienceLevel: formData.experienceLevel as
        | "iniciante"
        | "intermediario"
        | "avancado",
    });

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-[250px_1fr] gap-6">
        {/* Sidebar */}
        <Card className="bg-card border-border hidden lg:block">
          <CardContent className="p-4 space-y-1">
            <Link href="/" className="flex items-center gap-2 mb-6 px-2">
              <span className="text-lg font-bold text-primary">PROGRESS</span>
              <span className="text-lg font-light text-foreground">FIT</span>
            </Link>
            <nav className="space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Início
              </Link>
              <Link
                href="#sobre"
                className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Sobre
              </Link>
              <Link
                href="/entrar"
                className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Entrar
              </Link>
            </nav>
            <div className="pt-4">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
                Criar Conta
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-foreground">Meu Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-input border-border text-foreground"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="luis@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-input border-border text-foreground"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="bg-input border-border text-foreground"
                  />
                </Field>
              </FieldGroup>

              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="height">Altura (cm)</FieldLabel>
                  <Input
                    id="height"
                    placeholder="175 cm"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: e.target.value })
                    }
                    className="bg-input border-border text-foreground"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="weight">Peso (kg)</FieldLabel>
                  <Input
                    id="weight"
                    placeholder="70 kg"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    className="bg-input border-border text-foreground"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="age">Idade</FieldLabel>
                  <Input
                    id="age"
                    placeholder="22"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="bg-input border-border text-foreground"
                  />
                </Field>
              </div>

              <div>
                <FieldLabel className="mb-3 block">Objetivo</FieldLabel>
                <div className="flex flex-wrap gap-4">
                  {goals.map((goal) => (
                    <label
                      key={goal.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedGoals.includes(goal.value)}
                        onCheckedChange={() => handleGoalToggle(goal.value)}
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span
                        className={`w-3 h-3 rounded-full ${goal.color}`}
                      />
                      <span className="text-sm text-foreground">
                        {goal.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Nível de Experiência</FieldLabel>
                  <Select
                    value={formData.experienceLevel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, experienceLevel: value })
                    }
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="iniciante">Iniciante</SelectItem>
                      <SelectItem value="intermediario">Intermediário</SelectItem>
                      <SelectItem value="avancado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Experiência</FieldLabel>
                  <Select defaultValue="6meses">
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="iniciante">Menos de 6 meses</SelectItem>
                      <SelectItem value="6meses">6 meses - 1 ano</SelectItem>
                      <SelectItem value="1ano">1 - 2 anos</SelectItem>
                      <SelectItem value="2anos">Mais de 2 anos</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Criar Conta
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
