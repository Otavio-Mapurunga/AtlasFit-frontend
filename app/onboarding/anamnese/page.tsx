"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { ArrowRight, User } from "lucide-react";

const goals = [
  { value: "hipertrofia", label: "Hipertrofia", color: "bg-primary" },
  { value: "emagrecimento", label: "Emagrecimento", color: "bg-blue-500" },
  { value: "forca", label: "Força", color: "bg-orange-500" },
  { value: "resistencia", label: "Resistência", color: "bg-cyan-500" },
];

export default function AnamnasePage() {
  const router = useRouter();
  const { user, setUser, setOnboardingStep } = useApp();
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    age: "",
    goal: "hipertrofia",
    experienceLevel: "iniciante",
    trainingFrequency: "3",
  });
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["hipertrofia"]);
  const [error, setError] = useState("");

  const handleGoalToggle = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
    setFormData((prev) => ({ ...prev, goal }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.height || !formData.weight || !formData.age) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (user) {
      setUser({
        ...user,
        height: Number(formData.height),
        weight: Number(formData.weight),
        age: Number(formData.age),
        goal: formData.goal as "hipertrofia" | "emagrecimento" | "forca" | "resistencia",
        experienceLevel: formData.experienceLevel as "iniciante" | "intermediario" | "avancado",
        trainingFrequency: Number(formData.trainingFrequency),
      });
    }

    setOnboardingStep("limitacoes");
    router.push("/onboarding/limitacoes");
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-card border-border">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold text-primary">PROGRESS</span>
            <span className="text-2xl font-light text-foreground">FIT</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl text-foreground">Seus Dados Físicos</CardTitle>
          <CardDescription className="text-muted-foreground">
            Informe seus dados para gerarmos um treino personalizado
          </CardDescription>
          <div className="flex justify-center gap-2 pt-4">
            <div className="w-8 h-1 rounded-full bg-primary" />
            <div className="w-8 h-1 rounded-full bg-border" />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel htmlFor="height">Altura (cm)</FieldLabel>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
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
                  type="number"
                  placeholder="70"
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
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="bg-input border-border text-foreground"
                />
              </Field>
            </div>

            <div>
              <FieldLabel className="mb-3 block">Objetivo Principal</FieldLabel>
              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal) => (
                  <label
                    key={goal.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedGoals.includes(goal.value)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={selectedGoals.includes(goal.value)}
                      onCheckedChange={() => handleGoalToggle(goal.value)}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className={`w-3 h-3 rounded-full ${goal.color}`} />
                    <span className="text-sm text-foreground">{goal.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <FieldGroup>
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
                    <SelectItem value="iniciante">Iniciante (menos de 6 meses)</SelectItem>
                    <SelectItem value="intermediario">Intermediário (6 meses - 2 anos)</SelectItem>
                    <SelectItem value="avancado">Avançado (mais de 2 anos)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Frequência de Treino (dias/semana)</FieldLabel>
                <Select
                  value={formData.trainingFrequency}
                  onValueChange={(value) =>
                    setFormData({ ...formData, trainingFrequency: value })
                  }
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="2">2 dias por semana</SelectItem>
                    <SelectItem value="3">3 dias por semana</SelectItem>
                    <SelectItem value="4">4 dias por semana</SelectItem>
                    <SelectItem value="5">5 dias por semana</SelectItem>
                    <SelectItem value="6">6 dias por semana</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Próximo
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
