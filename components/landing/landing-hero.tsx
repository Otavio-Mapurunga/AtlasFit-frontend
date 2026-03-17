"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-wider text-muted-foreground">
                TREINE DE FORMA INTELIGENTE
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-primary">SAÚDE E</span>
                <br />
                <span className="text-primary">PROGRESSO</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Treinos personalizados, evolução de cargas, e acompanhamento
                completo.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
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
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-17%20at%2013.36.07-fI5rIVg9XUim2neC7n6jOp5mZr8Y2S.jpeg"
                alt="Grupo de pessoas treinando na academia"
                width={600}
                height={400}
                className="object-cover rounded-2xl"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
