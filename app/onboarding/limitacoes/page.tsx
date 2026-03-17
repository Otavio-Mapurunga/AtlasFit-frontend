"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from "@/context/app-context";
import { AlertTriangle, Sparkles } from "lucide-react";

const commonLimitations = [
  { id: "joelho", label: "Problemas no joelho" },
  { id: "ombro", label: "Lesão no ombro" },
  { id: "coluna", label: "Problemas na coluna" },
  { id: "punho", label: "Dor no punho" },
  { id: "tornozelo", label: "Lesão no tornozelo" },
  { id: "quadril", label: "Problemas no quadril" },
];

const equipmentOptions = [
  { id: "academia", label: "Academia completa" },
  { id: "home", label: "Home gym básico" },
  { id: "halteres", label: "Apenas halteres" },
  { id: "corpo", label: "Peso corporal" },
];

export default function LimitacoesPage() {
  const router = useRouter();
  const { user, setUser, setOnboardingStep } = useApp();
  const [selectedLimitations, setSelectedLimitations] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(["academia"]);
  const [customLimitations, setCustomLimitations] = useState("");
  const [preferences, setPreferences] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleLimitationToggle = (id: string) => {
    setSelectedLimitations((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const handleEquipmentToggle = (id: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulando geração do treino pela IA
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (user) {
      setUser({
        ...user,
        limitations: [
          ...selectedLimitations.map(
            (id) => commonLimitations.find((l) => l.id === id)?.label || ""
          ),
          ...(customLimitations ? [customLimitations] : []),
        ],
        equipment: selectedEquipment,
        preferences: preferences,
      });
    }

    setOnboardingStep("complete");
    router.push("/dashboard");
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
              <AlertTriangle className="w-5 h-5 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl text-foreground">Limitações e Preferências</CardTitle>
          <CardDescription className="text-muted-foreground">
            Informe suas limitações físicas e preferências para a IA gerar seu treino ideal
          </CardDescription>
          <div className="flex justify-center gap-2 pt-4">
            <div className="w-8 h-1 rounded-full bg-primary" />
            <div className="w-8 h-1 rounded-full bg-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <FieldLabel className="mb-3 block">Limitações Físicas (opcional)</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {commonLimitations.map((limitation) => (
                  <label
                    key={limitation.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedLimitations.includes(limitation.id)
                        ? "border-destructive/50 bg-destructive/10"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    <Checkbox
                      checked={selectedLimitations.includes(limitation.id)}
                      onCheckedChange={() => handleLimitationToggle(limitation.id)}
                      className="border-border data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
                    />
                    <span className="text-sm text-foreground">{limitation.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Field>
              <FieldLabel htmlFor="customLimitations">
                Outras limitações ou condições médicas
              </FieldLabel>
              <Textarea
                id="customLimitations"
                placeholder="Ex: Tendinite no cotovelo direito, evitar exercícios com impacto..."
                value={customLimitations}
                onChange={(e) => setCustomLimitations(e.target.value)}
                className="bg-input border-border text-foreground min-h-[80px] resize-none"
              />
            </Field>

            <div>
              <FieldLabel className="mb-3 block">Equipamentos Disponíveis</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {equipmentOptions.map((equipment) => (
                  <label
                    key={equipment.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedEquipment.includes(equipment.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={selectedEquipment.includes(equipment.id)}
                      onCheckedChange={() => handleEquipmentToggle(equipment.id)}
                      className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <span className="text-sm text-foreground">{equipment.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="preferences">
                  Preferências e observações para o treino
                </FieldLabel>
                <Textarea
                  id="preferences"
                  placeholder="Ex: Prefiro treinos mais curtos, gosto de exercícios compostos, quero focar mais em pernas..."
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="bg-input border-border text-foreground min-h-[100px] resize-none"
                />
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  Gerando seu treino personalizado...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar Treino com IA
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              A IA irá considerar todas as informações fornecidas para criar um treino seguro e eficiente para você.
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
