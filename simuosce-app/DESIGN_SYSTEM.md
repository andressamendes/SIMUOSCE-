# SIMUOSCE — Design System

Documento canônico de design da aplicação. Toda nova tela ou componente deve seguir as regras abaixo. Referências de princípio (não de cópia): Apple Health, Apple Fitness, Linear, Notion, Stripe Dashboard, Google Health.

---

## 1. Cores

Tokens definidos em `src/app/globals.css` (`@theme`) e `src/lib/themes.ts`.

### Marca

| Token | Valor | Uso |
|---|---|---|
| `--color-teal` | `#2EC9C4` | Acento do 1º período / marca |
| `--color-teal-mid` | `#22ADAA` | Meio do gradiente teal |
| `--color-teal-deep` | `#178785` | Fim do gradiente teal |
| `--color-osce-hot` | `#EE1068` | Acento do 2º período / "OSCE" |
| `--color-osce-mid` | `#F04E72` | Meio do gradiente OSCE |
| `--color-osce-peach` | `#F5956A` | Fim do gradiente OSCE |
| `--color-violet` | `#7C3AED` | Acento do 3º período |

### Superfícies

| Token | Valor | Uso |
|---|---|---|
| `--color-surface` | `#FFFFFF` | Cards e fundos de conteúdo |
| `--color-surface-dim` | `#F4FEFE` | Fundo das telas internas (`bg-surface-dim`) |

### Texto

| Token | Valor | Uso |
|---|---|---|
| `--color-ink` | `#1F2937` | Títulos e numerais |
| `--color-ink-mid` | `#4B5563` | Texto corrido |
| `--color-ink-soft` | `#9CA3AF` | Labels, metadados |

### Semânticas (estado de desempenho)

| Estado | Cor | Fundo |
|---|---|---|
| Sucesso (≥90% / Aprovado ≥70%) | `#10B981` | `rgba(16,185,129,0.10)` |
| Atenção (70–89% / Regular ≥50%) | `#F59E0B` | `rgba(245,158,11,0.10)` |
| Crítico (<70% resumo / Insuficiente) | `#EF4444` | `rgba(239,68,68,0.10)` |

Regra: cor saturada apenas em acentos, gradientes de header e estados — nunca em texto corrido ou fundos grandes de conteúdo.

---

## 2. Tipografia

Fonte do sistema (`-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui`). Fonte display `Dancing Script` apenas no wordmark "Simu" da home.

### Escala

| Papel | Tamanho / peso | Exemplo |
|---|---|---|
| Numeral hero | 52px black, `tracking-tight tabular-nums` | Nota no resumo |
| Numeral footer | `clamp(36px, 11vw, 50px)` black | Nota em tempo real |
| Título de tela | 30px black (`text-3xl`) | "1º Período" |
| Título de estação | 19px black | Nome da estação |
| Numeral de card | 24px black `tabular-nums` | Critérios / Tempo |
| Corpo | 15px regular/semibold | Critérios da checklist |
| Secundário | 13–14px medium | Descrições |
| Metadado | 11–12px medium/semibold | Timestamps, contagens |
| **Overline** | classe `.overline` — 10px bold, `letter-spacing: 0.14em`, uppercase | Labels de seção |

### Regras

- **Todo label de seção em caixa alta usa `.overline`** — nunca recriar com utilitários avulsos (tracking padronizado em `0.14em`).
- **Todo numeral dinâmico usa `tabular-nums`** (evita deslocamento de layout) e numerais grandes usam `tracking-tight`.
- Hierarquia por peso e tamanho, nunca por cor saturada.

---

## 3. Espaçamento

- Grade base de 4px (utilitários Tailwind).
- Container de conteúdo: `max-w-lg mx-auto px-4`–`px-5` (home: `max-w-sm` para os botões).
- Gap entre cards: `gap-3` (12px); entre grupos: `gap-4` (16px).
- Padding interno de card: `px-5 py-4`–`py-5`; cards de grid: `px-4 py-4`.
- Safe areas obrigatórias: `env(safe-area-inset-top)` nos headers, `env(safe-area-inset-bottom)` nos footers fixos.
- Conteúdo rolável acima de footer fixo: `pb-44`.

---

## 4. Componentes

### Card (`.card-surface`)
Fundo branco + `box-shadow: 0 2px 14px rgba(0,0,0,0.07), 0 0 0 1.5px rgba(0,0,0,0.04)`. Raio `rounded-[20px]` (principal) ou `rounded-[16px]` (grid). Único token de sombra para superfícies de conteúdo.

### Botão primário
`rounded-[16px] py-4 font-black text-[15px]`, gradiente do acento do período, sombra colorida `0 4px 14px {accent}44`, classe `.pressable`.

### Botão secundário
Mesmo raio, fundo `accentBg` (acento a 8–10%), texto no acento.

### Checklist (tela de avaliação)
- Linha inteira é o alvo de toque (`py-3.5 px-3.5`, mínimo 44px de altura).
- Checkbox circular 28px, borda 2px; marcado = fundo no acento + glow (`check-glow-*`) + animação `.check-pop`.
- Estado marcado: fundo da linha em `accentBg`, texto `#1F2937` semibold, pill `+pontos` preenchida no acento.
- Timestamp "Executado em" aparece sob o critério marcado.

### Cronômetro
Card glass no header (`bg-black/20 backdrop-blur-md border-white/15`), numeral 24px black `tabular-nums`, barra de progresso de 3px. Estados: normal (branco) → atenção `#FCD34D` (≤33% restante) → crítico `#F87171` (≤10%, com pulso). `role="status" aria-live="polite"`.

### Barra inferior (avaliação)
Fixa, gradiente do período, nota protagonista, percentual à direita, badge de estado, ações "Concluir" (branco sólido) e "Limpar" (glass). Wave decorativa no topo.

### Badge de status
Pill com dot CSS de 8px + texto bold na cor semântica, fundo a 10% e borda a 20%. **Nunca emoji.**

### Anel de percentual (resumo)
SVG 72px, stroke 6, preenchido com `.anim-ring` (0.9s, delay 0.2s).

---

## 5. Estados visuais

| Estado | Tratamento |
|---|---|
| Toque | `.pressable` — scale 0.96 com spring |
| Foco por teclado | `:focus-visible` global — outline 2px `currentColor`, offset 2px |
| Desabilitado | `disabled:opacity-35` |
| Tempo esgotado | Banner vermelho suave + "Encerrado" no cronômetro + glow no botão Concluir |
| Vazio / erro de rota | Mensagem + botão primário teal centralizados em `bg-surface-dim` |

---

## 6. Movimento

| Classe | Uso | Duração |
|---|---|---|
| `.anim-fade-up` | Entrada de cards (stagger de 55–80ms via `animationDelay`) | 0.5s |
| `.anim-fade-in` | Entrada de áreas de conteúdo | 0.4s |
| `.check-pop` | Marcação de checkbox | 0.28s |
| `.anim-score-pop` | Atualização da nota (re-montagem via `key={score}`) | 0.25s |
| `.anim-ring` | Preenchimento do anel no resumo | 0.9s |

Easing padrão: `cubic-bezier(0.22, 1, 0.36, 1)` (saída) e `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring).

**Acessibilidade:** todas as animações (incluindo `animate-pulse`) são desativadas sob `prefers-reduced-motion: reduce`.

---

## 7. Iconografia

- Apenas SVG inline estilo Lucide (`stroke="currentColor"`, `strokeWidth` 2–2.5, `aria-hidden="true"`).
- **Proibido emoji em qualquer interface.** Status = badge com dot CSS; ícones = SVG.

---

## 8. Regras de consistência

1. Fundo de telas internas: `bg-surface-dim` (nunca hex inline).
2. Sombra de card: somente `.card-surface` (nunca sombras ad-hoc em superfícies brancas).
3. Labels de seção: somente `.overline`.
4. Headers de tela: gradiente do período + wave inferior + blob radial decorativo.
5. Back-link: chevron SVG + label, área de toque expandida (`-mx-2 px-2 py-2.5 -my-2.5`).
6. Duração da estação: somente via `src/lib/timer.ts` (`getDuration` / `getDurationMin`).
7. Formatação de nota/tempo: somente via `src/lib/format.ts` (`fmt` / `formatTime`).
8. Mobile-first: validado em 320 / 360 / 390 / 430px; numerais grandes usam `clamp()`.
9. `select-none` nas telas; `overscroll-behavior-y: none` no body (sem rubber-band em PWA).
10. A cada deploy com mudança de conteúdo, **bump da versão do cache em `public/sw.js`**.
