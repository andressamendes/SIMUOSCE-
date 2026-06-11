# SIMUOSCE — Documentação Técnica Oficial

**Versão:** 2.0 · **Data:** Junho 2026  
**Centro Acadêmico Sérgio Ferreira · Afya Faculdade de Ciências Médicas de Guanambi**

> Documento canônico do projeto. Para a especificação detalhada de design (tokens, componentes, estados e regras de consistência), consultar também o **`DESIGN_SYSTEM.md`** — este documento traz o resumo e as regras de negócio; o DESIGN_SYSTEM.md é a referência visual completa.

---

## Visão Geral

O **SIMUOSCE** é um Progressive Web App (PWA) mobile-first desenvolvido para suporte digital às avaliações práticas do OSCE (Objective Structured Clinical Examination). Substitui os baremas em papel, garantindo:

- Marcação ágil de critérios em tempo real
- Cronômetro proporcional à complexidade de cada estação
- Resumo automático de desempenho ao final de cada avaliação
- Funcionamento offline após a primeira visita

**Público-alvo:** Avaliadores (professores e preceptores) durante simulações clínicas.

---

## Arquitetura da Aplicação

### Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router, `output: 'export'`) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS v4 |
| Deploy | GitHub Pages via GitHub Actions |
| PWA | Service Worker + Web App Manifest |
| Fonte | Dancing Script (Google Fonts, via `next/font`) |

### Estrutura de Pastas

```
simuosce-app/
├── DOCUMENTACAO_PROJETO.md      # Este documento (arquitetura + regras de negócio)
├── DESIGN_SYSTEM.md             # Especificação completa de design
├── public/
│   ├── sw.js                    # Service worker (cache-first, offline)
│   ├── manifest.json            # PWA manifest
│   ├── favicon.ico
│   ├── logo-casf.jpg            # Logo do Centro Acadêmico
│   └── icons/
│       ├── icon-192.png
│       ├── icon-512.png
│       └── apple-touch-icon.png
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout — metadata, viewport, PWA tags
│   │   ├── globals.css          # Design tokens, gradientes, animações
│   │   ├── page.tsx             # Tela inicial — seleção de período
│   │   └── periodo/
│   │       └── [period]/
│   │           ├── page.tsx             # SSG: lista de estações
│   │           ├── PeriodClient.tsx     # UI da lista de estações
│   │           └── estacao/
│   │               └── [stationId]/
│   │                   ├── page.tsx             # SSG: tela de avaliação
│   │                   ├── AssessmentClient.tsx # UI de avaliação + timer
│   │                   └── SummaryScreen.tsx    # Tela de resumo
│   ├── components/
│   │   └── PWARegister.tsx      # Registro do service worker
│   ├── data/
│   │   └── baremas.ts           # Dados de todos os períodos/estações
│   ├── lib/
│   │   ├── themes.ts            # Design system por período
│   │   ├── format.ts            # Formatadores: nota e tempo
│   │   └── timer.ts             # Regra de duração por nº de critérios
│   └── types/
│       └── index.ts             # Tipos: Period, Station, Criterion
```

### Fluxo Oficial da Aplicação

```
Página Inicial (/)
   ↓ seleção de período
Período (/periodo/[1|2|3])
   ↓ seleção de estação
Estação → Avaliação (/periodo/[P]/estacao/[ID])
   ↓ botão "Concluir"
Resumo Final (estado local — SummaryScreen, mesma rota)
   ↓
"Nova Avaliação" (reinicia checklist + cronômetro na mesma estação)
   ou
"Voltar às Estações" (retorna à lista do período)
```

Observações:
- O Resumo Final **não é uma rota** — é um estado do `AssessmentClient` (`showSummary`), preservando a nota e os critérios marcados no momento da conclusão.
- "Nova Avaliação" zera critérios, timestamps e cronômetro (via `resetCount`), permitindo avaliar o próximo aluno na mesma estação sem navegar.

### Geração de Páginas (SSG)

Todas as páginas são geradas estaticamente no build via `generateStaticParams`. Não há servidor em runtime — tudo é HTML/JS/CSS estático servido pelo GitHub Pages.

---

## Tipos de Dados

```typescript
// src/types/index.ts

export type Period = 1 | 2 | 3;

export type Criterion = {
  id: string;        // Formato: "p{periodo}-e{estacao}-c{criterio}" ex: "p1-e1-c1"
  description: string;
  score: number;     // Pontuação individual. Todos os critérios de uma estação somam maxScore
};

export type Station = {
  id: string;        // Formato: "p{periodo}-e{estacao}" ex: "p1-e1"
  number: number;    // Número de exibição (1, 2, 3...)
  name: string;      // Nome da estação
  criteria: Criterion[];
  maxScore: number;  // Pontuação máxima total (soma de todos os criteria.score)
};
```

---

## Estrutura de Dados — Baremas

O arquivo `src/data/baremas.ts` contém todos os dados de avaliação.

### Padrão Obrigatório

```typescript
import { Station } from "@/types";

export const baremas: Record<1 | 2 | 3, Station[]> = {
  1: [
    {
      id: "p1-e1",
      number: 1,
      name: "Nome da Estação",
      maxScore: 10,
      criteria: [
        { id: "p1-e1-c1", description: "Descrição do critério", score: 1.0 },
        { id: "p1-e1-c2", description: "Descrição do critério", score: 0.5 },
        // ...
      ],
    },
    // demais estações...
  ],
  2: [ /* ... */ ],
  3: [ /* ... */ ],
};
```

### Regras de Validação

- `id` da estação: sempre `p{P}-e{N}` (P = período, N = número da estação)
- `id` do critério: sempre `p{P}-e{N}-c{K}` (K = posição do critério, a partir de 1)
- Todos os `id`s devem ser únicos na aplicação inteira
- A soma dos `score` de todos os critérios deve ser igual ao `maxScore` da estação
- `maxScore` padrão é 10 (pode variar se o barema oficial indicar outro valor)
- `score` pode ser decimal (ex: 0,5 / 1,0 / 2,5)

---

## Sistema de Temporizador

O cronômetro é calculado automaticamente com base na **quantidade de critérios** da estação.

### Regra de Duração

| Critérios | Duração |
|-----------|---------|
| 5 a 10    | 3 minutos (180s) |
| 11 a 15   | 4 minutos (240s) |
| Acima de 15 | 5 minutos (300s) |

### Implementação

```typescript
// src/lib/timer.ts — fonte única da regra, usada em
// AssessmentClient (countdown) e PeriodClient (chip de tempo previsto)
export const getDuration = (criteriaCount: number): number => {
  if (criteriaCount <= 10) return 180;
  if (criteriaCount <= 15) return 240;
  return 300;
};
```

### Estados Visuais (Proporcionais)

| Estado | Limiar | Cor |
|--------|--------|-----|
| Normal | Restam ≥ 1/3 do tempo | Branco |
| Atenção | Restam entre 1/10 e 1/3 | Amarelo (#FCD34D) |
| Perigo | Restam < 1/10 | Vermelho + pulse (#F87171) |

Os limiares são calculados como `Math.round(DURATION / 3)` e `Math.round(DURATION / 10)`, garantindo proporções corretas independentemente da duração.

### Precisão do Timer

O timer usa `Date.now()` com polling de 250ms para manter precisão quando o app está em segundo plano (tab backgrounded no iOS/Android). Não usa `setInterval`.

---

## Sistema de Avaliação

### Cálculo da Nota

```typescript
const score = station.criteria
  .filter((c) => checked.has(c.id))
  .reduce((s, c) => s + c.score, 0);

const pct = Math.round((score / maxScore) * 100);
```

### Registro Temporal

Cada critério marcado recebe um timestamp com o tempo decorrido no momento da marcação:

```typescript
const ts = DURATION - timeLeftRef.current; // segundos decorridos
```

Ao desmarcar um critério, o timestamp é removido. Se remarcar, um novo timestamp é registrado.

### Indicadores de Desempenho (Resumo)

| Faixa | Indicador |
|-------|-----------|
| ≥ 90% | Badge verde "Excelente" — Desempenho excelente na estação |
| 70–89% | Badge âmbar "Bom" — Bom desempenho na estação |
| < 70% | Badge vermelho "Atenção" — Revise os critérios não realizados |

> **Regra de design:** nunca usar emojis na interface. Status são comunicados por
> badges com dot colorido (CSS), tipografia e cor institucional. Ícones são
> exclusivamente SVG inline monocromáticos (estilo Lucide/Heroicons).

### Indicadores de Desempenho (Avaliação em Tempo Real)

| Faixa | Label |
|-------|-------|
| ≥ 70% | Aprovado |
| 50–69% | Regular |
| 1–49% | Insuficiente |
| 0% | (sem label) |

---

## Como Adicionar um Novo Período

### Passo a Passo

**1. Receber o barema oficial**  
Obter o documento com estações, critérios e pontuações do período.

**2. Extrair e validar os dados**  
- Listar todas as estações com nome e número
- Para cada estação: extrair todos os critérios e suas pontuações
- Verificar: soma dos scores = maxScore para cada estação

**3. Definir os IDs**  
```
Período 4:
  Estação 1: id = "p4-e1"
    Critério 1: id = "p4-e1-c1"
    Critério 2: id = "p4-e1-c2"
  Estação 2: id = "p4-e2"
    ...
```

**4. Adicionar o tema visual**  
Em `src/lib/themes.ts`, adicionar a nova entrada:

```typescript
// src/lib/themes.ts
export type PeriodTheme = { /* campos existentes */ };

export const periodThemes: Record<Period, PeriodTheme> = {
  1: { /* teal */ },
  2: { /* osce/pink */ },
  3: { /* violet */ },
  4: {
    headerClass: "bg-period4",
    accent: "#HEX",
    accentBg: "rgba(R,G,B,0.08)",
    checkGlow: "check-glow-period4",
    numGradient: "linear-gradient(135deg, #HEX 0%, #HEX 100%)",
    shadowBtn: "rgba(R,G,B,0.32)",
    footerShadow: "0 -4px 24px rgba(R,G,B,0.25)",
    dotColor: "#HEX",
    cardShadow: "0 8px 28px rgba(R,G,B,0.30), 0 2px 8px rgba(0,0,0,0.06)",
  },
};
```

Adicionar o gradiente e glow em `src/app/globals.css`:

```css
.bg-period4 {
  background: linear-gradient(135deg, #HEX 0%, #HEX 55%, #HEX 100%);
}
.check-glow-period4 {
  box-shadow: 0 0 0 3px rgba(R, G, B, 0.22);
}
```

**5. Atualizar o tipo `Period`**  
Em `src/types/index.ts`:

```typescript
export type Period = 1 | 2 | 3 | 4;
```

**6. Adicionar os dados no baremas.ts**  
```typescript
export const baremas: Record<1 | 2 | 3 | 4, Station[]> = {
  1: [ /* existente */ ],
  2: [ /* existente */ ],
  3: [ /* existente */ ],
  4: [
    {
      id: "p4-e1",
      number: 1,
      name: "Nome da Estação",
      maxScore: 10,
      criteria: [
        { id: "p4-e1-c1", description: "...", score: 1.0 },
        // ...
      ],
    },
    // demais estações
  ],
};
```

**7. Atualizar a tela inicial (`src/app/page.tsx`)**  
Adicionar o novo período ao array:

```typescript
const periods: { num: Period; label: string; subtitle: string }[] = [
  { num: 1, label: "1º Período", subtitle: "6 estações" },
  { num: 2, label: "2º Período", subtitle: "6 estações" },
  { num: 3, label: "3º Período", subtitle: "4 estações" },
  { num: 4, label: "4º Período", subtitle: "X estações" }, // novo
];
```

**8. Atualizar o service worker**  
Em `public/sw.js`, adicionar o novo período ao precache e incrementar a versão:

```javascript
const CACHE = "simuosce-v11"; // incrementar a partir da versão atual (v10)

const PRECACHE = [
  "./",
  "./periodo/1/",
  "./periodo/2/",
  "./periodo/3/",
  "./periodo/4/", // novo
  "./manifest.json",
  "./logo-casf.jpg",
];
```

**9. Fazer build e testar**  
```bash
npm run build
```
Verificar: todas as 16 estações existentes + novas estações geram páginas estáticas.

**10. Publicar**  
Commit, push e abrir PR para `main`. O GitHub Actions faz o deploy automático.

---

## Como Adicionar Novas Estações a um Período Existente

**1. Verificar o ID da última estação do período**  
Se o 3º período tem 4 estações (p3-e4), a nova será `p3-e5`.

**2. Adicionar no array do período em `baremas.ts`**  
```typescript
3: [
  // ... estações existentes ...
  {
    id: "p3-e5",
    number: 5,
    name: "Nome da Nova Estação",
    maxScore: 10,
    criteria: [
      { id: "p3-e5-c1", description: "...", score: 1.0 },
      // ...
    ],
  },
],
```

**3. Atualizar o subtitle na home**  
Em `src/app/page.tsx`:
```typescript
{ num: 3, label: "3º Período", subtitle: "5 estações" }, // atualizar
```

**4. Build e publicar**  
O sistema de roteamento dinâmico (`[stationId]`) detecta a nova estação automaticamente via `generateStaticParams`.

---

## Design System

### Paleta por Período

| Período | Cor principal | Classe CSS |
|---------|--------------|------------|
| 1 | Teal `#2EC9C4` | `bg-teal-brand` |
| 2 | OSCE Pink `#EE1068` | `bg-osce` |
| 3 | Violet `#7C3AED` | `bg-period3` |

### Tokens de Cor (`globals.css`)

```css
--color-teal:        #2EC9C4;   /* Cor primária P1 */
--color-osce-hot:    #EE1068;   /* Cor primária P2 */
--color-violet:      #7C3AED;   /* Cor primária P3 */
--color-surface:     #FFFFFF;   /* Fundo branco */
--color-surface-dim: #F4FEFE;   /* Fundo das telas internas (classe bg-surface-dim) */
--color-ink:         #1F2937;   /* Texto primário */
--color-ink-mid:     #4B5563;   /* Texto secundário */
--color-ink-soft:    #9CA3AF;   /* Texto terciário / labels */
```

### Tipografia

| Uso | Estilo |
|-----|--------|
| Logo "Simu" | Dancing Script 700, `clamp(52px, 17vw, 76px)` |
| "OSCE" | System UI, 900, `clamp(68px, 24vw, 100px)` |
| Títulos de tela (h1) | System UI, 900, 19–30px |
| Nota no resumo | System UI, 900, 52px, `tracking-tight tabular-nums` |
| Nota no footer | System UI, 900, `clamp(36px, 11vw, 50px)` |
| Corpo (critérios) | System UI, 400/600, 15px |
| Labels de seção | classe **`.overline`** — 10px, 700, `letter-spacing: 0.14em`, uppercase |
| Metadados e badges | System UI, 500–700, 11–12px |

**Regra:** todo label de seção em caixa alta usa a classe `.overline` (token único de
`globals.css`) — nunca recriar com utilitários avulsos de tracking/tamanho.

### Componentes

#### Card de Estação (PeriodClient)
```
Rounded-[20px], bg-white, boxShadow tema
├── Número (w-12 h-12, gradiente tema, rounded-[14px])
├── Nome + contagem de critérios
└── Arrow (w-8 h-8, accentBg, rounded-full)
```

#### Botão de Critério (AssessmentClient)
```
w-full, rounded-xl, py-3.5 px-3.5
├── Checkbox circular (w-7 h-7, borda/fundo tema)
├── Descrição + timestamp (quando marcado)
└── Pill de pontuação (+X,X)
```

#### Footer de Avaliação
```
Fixed bottom-0, gradiente do período, z-50
├── Wave decorativa (topo)
├── Nota grande + /maxScore + %
├── Label de desempenho (Aprovado/Regular/Insuficiente)
├── Tempo utilizado
└── Botões: [Concluir] [Limpar]
```

#### Cards do Resumo
```
bg-surface-dim, gap-3, todos com .card-surface
├── Card Resultado Geral (nota 52px + anel SVG de percentual animado)
├── Card Status (badge com dot colorido + descrição)
├── Grid 2 colunas: Critérios | Tempo
└── Card Critérios Não Realizados (condicional, ul/li semânticos)
```

**Fundo de telas internas:** sempre `bg-surface-dim` (token) — nunca hex inline.

### Classe `.pressable`

Todos os botões e links interativos usam a classe `.pressable` (curva spring para feedback nativo):
```css
.pressable {
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.18s ease, opacity 0.18s ease;
}
.pressable:active {
  transform: scale(0.96);
}
```

### Classe `.card-surface`

Token único para superfícies de card em fundo claro — **não** duplicar sombras inline:
```css
.card-surface {
  background: #fff;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.07), 0 0 0 1.5px rgba(0, 0, 0, 0.04);
}
```

### Numerais

Notas, percentuais e tempos grandes usam `tabular-nums` + `tracking-tight`
(largura estável durante atualizações, estilo Apple Health).

### Metadados de card

Linhas de metadados (lista de estações) usam texto simples separado por `·`,
com no máximo um elemento em cor de destaque — não empilhar pills de estilos diferentes.

### Microinterações (globals.css)

| Classe | Uso |
|--------|-----|
| `.anim-fade-up` | Entrada de cards/elementos (combinar com `animationDelay` inline para stagger) |
| `.anim-fade-in` | Entrada suave de containers |
| `.check-pop` | Pop do checkbox ao marcar critério |
| `.anim-score-pop` | Pulso da nota ao atualizar (usar com `key={score}` para re-disparar) |
| `.anim-ring` | Preenchimento do anel de percentual no resumo |

Todas respeitam `prefers-reduced-motion: reduce` (desativadas automaticamente),
**incluindo o `animate-pulse`** do cronômetro em estado crítico.

**Regra:** novas animações devem ser CSS puro (sem bibliotecas), durar ≤ 0,5s e nunca bloquear interação.

### Acessibilidade e comportamento global (globals.css)

- `:focus-visible` global: outline 2px `currentColor` com offset 2px — foco visível
  por teclado em qualquer fundo (claro ou gradiente) sem afetar o toque.
- `overscroll-behavior-y: none` no body: elimina o rubber-band com flash branco
  atrás dos headers coloridos no PWA (iOS/Android).
- Estado vazio ("Estação não encontrada"): mensagem centralizada em `bg-surface-dim`
  + botão pill com gradiente teal, no padrão dos CTAs do sistema.

### Safe Areas (iOS/Android)

```css
paddingTop: "calc(env(safe-area-inset-top, 0px) + Xpx)"
paddingBottom: "env(safe-area-inset-bottom, 16px)"
```
Sempre usar `min-h-dvh` (não `min-h-screen`) para respeitar barra do navegador em mobile.

---

## PWA — Service Worker

O arquivo `public/sw.js` implementa uma estratégia **cache-first**:

1. No install: faz precache das rotas principais
2. Em cada requisição: serve do cache se disponível; caso contrário, busca na rede e armazena
3. Em caso de falha de rede: retorna `./` (página inicial do cache)

**Regra:** Sempre que houver mudança de conteúdo (novo build), incrementar o número da versão:
```javascript
const CACHE = "simuosce-v10"; // versão atual — incrementar a cada deploy com mudanças
```

Isso garante que usuários com o PWA instalado recebam o conteúdo atualizado na próxima visita com rede.

### Metadados (SEO)

`layout.tsx` (`Metadata` API) e `manifest.json` usam descrição mínima **"SimuOSCE"** —
decisão deliberada (PR #19): nenhuma descrição institucional longa em metadados públicos.
Título: `SIMUOSCE`. Não reintroduzir textos como "barema oficial" nesses campos.

---

## Boas Práticas para Implementações Futuras

### Dados
- Nunca criar dados hard-coded fora de `src/data/baremas.ts`
- Manter padrão de IDs (`p{P}-e{N}-c{K}`)
- Validar que `sum(criteria.score) === maxScore` antes de publicar
- Criar uma estação de teste em ambiente local antes de publicar

### Componentes
- Usar `periodThemes[periodNum]` de `src/lib/themes.ts` para qualquer cor relacionada ao período
- Usar `fmt()` de `src/lib/format.ts` para exibir notas (formata decimais no padrão brasileiro)
- Usar `formatTime()` de `src/lib/format.ts` para exibir tempo em `MM:SS`
- Não criar componentes de UI genéricos sem necessidade concreta

### Mobile-First
- Testar em resolução 390px (iPhone) como baseline
- Usar `min-h-dvh` e `env(safe-area-inset-*)` em todos os containers de altura total
- Garantir touch targets mínimos de 44×44px
- Não usar hover-only states (inexistentes em touch)

### Performance
- Manter todas as páginas como SSG (não adicionar `use server` desnecessariamente)
- Não adicionar dependências desnecessárias — a ausência de bibliotecas de UI externas é intencional
- O cronômetro usa polling de 250ms via `Date.now()` — não alterar para `setInterval`

### Acessibilidade
- Botões de toggle devem ter `aria-pressed`
- Regiões dinâmicas devem ter `aria-live` + `aria-atomic`
- Listas de itens devem usar `<ul>/<li>` semânticos
- Elementos decorativos devem ter `aria-hidden="true"`
- Nunca usar emoji na interface (status = badge com dot CSS; ícones = SVG inline)
- Animações novas devem entrar no bloco `prefers-reduced-motion` de `globals.css`

### Design (regra geral)
- Antes de criar qualquer componente ou estilo, consultar o **`DESIGN_SYSTEM.md`** —
  tokens (`.card-surface`, `.overline`, `.pressable`, `bg-surface-dim`), escala
  tipográfica, estados e as 10 regras de consistência são obrigatórios.

---

## Distribuição das Estações por Tempo (Referência)

| Período | Estação | Critérios | Timer |
|---------|---------|-----------|-------|
| 1 | p1-e1 Aferição da Pressão Arterial | 10 | 3min |
| 1 | p1-e2 Ausculta Cardíaca | 11 | 4min |
| 1 | p1-e3 Exame Físico do Abdome | 11 | 4min |
| 1 | p1-e4 Lavagem das Mãos | 10 | 3min |
| 1 | p1-e5 Exame Neurológico Básico | 10 | 3min |
| 1 | p1-e6 Glicemia Capilar | 10 | 3min |
| 2 | p2-e1 Sondagem Vesical de Demora | 10 | 3min |
| 2 | p2-e2 Coleta de Sangue Venoso | 12 | 4min |
| 2 | p2-e3 Sondagem Nasogástrica | 12 | 4min |
| 2 | p2-e4 Exame Preventivo – Papanicolau | 17 | 5min |
| 2 | p2-e5 Exame Físico do Tórax | 12 | 4min |
| 2 | p2-e6 Sutura Simples | 12 | 4min |
| 3 | p3-e1 Ausculta Cardíaca | 16 | 5min |
| 3 | p3-e2 Prova do Laço | 14 | 4min |
| 3 | p3-e3 Exame Físico do Tórax – DPOC | 15 | 4min |
| 3 | p3-e4 Raciocínio Clínico – Anemia Perniciosa | 6 | 3min |

---

## Roadmap Futuro

Funcionalidades planejadas para versões futuras. **Não implementadas.**

### Expansão de Conteúdo
- **4º Período** — Adicionar barema oficial quando disponível
- **5º Período** — Adicionar barema oficial quando disponível
- **Novas estações** — Incorporar estações de períodos existentes conforme evolução do currículo

### Funcionalidades de Avaliação
- **Exportação PDF** — Gerar relatório imprimível do resumo de avaliação
- **Histórico de sessão** — Registrar múltiplas avaliações em uma mesma sessão (ex.: avaliar 10 alunos na mesma estação)
- **Comentários por critério** — Campo de texto livre para observações do avaliador

### Análise e Gestão
- **Estatísticas de turma** — Dashboard com desempenho agregado da turma após a simulação
- **Exportação CSV** — Tabela de resultados por aluno/estação para análise em planilha
- **Dashboard institucional** — Visão de coordenação com tendências por estação/período

### Técnico
- **Modo multi-avaliador** — Sincronização de avaliações em tempo real via WebSocket ou Supabase Realtime
- **Login de avaliador** — Identificação individual para correlacionar avaliações
- **Backup automático** — Salvar progresso em `localStorage` para recuperação em caso de fechamento acidental

---

## Histórico de Versões

Evolução cronológica do projeto (cada PR mergeado na `main` via squash):

| PR | Descrição |
|----|-----------|
| #6 | Auditoria inicial: z-50, aria-hidden, sw.js cleanup → simuosce-v3 |
| #7 | 3º Período: 4 estações do barema oficial |
| #8 | Refatoração: centralizar temas, lib/format.ts, home data-driven |
| #9 | UI: remover datas, remover logo interno, simplificar header |
| #10 | Rodapé institucional: Centro Acadêmico + Afya + © 2026 |
| #11 | Timer: cronômetro de 5min, estados visuais, timestamps por critério |
| #12 | Auditoria final: limites do timer (>=), reset ao limpar, pb-44, role="status" |
| #13 | Timer dinâmico: duração por contagem de critérios (3/4/5min) |
| #14 | Resumo inteligente: SummaryScreen, botão Concluir, Nova Avaliação |
| #15 | Auditoria final v2: sw.js v5, aria-pressed, glow Concluir, semântica ul/li |
| #16 | Modernização premium: sistema de animações CSS, card glass do cronômetro com barra de progresso, entradas com stagger, anel SVG animado no resumo, `lib/timer.ts` como fonte única |
| #17 | Refinamento profissional: remoção de todos os emojis, badge de status com dot CSS, "Critérios Não Realizados", ícones SVG de relógio |
| #18 | Auditoria estratégica de design: sombras difusas na tipografia de marca, token `.card-surface`, linha de metadados unificada nos cards de estação, `tabular-nums` + `tracking-tight` nos numerais, nota do resumo 44→52px |
| #19 | SEO: descrições de `layout.tsx` e `manifest.json` simplificadas para "SimuOSCE"; sw.js v9 |
| #20 | Auditoria master de design: token `.overline` (labels de seção unificados), `:focus-visible` global, `overscroll-behavior`, `animate-pulse` no reduced-motion, `bg-surface-dim` como token, rodapé da home sem duplicação, estado vazio redesenhado, criação do `DESIGN_SYSTEM.md`; sw.js v10 |
