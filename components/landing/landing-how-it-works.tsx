"use client";

const steps = [
  {
    number: 1,
    title: "Crie sua conta",
    description: "Cadastre-se gratuitamente em poucos segundos",
  },
  {
    number: 2,
    title: "Informe seus dados físicos",
    description: "Preencha sua anamnese com seus objetivos",
  },
  {
    number: 3,
    title: "Receba seu treino personalizado",
    description: "A IA cria o treino perfeito para você",
  },
];

export function LandingHowItWorks() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
          Como Funciona
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                {step.number}
              </div>
              <div>
                <h3 className="font-medium text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground hidden md:block">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block w-16 h-px bg-border ml-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
