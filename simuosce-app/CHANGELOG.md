# Changelog — SIMUOSCE

Todas as mudanças relevantes do projeto são registradas neste arquivo.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o
versionamento segue [SemVer](https://semver.org/lang/pt-BR/).

## [1.3.0] — 2026-06-17

**Consolidação da arquitetura escalável — preparação para períodos 6º ao 12º.**

### Arquitetura

- **`Period = number`**: tipo `Period` em `src/types/index.ts` alterado de união fechada
  (`1 | 2 | 3 | 5`) para `number`. Novos períodos não exigem alteração de tipos.
- **`generateStaticParams` automático**: a rota de estações
  (`[period]/estacao/[stationId]/page.tsx`) agora deriva as páginas estáticas
  diretamente de `Object.keys(baremas)`, igual à rota de período já fazia —
  nenhuma atualização manual ao adicionar período.
- **`getTheme(period)`**: função utilitária exportada de `src/lib/themes.ts` que
  retorna o tema do período com fallback ao teal (período 1). Todos os componentes
  migrados de `periodThemes[p] ?? periodThemes[1]` para `getTheme(p)`.
- **`Partial<Record<number, PeriodTheme>>`**: tipo de `periodThemes` corrigido para
  refletir que nem todos os períodos têm tema — TypeScript agora detecta acessos não
  seguros em vez de assumir que todos os números têm entrada.
- **`Partial<Record<number, Station[]>>`**: tipo de `baremas` atualizado da mesma forma.

### Utilitários centralizados

- **`src/lib/scoring.ts`** (novo): centraliza lógica de pontuação duplicada entre
  `AssessmentClient` e `FocusMode`:
  - `getStatusLabel(pct, bgAlpha)` — label Aprovado/Regular/Insuficiente com cores
  - `getPerfBadge(pct)` — badge Excelente/Bom/Atenção usado no Resumo Final
  - `calculateScore`, `calculatePct`, `getPendingCriteria` — utilitários reutilizáveis

### Validação aprimorada

- **`src/lib/validate.ts`**: mensagens de erro aprimoradas — exibe contagem de erros e
  períodos afetados no cabeçalho; nova verificação de score por critério (não pode
  exceder o `maxScore` da estação); diferença aritmética exibida com 3 casas decimais.

### Documentação

- **`DOCUMENTACAO_PROJETO.md`** (v3.0): atualizado para refletir a nova arquitetura —
  seção "Como Adicionar um Novo Período" revisada (remoção do passo "atualizar tipo
  Period"; `generateStaticParams` marcado como automático); nova seção "Escalabilidade
  do Projeto" com tabela de princípios, checklist de arquivos e referência de utilitários.
- **`CHECKLIST_NOVO_PERIODO.md`** (novo): checklist completo para implementação de novos
  períodos — dados, linguagem, código, build, cronômetro, responsividade, Resumo Final,
  Modo Foco, visual e publicação.

---

## [1.2.0] — 2026-06-17

**Adição do 5º Período — barema oficial implementado.**

### Conteúdo

- **5º Período** adicionado com 4 estações e 45 critérios:
  - Estação 1 — **Paramentação**: 11 critérios, máximo 10,0 pts, cronômetro 4 min.
    Abrange conferência do ambiente, higiene das mãos (momento e técnica), touca,
    máscara, organização de materiais, paramentação do avental estéril, postura
    asséptica e reconhecimento de contaminação.
  - Estação 2 — **Luva Estéril e Punção Venosa Periférica**: 12 critérios, máximo
    10,0 pts, cronômetro 4 min. Abrange identificação do paciente, EPI, seleção
    de materiais, calçamento de luvas (técnica aberta), seleção venosa, garrote,
    antissepsia, punção, avanço do cateter e descarte seguro.
  - Estação 3 — **Sutura e Nó**: 12 critérios, máximo 10,0 pts, cronômetro 4 min.
    Abrange organização do campo, higiene e EPI, uso correto dos instrumentais,
    preensão da agulha, manipulação de bordas, introdução da agulha, ponto simples
    interrompido, nó quadrado, ajuste de tensão e descarte seguro.
  - Estação 4 — **Intubação Orotraqueal**: 10 critérios, máximo 10,0 pts,
    cronômetro 3 min. Abrange reconhecimento da indicação, avaliação da via aérea,
    pré-oxigenação, checagem de materiais, laringoscopia, visualização das cordas
    vocais, passagem do tubo e confirmação com capnografia.
- Tema visual **âmbar** (`#F59E0B` → `#D97706` → `#B45309`) criado para o 5º
  Período: `bg-period5`, `check-glow-period5`, tokens CSS `--color-amber*`.
- Tipo `Period` estendido: `1 | 2 | 3 | 5`.
- Home page atualizada: botão "5º Período · 4 estações" adicionado.
- `generateStaticParams` atualizado: 4 novas rotas de período + 4 novas rotas de
  estação geradas estaticamente no build.
- Auditoria linguística aplicada: todos os 45 critérios no pretérito perfeito,
  com verbo no início e linguagem observacional.
- Validação de pontuações: todas as 4 estações somam exatamente 10,0 pt
  (verificado critério a critério e confirmado pelo build).
- sw.js v22 (adição de `./periodo/5/` ao precache).

---

## [1.1.0] — 2026-06-17

**Atualização do 2º Período — novo barema oficial.**

### Conteúdo

- **2º Período** substituído integralmente conforme `BAREMAS_2_PERIODO_FINAL2P.md`:
  - Estação 1 (RCP Adulto): reduzida de 13→**10 critérios** (apenas etapas clínicas;
    compressões com 1,5 pts; relação 30:2 com 1,0 pt); timer 4 min → **3 min**.
  - Estação 2 substituída: "Manobra de Heimlich em Criança" →
    **"Desengasgo em Lactente"** (técnica de lactente: golpes dorsais +
    compressões torácicas; 13 critérios).
  - Estação "Escala de Coma de Glasgow" **removida**.
  - Papanicolau, Escala MRC e Mamas renumeradas (posições 4/5/6 → **3/4/5**).
  - Total: 6 → **5 estações** no 2º Período.
- Home page atualizada: "6 estações" → "5 estações" para o 2º Período.
- Auditoria linguística reaplicada às novas estações.
- sw.js v19.

---

## [1.0.0] — 2026-06-12

**Primeira versão institucional estável.**
Centro Acadêmico Sérgio Ferreira · Afya Faculdade de Ciências Médicas de Guanambi.

### Conteúdo

- **16 estações** com baremas oficiais validados no build: 1º Período (6),
  2º Período (6) e 3º Período (4) — 194 critérios no total.
- Baremas do 2º Período (Estações 1 e 2) atualizados conforme
  `BAREMAS_2_PERIODO.pdf` (jun/2026), com pontuação redefinida pela coordenação
  em valores exclusivos 0,25/0,50/1,00 somando exatamente 10,0 (PRs #27–#28).
- Auditoria linguística completa: todos os critérios padronizados no pretérito
  perfeito (checklist observacional), com correções ortográficas e gramaticais;
  padrão oficial de redação registrado na documentação (PR #29).

### Funcionalidades

- **Avaliação em tempo real**: marcação de critérios com um toque, nota e
  percentual instantâneos, labels de desempenho (Aprovado/Regular/Insuficiente).
- **Cronômetro inteligente**: duração automática por número de critérios
  (5–10 → 3 min · 11–15 → 4 min · >15 → 5 min), estados visuais proporcionais,
  resistente a abas em segundo plano (`Date.now()`), registro temporal por
  critério (PRs #11–#13, #16).
- **Modo Foco**: interface imersiva de baixa carga cognitiva, estado da
  avaliação integralmente preservado ao entrar/sair (PR #23).
- **Barra de progresso da estação**: conclusão por critérios em tempo real nos
  dois modos (PR #24).
- **Resumo Final**: nota protagonista, anel de percentual animado, tempo
  utilizado/previsto, média por critério e lista de critérios não realizados
  (PRs #14, #25).
- **PWA offline-first**: service worker cache-first, instalável, funcional sem
  rede após a primeira visita.

### Qualidade e segurança

- Validação estrutural dos baremas no build — dados inconsistentes interrompem
  a publicação (PR #22).
- Auditoria de segurança: dependências reduzidas ao mínimo (apenas `next`,
  `react`, `react-dom` em runtime), sem segredos, sem dados pessoais,
  workflow com permissões mínimas (PR #22).
- Design System documentado com tokens únicos, acessibilidade
  (`aria-pressed`, `aria-live`, `:focus-visible`, `prefers-reduced-motion`)
  e regra de zero emojis na interface (PRs #16–#20, #25).
- Auditoria operacional final: 6 cenários de uso simulados em navegador real
  (fluxo completo, Modo Foco, término do cronômetro, toggles rápidos, nota
  máxima, avaliação parcial) e responsividade validada em 320/360/390/430 px.
- Licença CC BY-NC-SA 4.0; autoria de Andressa Souza (Afya Guanambi).

### Histórico detalhado

A evolução PR a PR (#6–#34) está registrada na seção "Histórico de Versões"
do [`DOCUMENTACAO_PROJETO.md`](DOCUMENTACAO_PROJETO.md).

[1.3.0]: https://github.com/andressamendes/SIMUOSCE-/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/andressamendes/SIMUOSCE-/compare/v1.1.0...v1.2.0
[1.0.0]: https://github.com/andressamendes/SIMUOSCE-/releases/tag/v1.0.0
