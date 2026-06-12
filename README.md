# SIMUOSCE

Progressive Web App (PWA) mobile-first para suporte digital às avaliações práticas do **OSCE** (Objective Structured Clinical Examination). Substitui os baremas em papel com marcação de critérios em tempo real, cronômetro inteligente por complexidade da estação e resumo automático de desempenho — com funcionamento offline.

**Aplicação:** https://andressamendes.github.io/SIMUOSCE-/

---

## Stack

Next.js 14 (App Router, `output: 'export'`) · TypeScript · Tailwind CSS v4 · GitHub Pages · Service Worker (offline-first)

## Documentação

| Documento | Conteúdo |
|---|---|
| [`simuosce-app/DOCUMENTACAO_PROJETO.md`](simuosce-app/DOCUMENTACAO_PROJETO.md) | Arquitetura, regras de negócio, baremas, guias de manutenção |
| [`simuosce-app/DESIGN_SYSTEM.md`](simuosce-app/DESIGN_SYSTEM.md) | Tokens, tipografia, componentes e regras de consistência visual |
| [`simuosce-app/CHANGELOG.md`](simuosce-app/CHANGELOG.md) | Histórico de versões (v1.0.0 — primeira versão institucional estável) |

## Desenvolvimento

```bash
cd simuosce-app
npm ci
npm run dev      # desenvolvimento local
npm run build    # build estático (valida os baremas automaticamente)
```

O build executa validação estrutural dos baremas (`src/lib/validate.ts`) — dados inconsistentes interrompem a publicação.

---

## Créditos Institucionais

**Centro Acadêmico Sérgio Ferreira**
**Afya Faculdade de Ciências Médicas de Guanambi**

## Autoria

**Andressa Souza**
Aluna do Curso de Medicina
Afya Faculdade de Ciências Médicas de Guanambi

## Licença

[CC BY-NC-SA 4.0](LICENSE) — uso acadêmico e educacional permitido e incentivado; atribuição obrigatória; uso comercial não permitido.
