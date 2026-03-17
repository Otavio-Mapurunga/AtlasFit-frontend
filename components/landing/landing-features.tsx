"use client";

import { ClipboardList, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: ClipboardList,
    title: "Treinos Personalizados",
    description: "Treinos criados com IA baseados nos seus objetivos e nível",
  },
  {
    icon: TrendingUp,
    title: "Evolução Automática",
    description: "Progressão de cargas inteligente para resultados contínuos",
  },
  {
    icon: BarChart3,
    title: "Acompanhamento de Progresso",
    description: "Visualize sua evolução com gráficos e métricas detalhadas",
  },
];

export function LandingFeatures() {
  return (
    <section className="py-16 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-secondary">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
