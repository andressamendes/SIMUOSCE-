# Checklist — Implementação de Novo Período

Use este checklist ao adicionar um novo período ao SIMUOSCE.
Consulte a seção "Como Adicionar um Novo Período" em `DOCUMENTACAO_PROJETO.md` para o passo a passo completo.

---

## Dados do Barema

- [ ] Barema oficial recebido e conferido
- [ ] Todas as estações identificadas (nome + número)
- [ ] Todos os critérios extraídos com pontuações individuais
- [ ] Soma dos scores de cada estação = `maxScore` (10,0) — verificar manualmente antes do build
- [ ] IDs definidos no padrão `pN-eK` (estação) e `pN-eK-cJ` (critério)
- [ ] Nenhum ID duplicado em relação aos períodos já implementados

## Linguagem dos Critérios

- [ ] Todos os critérios redigidos no **pretérito perfeito** (ex.: "Higienizou as mãos")
- [ ] Cada critério começa com **verbo de ação** (observacional)
- [ ] Nenhum critério com linguagem prescritiva ("deve", "precisa")
- [ ] Nenhum critério com lacunas ou texto incompleto

## Código

- [ ] Dados adicionados em `src/data/baremas.ts`
- [ ] Tema visual adicionado em `src/lib/themes.ts` (entrada `periodThemes[N]`)
- [ ] Classes CSS adicionadas em `src/app/globals.css` (`.bg-periodN`, `.check-glow-periodN`)
- [ ] Período adicionado ao array `periods` em `src/app/page.tsx` (label + subtitle)
- [ ] `public/sw.js`: `./periodo/N/` adicionado ao precache
- [ ] `public/sw.js`: versão do cache incrementada (`simuosce-vX`)

## Build e Validação Automática

- [ ] `npm run build` executado sem erros
- [ ] `validateBaremas` não reportou nenhuma inconsistência
- [ ] Todas as estações do novo período aparecem no output do build (`/periodo/N/estacao/...`)

## Cronômetro

- [ ] Confirmado que a duração de cada estação está correta:
  - 5–10 critérios → 3 min
  - 11–15 critérios → 4 min
  - > 15 critérios → 5 min

## Responsividade

- [ ] Tela inicial (Home) exibe o botão do novo período corretamente
- [ ] Lista de estações do período renderiza em 320 px, 390 px e 430 px
- [ ] Tela de avaliação (modo normal) funciona em todos os breakpoints
- [ ] Modo Foco funciona em todos os breakpoints

## Resumo Final

- [ ] Nota é exibida corretamente
- [ ] Anel de percentual animado correto
- [ ] Badge de desempenho (Excelente / Bom / Atenção) aparece conforme esperado
- [ ] Critérios não realizados listados corretamente
- [ ] Botões "Nova Avaliação" e "Voltar às Estações" funcionam

## Modo Foco

- [ ] Critérios marcam e desmarcam corretamente
- [ ] Timer segue os estados visual (normal → warn → danger)
- [ ] Estado da avaliação é preservado ao sair e retornar do Modo Foco
- [ ] Botão "Concluir" abre o Resumo Final com dados corretos

## Barra de Progresso

- [ ] Barra de progresso atualiza em tempo real no modo normal
- [ ] Barra de progresso atualiza em tempo real no Modo Foco

## Visual / Design System

- [ ] Cores do tema são consistentes (header, footer, checkboxes, badge, botões)
- [ ] Sem emojis na interface
- [ ] Sem textos quebrados ou truncados

## Documentação

- [ ] `DOCUMENTACAO_PROJETO.md` atualizado (versão, distribuição de estações)
- [ ] `CHANGELOG.md` atualizado com a nova versão (SemVer)
- [ ] Inconsistências aritméticas do barema (se houver) registradas na seção de correções

## Publicação

- [ ] Commit com mensagem descritiva
- [ ] PR aberto para `main`
- [ ] Build do GitHub Actions concluído com sucesso
- [ ] Deploy no GitHub Pages verificado
- [ ] Navegação completa testada na URL de produção
