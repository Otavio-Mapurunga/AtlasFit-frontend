"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { useApp } from "@/context/app-context";

export default function CreateAccountPage() {
  const router = useRouter();
  const { setUser, setOnboardingStep } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      // 💡 QUANDO A API DE AUTH ESTIVER PRONTA:
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/cadastro`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
      // });
      // if (!res.ok) throw new Error("Erro ao criar conta. Email já cadastrado?");
      // const data = await res.json();

      // Simulação de delay de rede da API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Alimentando o estado global do contexto com o novo usuário
      setUser({
        id: "522a1f07-9408-4f3f-b90c-783862846f3e", // Alinha com o ID temporário do contexto
        name: formData.name,
        email: formData.email,
        height: 0,
        weight: 0,
        age: 0,
        goal: "hipertrofia",
        experienceLevel: "iniciante",
      });

      setOnboardingStep("anamnese");
      router.push("/onboarding/anamnese");
    } catch (err: any) {
      setError(err.message || "Erro ao conectar com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold text-primary">PROGRESS</span>
            <span className="text-2xl font-light text-foreground">FIT</span>
          </Link>
          <CardTitle className="text-xl text-foreground">Criar Conta</CardTitle>
          <CardDescription className="text-muted-foreground">
            Crie sua conta para começar a treinar de forma inteligente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                {error}
              </div>
            )}

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  disabled={isLoading}
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
                  placeholder="seu@email.com"
                  disabled={isLoading}
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
                  placeholder="Mínimo 6 caracteres"
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-input border-border text-foreground"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirmar Senha</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme sua senha"
                  disabled={isLoading}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="bg-input border-border text-foreground"
                />
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/entrar" className="text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
