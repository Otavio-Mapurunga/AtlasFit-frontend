"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dumbbell, TrendingUp, Target } from "lucide-react";

export function LandingHero() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-wider text-muted-foreground">
              TREINE DE FORMA INTELIGENTE
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-primary">SAÚDE E</span>
              <br />
              <span className="text-primary">PROGRESSO</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Treinos personalizados, evolução de cargas, e acompanhamento
              completo.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/criar-conta">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                Criar Conta
              </Button>
            </Link>
            <Link href="/entrar">
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-secondary px-8"
              >
                Entrar
              </Button>
            </Link>
          </div>

          <div className="flex justify-center gap-8 pt-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Treinos com IA</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Evolução Automática</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Acompanhamento</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
