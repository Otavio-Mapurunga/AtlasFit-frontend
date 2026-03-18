# Progress Fit (AtlasFit Frontend)

Aplicação web em Next.js que entrega uma experiência completa de treino personalizado: landing page de marketing, fluxo de onboarding (criar conta, anamnese, limitações) e dashboard com treinos, progresso e métricas — atualmente alimentados por dados mockados em contexto React, prontos para conectar a APIs reais.

## Tecnologias utilizadas
- Next.js 16 (App Router) + React 19
- TypeScript (modo `strict`) com aliases `@/*`
- Tailwind CSS 4 + tw-animate-css (tokens em `app/globals.css`)
- shadcn/ui + Radix UI (componentes em `components/ui`)
- Recharts para gráficos
- Vercel Analytics
- Gerenciador: pnpm (lock incluso), mas scripts funcionam com npm/yarn

## Como rodar (setup)
Pré-requisitos: Node 18+ (recomendado 20) e pnpm (`npm i -g pnpm`) ou npm.

1) Instalar dependências  
```bash
pnpm install
# ou: npm install
```

2) Rodar em desenvolvimento  
```bash
pnpm dev
# ou: npm run dev
```
Abra http://localhost:3000.

3) Scripts úteis  
- `pnpm build` – build de produção  
- `pnpm start` – serve build  
- `pnpm lint` – ESLint

Variáveis de ambiente (crie `.env.local` se for integrar backend):
```
NEXT_PUBLIC_API_URL=https://sua-api.com
```

## Estrutura de pastas (resumo)
```
app/
  layout.tsx           # Layout raiz, fonte Inter, AppProvider, Analytics
  globals.css          # Tokens de cor/tema e base Tailwind
  page.tsx             # Landing page
  entrar/page.tsx      # Login
  criar-conta/page.tsx # Cadastro inicial
  onboarding/          # Anamnese e limitações
  dashboard/           # Overview, meu-treino, evolucao, perfil
components/
  landing/             # Seções da landing
  dashboard/           # Sidebar, header, cards de treino/progresso
  ui/                  # Kit shadcn/radix (inputs, dialogs, sidebar, etc.)
  theme-provider.tsx   # Wrapper next-themes (pronto para uso)
context/
  app-context.tsx      # Estado global, mocks e ações (login, treinos, progresso)
hooks/                 # use-toast, use-mobile
lib/utils.ts           # utilitário `cn`
styles/                # globals.css legado (não usado)
types/index.ts         # Tipagens compartilhadas (User, Workout, Progress...)
public/                # Ícones e placeholders
```

## Estado e dados mock
`context/app-context.tsx` fornece:
- `user`, `isAuthenticated`, `onboardingStep`
- `workouts`, `todayWorkout`, `exerciseProgress`, `weightHistory`, `completedWorkouts`
- ações: `login`, `logout`, `setUser`, `setWorkouts`, `markExerciseComplete`, `markWorkoutComplete`, `updateExerciseWeight`, `setOnboardingStep`

Hoje tudo é mockado; para produção, troque os mutadores por chamadas à sua API e persista tokens conforme necessário.

## Endpoints da API
Nenhum endpoint implementado no repositório. Sugestão para Next App Router:
- `app/api/auth/login/route.ts` – POST autenticação (retorna usuário + token)
- `app/api/workouts/route.ts` – GET/POST treinos
- `app/api/progress/route.ts` – GET progresso de exercícios/peso
- `app/api/profile/route.ts` – GET/PUT dados do usuário

No frontend, injete `NEXT_PUBLIC_API_URL` e adapte os métodos do `AppProvider` para consumir esses endpoints com `fetch`.

## Exemplos de uso
- Rodar local: `pnpm install && pnpm dev`
- Fluxo demo:
  1. `/criar-conta` → cria usuário e segue para `/onboarding/anamnese`
  2. `/onboarding/limitacoes` → coleta restrições/equipamentos e simula geração de treino
  3. `/dashboard` → cards de treino do dia, peso e progresso (Recharts)
  4. `/dashboard/meu-treino` → abrir um treino, editar cargas e salvar (usa `updateExerciseWeight`)
  5. `/dashboard/evolucao` e `/dashboard/perfil` → gráficos de evolução e dados do usuário

## Possíveis melhorias futuras
- **Autenticação real**: integrar `login/logout` a backend, tokens seguros e proteção de rotas.
- **Persistência**: substituir mocks por REST/GraphQL; cache com React Query ou SWR.
- **Geração de treino com IA**: conectar o botão de geração a um serviço de LLM.
- **Internacionalização**: i18n (pt/en) com `next-intl`.
- **Acessibilidade**: revisar contraste, labels e navegação por teclado.
- **Testes**: adicionar unit (Vitest/Testing Library) e E2E (Playwright).
- **CI/CD**: pipeline de lint + testes + build; deploy em Vercel/Netlify.
