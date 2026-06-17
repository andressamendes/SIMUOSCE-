# SIMUOSCE — Documentação Técnica Oficial

**Versão do aplicativo:** 1.0.0 (primeira versão institucional estável) · **Documento:** 2.4 · **Data:** Junho 2026  
**Centro Acadêmico Sérgio Ferreira · Afya Faculdade de Ciências Médicas de Guanambi**

> Documento canônico do projeto. Para a especificação detalhada de design (tokens, componentes, estados e regras de consistência), consultar também o **`DESIGN_SYSTEM.md`** — este documento traz o resumo e as regras de negócio; o DESIGN_SYSTEM.md é a referência visual completa.

---

## Visão Geral

O **SIMUOSCE** é um Progressive Web App (PWA) mobile-first desenvolvido para suporte digital às avaliações práticas do OSCE (Objective Structured Clinical Examination). Substitui os baremas em papel, garantindo:

- Marcação ágil de critérios em tempo real
- Cronômetro proporcional à complexidade de cada estação
- **Modo Foco** — interface imersiva de baixa carga cognitiva para a execução da avaliação
- **Barra de progresso da estação** — conclusão por critérios em tempo real, nos dois modos
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
├── CHANGELOG.md                 # Histórico de versões (SemVer)
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
│   │                   ├── AssessmentClient.tsx # Estado da avaliação + timer + modo normal
│   │                   ├── FocusMode.tsx        # Modo Foco — UI imersiva (sem estado próprio)
│   │                   ├── StationProgress.tsx  # Barra de progresso da estação (2 variantes)
│   │                   └── SummaryScreen.tsx    # Resumo final premium
│   ├── components/
│   │   └── PWARegister.tsx      # Registro do service worker
│   ├── data/
│   │   └── baremas.ts           # Dados de todos os períodos/estações (validados no build)
│   ├── lib/
│   │   ├── themes.ts            # Design system por período
│   │   ├── format.ts            # Formatadores: nota e tempo
│   │   ├── timer.ts             # Regra de duração por nº de critérios
│   │   └── validate.ts          # Validação estrutural dos baremas (interrompe build)
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
   ↓ (opcional) botão "Foco"
Modo Foco (estado local — mesma rota, mesmo estado de avaliação)
   ↓ botão "Concluir" (em qualquer um dos modos)
Resumo Final (estado local — SummaryScreen, mesma rota)
   ↓
"Nova Avaliação" (reinicia checklist + cronômetro na mesma estação)
   ou
"Voltar às Estações" (retorna à lista do período)
```

Observações:
- O Resumo Final e o Modo Foco **não são rotas** — são estados do `AssessmentClient`
  (`showSummary` / `focusMode`). Entrar ou sair do Modo Foco **nunca** reseta cronômetro,
  nota, critérios marcados ou timestamps — apenas troca a camada de interface.
- "Nova Avaliação" zera critérios, timestamps, cronômetro (via `resetCount`) e o Modo Foco, permitindo avaliar o próximo aluno na mesma estação sem navegar.

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

### Decisão registrada — Baremas do 2º Período, Estações 1 e 2 (12/06/2026)

> **Nota:** Decisão registrada em 12/06/2026 para o barema anterior. O 2º Período foi
> integralmente substituído pelo novo barema oficial em 17/06/2026 (ver atualização abaixo).

O documento oficial `BAREMAS_2_PERIODO.pdf` (atualização de junho/2026) apresentava uma
inconsistência interna: as pontuações impressas dos critérios somavam **12,25** em cada
estação, mas ambas as tabelas fixavam o total em **10 pontos**. Além disso, na Estação 1
o critério "Finalizou adequadamente" aparecia com a célula de pontuação em branco.

Decisão da coordenação (registrada nesta data): as pontuações dessas duas estações
foram **redefinidas** usando exclusivamente os valores **0,25 / 0,50 / 1,00**,
distribuídos pela relevância clínica de cada etapa e com soma exata de **10,0**:

- **1,00** — etapas críticas: segurança do paciente/cena, raciocínio clínico
  (reconhecimento, avaliação, decisão de iniciar) e execução correta do procedimento
  (compressões, ventilações, golpes interescapulares, compressões abdominais).
- **0,50** — etapas de suporte técnico e comunicação essencial: qualidade complementar
  da técnica, biossegurança verbalizada, explicação de conduta, orientação ao
  acompanhante, condutas de contingência.
- **0,25** — etapas formais: apresentação ao paciente e finalização.

Distribuição resultante (barema anterior): Estação 1 (13 critérios) = 8×1,00 + 3×0,50 + 2×0,25;
Estação 2 (15 critérios) = 6×1,00 + 7×0,50 + 2×0,25.

### Atualização do 2º Período — Novo barema oficial (17/06/2026)

O barema oficial do 2º Período foi substituído integralmente em 17/06/2026.
Fonte: `BAREMAS_2_PERIODO_FINAL2P.md`.

**Mudanças identificadas:**

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Número de estações | 6 | **5** |
| E1 — RCP Adulto | 13 critérios, pontuações 0,25/0,50/1,00 (inclui apresentação e finalização) | **10 critérios**, apenas etapas clínicas; compressões: 1,5; relação 30:2: 1,0 |
| E2 | Manobra de Heimlich em Criança (15 critérios, compressões abdominais) | **Desengasgo em Lactente** (13 critérios; técnica de golpes dorsais + compressões torácicas) |
| E3 | Escala de Coma de Glasgow (12 critérios) | **Removida** |
| E4 → E3 | Exame Preventivo (Papanicolau) — estava na posição 4 | Renumerada para posição **3**; c16 encurtado para "Explicou o envio do material para o citopatológico" |
| E5 → E4 | Escala MRC + Lesão NMS/NMI — estava na posição 5 | Renumerada para posição **4** |
| E6 → E5 | Inspeção e Palpação de Mamas — estava na posição 6 | Renumerada para posição **5**; c12: "diante de" → "frente a achados suspeitos" |

**Cronômetros atualizados:**

| Estação | Critérios | Timer |
|---------|-----------|-------|
| p2-e1 RCP Adulto | 10 | **3 min** (era 4 min) |
| p2-e2 Desengasgo em Lactente | 13 | 4 min |
| p2-e3 Exame Preventivo (Papanicolau) | 17 | 5 min |
| p2-e4 Escala MRC + Lesão NMS/NMI | 12 | 4 min |
| p2-e5 Inspeção e Palpação de Mamas | 12 | 4 min |

**Inconsistência identificada na Estação 2 (Desengasgo em Lactente):**
Os scores individuais do barema somam **10,5**, mas o total oficial é **10,0**.
Ajuste adotado: critério 10 ("Alternou ciclos…") reduzido de 1,0 → **0,5**.
Justificativa: os critérios de execução técnica individual (c6 e c9, ambos 1,5)
já ponderam fortemente as técnicas; o critério de alternância é complementar.

**Validação das pontuações:**
Todas as 5 estações têm soma exata de **10,0** (verificada critério a critério e confirmada pelo build).

### Decisão registrada — Estação 1 do 1º Período, critérios c10 e c11 (17/06/2026)

O barema revisado (17/06/2026) declara **Total: 10,0** para a Estação 1, mas as pontuações
individuais impressas somam **9,0** (critérios 9 e 10 do documento = 0,5 pt cada,
resultando em déficit de 1,0 pt).

Decisão: os critérios **c10** ("Comunicou o resultado ao paciente") e **c11**
("Despediu-se do paciente e verbalizou a higienização final das mãos") foram mantidos
em **1,0 pt cada** para que a soma total da estação permaneça **10,0 pt**, conforme
declarado no documento oficial. Os valores 0,5 impressos no documento são tratados
como erro de digitação. Todos os demais critérios e pontuações seguem fielmente o
barema revisado.

### Decisões registradas — 3º Período, Estações 2 e 3 (17/06/2026)

O barema oficial revisado do 3º Período (17/06/2026) apresenta duas inconsistências
aritméticas entre pontuações individuais declaradas e o total de 10,0 pt por estação:

**Estação 2 (Prova do Laço):** o barema separa o antigo critério combinado
"delimitar quadrado + contar petéquias" (1,0 pt) em dois critérios independentes,
cada um com 1,0 pt, mas sem ajustar o total — resultando em soma calculada de **10,75 pt**
contra total declarado de **10,0 pt**.

Decisão: os dois novos subcritérios "Delimitou o quadrado de 2,5 x 2,5 cm no antebraço"
e "Contou as petéquias na área delimitada" receberam **0,5 pt cada** (total 1,0 pt —
igual ao critério original), e o critério "Manteve o manguito insuflado por 5 minutos"
foi ajustado de 1,0 → **1,25 pt** para redistribuir os 0,25 pt provenientes da remoção
de "Higienizou o estetoscópio" (etapa sem aplicação clínica na Prova do Laço).
Soma resultante: 10,0 pt. A etapa de 5 minutos é a mais crítica da prova — o ajuste é
clinicamente justificado.

**Estação 3 (Exame Físico do Tórax – DPOC):** o barema remove "Higienizou o estetoscópio"
(0,25 pt) sem redistribuir essa pontuação — resultando em soma calculada de **9,75 pt**
contra total declarado de **10,0 pt**.

Decisão: "Realizou a inspeção do tórax" foi ajustado de 0,75 → **1,0 pt**, absorvendo
os 0,25 pt da etapa removida. Inspeção do tórax é etapa diagnóstica primária no DPOC —
o arredondamento para 1,0 pt é clinicamente justificado e alinhado ao peso das demais
etapas de exame físico (percussão, palpação e ausculta: 1,0 pt cada).

Adicionalmente, a Estação 3 corrige um erro clínico da versão anterior: FTV "aumentado" →
**"reduzido"** (no DPOC/enfisema o frêmito toracovocal está reduzido, não aumentado).

### Auditoria Linguística dos Baremas — Padrão Oficial de Redação (12/06/2026)

Auditoria completa de ortografia, gramática e consistência aplicada a **todos os
critérios de todos os períodos** (16 estações, 194 critérios). O padrão abaixo é
**obrigatório para todo barema novo ou alterado**:

1. **Tempo verbal oficial: pretérito perfeito do indicativo** — o critério descreve
   uma ação **observada/executada** pelo aluno (checklist observacional).
   - ✓ "Apresentou-se ao paciente" · "Higienizou as mãos" · "Verbalizou o procedimento"
     · "Realizou a técnica corretamente"
   - ✗ Infinitivo ("Apresentar-se…"), presente ("Apresenta-se…"), substantivo
     ("Apresentação ao paciente"), futuro ou mistura de tempos na mesma frase.
2. **Iniciar com verbo.** Critérios negativos observáveis são a única exceção e
   iniciam com "Não" + pretérito perfeito (ex.: "Não realizou varredura digital cega").
3. **Linguagem observacional, objetiva e mensurável** — descrever o comportamento
   verificável, sem termos vagos ou informais.
4. **Gramática completa**: artigos definidos ("Realizou **a** palpação…"), concordância
   verbal/nominal e regência revisadas; orações subordinadas a verbo no pretérito usam
   o imperfeito do subjuntivo ("Solicitou que o paciente **retirasse**/**expusesse**…").
5. **Maiúsculas**: apenas em início de frase, siglas (PAS, PAD, EIC, FTV, DEA, SAMU,
   RCP, MRC) e nomes próprios (Babinski, Ambu); achados clínicos após dois-pontos em
   minúsculas (ex.: "…o achado: hipertimpanismo").
6. **Citações literais esperadas do aluno** permanecem entre aspas e não são
   reescritas (ex.: o feedback "Bulhas rítmicas, normofonéticas, 2 tempos, sem sopros
   cardíacos").
7. **Consistência entre estações**: ações idênticas usam redação idêntica
   ("Apresentou-se ao paciente", "Verbalizou a higienização das mãos", "Despediu-se e
   verbalizou a higienização final", "Posicionou corretamente o paciente"). Distinções
   pedagógicas reais são preservadas — *verbalizar* a higienização (1º/2º períodos) ≠
   *higienizar* de fato (3º período, "Higienizou as mãos").

Correções notáveis da auditoria: "juxtaesternal" → **"justaesternal"** (3 ocorrências);
"retirasse a camisa/exponha o tórax" → "retirasse a camisa/**expusesse** o tórax"
(concordância no subjuntivo); "à base do processo xifoide" → "**na** base…" (regência);
conversão integral do 3º período (infinitivos e substantivos → pretérito perfeito) e
das Estações 1–2 do 2º período (presente → pretérito perfeito).

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

## Modo Foco

### Objetivo

Reduzir a carga cognitiva do avaliador durante a execução da estação — experiência
de ferramenta profissional de execução, não de navegação em sistema. Projetado para
uso com uma mão, em pé, em ambiente clínico.

### Ativação e saída

- **Entrar:** botão glass "Foco" (ícone expand) no header da avaliação normal.
- **Sair:** botão circular (ícone compress, `aria-label="Sair do Modo Foco"`) no header compacto.
- Entrar/sair **preserva integralmente** cronômetro, nota, critérios e timestamps.

### Comportamento (`FocusMode.tsx`)

| Removido/oculto | Mantido/ampliado |
|---|---|
| Gradiente de header, waves, blob radial | Header compacto branco sticky: sair + nome da estação + cronômetro |
| Link "← Período" e badge de estação | Cronômetro 26px (cinza `#374151`; amarelo/vermelho só sob pressão) |
| Score card flutuante do header | Barra de progresso da estação no header sticky |
| Footer com gradiente e wave | Critérios full-width com divisórias, `py-4` (alvo de toque maior) |
| | Footer branco fixo: nota no acento + % + Concluir/Limpar |

Regra: o cronômetro do Modo Foco usa cor **calma** (`#374151`) no estado normal —
nunca a cor do acento, que dominaria o fundo branco sem necessidade.

---

## Barra de Progresso da Estação

Componente `StationProgress.tsx`, compartilhado entre modo normal e Modo Foco.

### Informações exibidas (tempo real, a cada toggle)

```
[████████████░░░░░░░░░░]
8 de 12 critérios realizados        67% concluído
```

### Regras

- O percentual é de **conclusão por critérios** (realizados/total) — **não** o percentual
  da nota. A nota tem indicadores próprios (score card, footer). Não misturar as duas métricas.
- Variantes: `dark` (header com gradiente — barra 6px branca) e `light` (Modo Foco —
  barra 4px na cor do período).
- Acessibilidade: `role="progressbar"` + `aria-valuemin/max/now` + label descritivo.
- Cores calmas do Design System — sem estados de alerta ou erro.

---

## Resumo Final (SummaryScreen)

Tela premium de encerramento da estação — a mais refinada do aplicativo.

### Hierarquia visual obrigatória

1. **Nota Final** — protagonista absoluta: `clamp(56px, 18vw, 72px)`, cor do acento.
2. **Percentual** — anel SVG de 88px (r34, stroke 7) animado, integrado ao card da nota.
3. **Tempo** — utilizado, previsto ("de X:XX previstos") e **média por critério**
   (`elapsed ÷ critérios realizados`, exibida quando aplicável).
4. **Critérios** — realizados/total com mini barra de 4px; lista de não realizados
   em card próprio.

### Composição

- **Card hero**: nota + anel + badge de desempenho integrado como strip full-width
  (não usar card separado de "Status" — quebraria a hierarquia).
- **Grid 2 colunas**: Tempo | Critérios.
- **Card "Não Realizados"** (condicional): dots **neutros** (`#D1D5DB`) — o badge do
  hero já comunica o sinal de desempenho; a lista é informacional, não alarme.
- **Footer fixo**: "Nova Avaliação" (gradiente do acento, primário) e
  "Voltar às Estações" (accentBg, secundário) — ambos `py-4`, área de toque ampla.

---

## Componentes Críticos

Os componentes abaixo são estratégicos. **Não alterá-los sem atualizar esta documentação**
(e o `DESIGN_SYSTEM.md` quando a mudança for visual):

| Componente | Fonte | Regra protegida |
|---|---|---|
| Sistema de pontuação | `AssessmentClient.tsx` | Soma dos scores marcados; % = score/maxScore |
| Cronômetro inteligente | `src/lib/timer.ts` | 3/4/5 min por faixa de critérios; fonte única |
| Registro temporal | `AssessmentClient.tsx` | Timestamp ao marcar; remove ao desmarcar |
| Barra de progresso | `StationProgress.tsx` | Conclusão por critérios, nunca por nota |
| Modo Foco | `FocusMode.tsx` | Sem estado próprio; nunca reseta a avaliação |
| Resumo Final | `SummaryScreen.tsx` | Hierarquia: nota → % → tempo → critérios |
| Estrutura dos baremas | `src/data/baremas.ts` + `lib/validate.ts` | Validação obrigatória no build |

---

## Padrões Oficiais de UX

Regras permanentes para qualquer tela nova ou alteração:

1. **Simplicidade operacional primeiro** — cada tela tem uma única tarefa principal.
2. **Minimizar distrações** — decoração nunca compete com conteúdo de avaliação.
3. **Uso com uma mão** — ações primárias ao alcance do polegar (footer fixo).
4. **Leitura rápida** — hierarquia tipográfica clara; numerais `tabular-nums`.
5. **Reduzir carga cognitiva** — no máximo uma métrica nova por componente.
6. **Otimizar para avaliação em tempo real** — toque em qualquer parte da linha do
   critério; feedback imediato (< 300ms); nada bloqueia a marcação.

---

## Checklist de Qualidade (obrigatório antes de cada release)

- [ ] **Design System preservado** — tokens (`.card-surface`, `.overline`, `.pressable`, `bg-surface-dim`) e regras do `DESIGN_SYSTEM.md` respeitados
- [ ] **Responsividade validada** — 320 / 360 / 390 / 430px sem overflow ou quebra
- [ ] **Modo Foco funcional** — entrar/sair preserva estado; Concluir funciona nos dois modos
- [ ] **Barra de progresso funcional** — atualiza a cada toggle nos dois modos
- [ ] **Resumo Final consistente** — hierarquia nota → % → tempo → critérios intacta
- [ ] **Cronômetro validado** — duração correta por faixa; estados visuais proporcionais; resiste a background
- [ ] **Navegação validada** — fluxo oficial completo sem perda de estado indevida
- [ ] **Performance validada** — build SSG, sem dependências novas injustificadas, bundle estável
- [ ] **Baremas validados** — `npm run build` passa (validação automática)
- [ ] **sw.js** — versão do cache incrementada

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
const CACHE = "simuosce-vN"; // incrementar a partir da versão atual em public/sw.js

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
| Nota no resumo | System UI, 900, `clamp(56px, 18vw, 72px)`, `tracking-tight tabular-nums` |
| Nota no footer (modo normal) | System UI, 900, `clamp(36px, 11vw, 50px)` |
| Nota no footer (Modo Foco) | System UI, 900, `clamp(32px, 10vw, 44px)`, cor do acento |
| Cronômetro (Modo Foco) | System UI, 900, 26px, `tabular-nums` |
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
├── Card Hero (rounded-[24px]):
│     nota clamp(56-72px) + anel SVG 88px animado
│     + strip de desempenho integrado (badge com dot, fundo semântico a 9%)
├── Grid 2 colunas:
│     Tempo (utilizado + "de X:XX previstos" + Média/critério)
│     Critérios (realizados/total + mini barra 4px)
└── Card Não Realizados (condicional, ul/li, dots neutros #D1D5DB)
```

**Regra:** o badge de desempenho vive **dentro** do card hero — nunca como card
separado (dois cards de nível 1 quebram a hierarquia).

#### Barra de Progresso da Estação (StationProgress)
```
role="progressbar" + labels
├── variant="dark"  — header gradiente: barra 6px branca / bg-white/20
└── variant="light" — Modo Foco: barra 4px no acento / bg-#F3F4F6
Texto: "{X} de {Y} critérios realizados" + "{Z}% concluído"
```

#### Modo Foco (FocusMode)
```
Tela branca, sem decoração
├── Header sticky: sair (36px) + estação + cronômetro 26px + StationProgress
├── Critérios full-width, py-4, divisórias border-#F3F4F6
└── Footer fixo branco: nota no acento + % + [Concluir sólido] [Limpar ghost]
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
const CACHE = "simuosce-v14"; // versão atual — incrementar a cada deploy com mudanças
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
| 1 | p1-e1 Aferição da Pressão Arterial | 11 | 4min |
| 1 | p1-e2 Ausculta Cardíaca | 11 | 4min |
| 1 | p1-e3 Ausculta Respiratória | 11 | 4min |
| 1 | p1-e4 Antropometria do Bebê | 10 | 3min |
| 1 | p1-e5 Exame Abdominal | 10 | 3min |
| 1 | p1-e6 Técnica de Lavagem das Mãos | 10 | 3min |
| 2 | p2-e1 RCP Adulto | 10 | 3min |
| 2 | p2-e2 Desengasgo em Lactente | 13 | 4min |
| 2 | p2-e3 Exame Preventivo (Papanicolau) | 17 | 5min |
| 2 | p2-e4 Escala MRC + Lesão NMS/NMI | 12 | 4min |
| 2 | p2-e5 Inspeção e Palpação de Mamas | 12 | 4min |
| 3 | p3-e1 Ausculta Cardíaca | 16 | 5min |
| 3 | p3-e2 Prova do Laço | 14 | 4min |
| 3 | p3-e3 Exame Físico do Tórax – DPOC | 14 | 4min |
| 3 | p3-e4 Raciocínio Clínico – Anemia Perniciosa | 6 | 3min |

---

## Segurança, Robustez e Resiliência

### Modelo de ameaça e limitações do GitHub Pages

O SIMUOSCE é um site **100% estático** servido pelo GitHub Pages. Isso define o modelo de segurança:

- **Não há servidor, API, banco de dados nem autenticação** — não existem segredos para vazar nem superfície de ataque server-side.
- **Todo o código JavaScript é distribuído ao navegador** e pode ser inspecionado. Nenhuma técnica impede totalmente a cópia de uma aplicação web pública — a proteção da propriedade intelectual é jurídica (LICENSE) e de atribuição, não técnica.
- **Não armazenamos dados pessoais**: o estado da avaliação vive apenas em memória (React state) e é descartado ao sair da página. Não há `localStorage`, cookies nem telemetria.
- GitHub Pages não permite configurar headers HTTP customizados (CSP, HSTS) — limitação aceita e documentada; o HTTPS é provido pela plataforma.

### Decisões de segurança adotadas

| Decisão | Detalhe |
|---|---|
| Dependências mínimas | Removidas 7 dependências não utilizadas (`xlsx`, `jspdf`, `jspdf-autotable`, `recharts`, `@types/recharts`, `zustand`, `@next/font`) — incluindo `xlsx` com vulnerabilidade *high* sem correção disponível. Runtime atual: apenas `next`, `react`, `react-dom`. |
| Sem segredos no código | Varredura confirmou ausência de tokens, chaves e credenciais em todo o repositório. A única variável de ambiente é `NEXT_PUBLIC_BASE_PATH` (pública por natureza). |
| Workflow com permissões mínimas | `deploy.yml` usa `permissions: contents: read, pages: write, id-token: write` e actions oficiais pinadas por versão major. |
| Validação de baremas no build | `src/lib/validate.ts` roda durante o SSG e **interrompe o build** se houver: IDs duplicados ou fora do padrão, somas de scores divergentes do `maxScore`, critérios vazios, descrições vazias, scores ≤ 0 ou períodos sem estações. Dados corrompidos nunca chegam à produção. |
| Sem dados pessoais | Nenhum dado de aluno/avaliador é coletado ou persistido. |

### Riscos residuais aceitos (registrar a cada auditoria)

- **Advisories do Next 14.x** (`npm audit`): referem-se ao runtime de **servidor** (Image Optimizer, middleware, RSC server, WebSocket, caches do `next/image`). Com `output: 'export'` nenhum desses subsistemas existe em produção — o risco real em runtime é nulo. A correção definitiva exige migração breaking para Next 16, a avaliar em manutenção futura.
- **Advisory moderate do PostCSS** embutido no Next: ferramenta de **build**, não roda no navegador.

### Resiliência implementada

- Rota de estação inexistente → estado vazio com CTA "Voltar ao Início" (`AssessmentClient`).
- Período sem estações → card informativo "Nenhuma estação disponível" (`PeriodClient`).
- Acessos a `baremas[periodNum]` e `find(...)` sempre com fallback (`?? []` / `?? null`).
- Falha de rede → service worker cache-first responde com conteúdo offline.
- Timer baseado em `Date.now()` — resiste a abas em segundo plano.

### Procedimento para futuras atualizações

1. `npm audit` antes de cada release; novas dependências exigem justificativa (a ausência de bibliotecas externas é intencional).
2. Alterações em baremas: o build valida automaticamente — **nunca** desabilitar a chamada `validateBaremas` em `src/data/baremas.ts`.
3. Incrementar a versão do cache em `public/sw.js` a cada deploy com mudança de conteúdo.
4. Não introduzir `localStorage`/cookies sem revisar a seção de dados pessoais desta documentação.

### Propriedade intelectual

- **Autoria:** Andressa Souza — Aluna do Curso de Medicina, Afya Faculdade de Ciências Médicas de Guanambi.
- **Créditos institucionais:** Centro Acadêmico Sérgio Ferreira · Afya Faculdade de Ciências Médicas de Guanambi.
- **Licença:** [CC BY-NC-SA 4.0](../LICENSE) (arquivo `LICENSE` na raiz do repositório). Escolhida por: preservar a autoria (atribuição obrigatória), permitir e incentivar uso acadêmico, proibir uso comercial e exigir que derivados mantenham a mesma licença. Crédito de autoria visível no rodapé da aplicação e no README.

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
| #21 | Documentação v2.0: fluxo oficial completo, correções de desatualizações, decisões registradas |
| #22 | Auditoria de segurança e resiliência: remoção de 7 dependências não usadas (elimina vulnerabilidade high do xlsx), validação de baremas no build (`lib/validate.ts`), estado vazio em períodos sem estações, LICENSE (CC BY-NC-SA 4.0), README com créditos e autoria, seção de segurança nesta documentação; sw.js v11 |
| #23 | Modo Foco: `FocusMode.tsx` — interface imersiva de avaliação (header compacto sticky, critérios full-width, footer minimalista), ativação pelo botão "Foco", estado da avaliação integralmente preservado; sw.js v12 |
| #24 | Barra de progresso inteligente: `StationProgress.tsx` compartilhado (modo normal + foco), conclusão por critérios em tempo real, correção da inconsistência barra-nota vs label-critérios no header normal; sw.js v13 |
| #25 | Auditoria visual final: Resumo Final premium — card hero com nota `clamp(56-72px)` + anel 88px + badge integrado, card de tempo com previsto e média/critério, mini barra nos critérios, dots neutros nos pendentes; Modo Foco com cronômetro calmo (`#374151`); sw.js v14 |
| #26 | Baremas 2º Período (BAREMAS_2_PERIODO.pdf, jun/2026): Estação 1 (RCP Adulto) 10→13 critérios e timer 3→4min; Estação 2 (Heimlich em Criança) 12→15 critérios (timer mantém 4min); novos critérios "Apresentou-se ao paciente", "Verbalizou higienização das mãos" e "Finalizou adequadamente" nas duas estações; pesos impressos (soma 12,25) reescalonados ×10/12,25 para manter nota máxima 10 (decisão registrada na seção de baremas); sw.js v15 |
| #28 | Pontuação das Estações 1 e 2 do 2º Período redefinida: valores exclusivos 0,25/0,50/1,00 distribuídos por relevância clínica, soma exata 10,0 (E1: 8×1,00 + 3×0,50 + 2×0,25; E2: 6×1,00 + 7×0,50 + 2×0,25), substituindo o reescalonamento ×10/12,25; sw.js v16 |
| #29 | Auditoria linguística completa dos baremas (16 estações, 194 critérios): padrão oficial pretérito perfeito/início com verbo, conversão integral do 3º período e das Estações 1–2 do 2º período, correções ortográficas ("justaesternal"), gramaticais (subjuntivo, regência, artigos, maiúsculas) e de consistência; tabela de distribuição corrigida; regra oficial de redação registrada; sw.js v17 |
| #30 | **Release v1.0.0** — primeira versão institucional estável: criação do CHANGELOG.md, versão 1.0.0 no package.json, limpeza de 12 arquivos sem referência (boilerplate do create-next-app e imagens soltas), README da aplicação reescrito (era boilerplate), auditoria operacional final registrada; sw.js v18 |
| #31 | **Barema 1º Período atualizado** (barema oficial revisado, 17/06/2026): Estação 1 (Aferição da Pressão Arterial) 10→11 critérios — critério 6 dividido em "Palpou a artéria radial para estimativa palpatória da PAS" (0,5pt) e "Posicionou o diafragma do estetoscópio sobre a artéria braquial" (0,5pt) com renumeração sequencial c6–c11; timer 3→4min; discrepância identificada (soma das pontuações individuais = 9,0 mas total declarado = 10,0): critérios c10 e c11 mantidos em 1,0pt cada para preservar o total declarado de 10,0 (decisão registrada). Estação 4 (Antropometria do Bebê): critérios c8, c9 e c10 redistribuídos (c8: 1,0→0,5pt; c9 e c10: 0,25→0,5pt cada). Todas as 6 estações com descrições ampliadas (detalhamento clínico completo) e auditoria linguística aplicada; sw.js v19 |
| #32 | **Atualização 2º Período** (17/06/2026) — novo barema oficial `BAREMAS_2_PERIODO_FINAL2P.md`: E1 RCP Adulto reduzida de 13→10 critérios (timer 4→3min; pesos 1,5 para compressões e 1,0 para relação 30:2); E2 substituída de "Manobra de Heimlich em Criança" (15 critérios) por "Desengasgo em Lactente" (13 critérios, técnica de lactente: golpes dorsais + compressões torácicas); E3 "Escala de Coma de Glasgow" **removida**; Papanicolau, MRC+NMS/NMI e Mamas renumeradas (E4→E3, E5→E4, E6→E5); total: 6→5 estações; home page atualizada (6→5 estações); sw.js v20 |
| #33 | **Barema 3º Período atualizado** (barema oficial revisado, 17/06/2026): E1 — descrições simplificadas (detalhes anatômicos dos focos removidos), "Higienizou as mãos" → "Verbalizou a higienização das mãos", c7 reescrito para "para a ausculta"; E2 — "Prova do Laço (Teste de Fragilidade Capilar)" → "Prova do Laço", "Higienizou o estetoscópio" removido, c10 "Verbalizou o tempo..." → "Manteve o manguito insuflado por 5 minutos", critério combinado de petéquias dividido em dois (Delimitou + Contou), feedback literal removido; E3 — "Exame Físico do Tórax – DPOC/Enfisema Pulmonar" → "Exame Físico do Tórax – DPOC", "Higienizou o estetoscópio" removido, critérios de percussão/palpação/ausculta simplificados, FTV "aumentado" **→ "reduzido"** (correção clínica), p3-e3: 15 → 14 critérios; E4 — "com cordialidade" removido, critérios 3–5 convertidos para pretérito perfeito. Duas inconsistências aritméticas detectadas e resolvidas (E2: 10,75→10,0; E3: 9,75→10,0) — decisões registradas na seção de baremas; sw.js v21 |
