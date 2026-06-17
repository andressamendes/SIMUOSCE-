# Changelog — SIMUOSCE

Todas as mudanças relevantes do projeto são registradas neste arquivo.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o
versionamento segue [SemVer](https://semver.org/lang/pt-BR/).

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

A evolução PR a PR (#6–#29) está registrada na seção "Histórico de Versões"
do [`DOCUMENTACAO_PROJETO.md`](DOCUMENTACAO_PROJETO.md).

[1.0.0]: https://github.com/andressamendes/SIMUOSCE-/releases/tag/v1.0.0
