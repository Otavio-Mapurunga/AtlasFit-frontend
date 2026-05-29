"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { useApp } from "@/context/app-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha todos os campos");
      return;
    }

    setIsLoading(true);

    try {
      // O método login no context pode virar async futuramente para fazer o fetch real.
      // Como o fluxo atual é rápido, o await garante compatibilidade imediata.
      const success = await login(email, password);
      
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Email ou senha inválidos");
      }
    } catch (err) {
      setError("Erro ao autenticar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-bold text-primary">PROGRESS</span>
            <span className="text-2xl font-light text-foreground">FIT</span>
          </Link>
          <CardTitle className="text-xl text-foreground">Entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </Field>
            </FieldGroup>

            {error && (
              <p className="text-sm text-destructive text-center font-medium">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? "Autenticando..." : "Entrar"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                href="/criar-conta"
                className="text-primary hover:underline"
              >
                Criar conta
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
