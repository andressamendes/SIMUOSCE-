# SIMUOSCE — Aplicação

PWA mobile-first para suporte digital às avaliações práticas do OSCE.
Visão geral, créditos e licença: [README da raiz do repositório](../README.md).

## Documentação

| Documento | Conteúdo |
|---|---|
| [`DOCUMENTACAO_PROJETO.md`](DOCUMENTACAO_PROJETO.md) | Arquitetura, regras de negócio, baremas, guias de manutenção |
| [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) | Tokens, tipografia, componentes e regras de consistência visual |
| [`CHANGELOG.md`](CHANGELOG.md) | Histórico de versões |

## Desenvolvimento

```bash
npm ci
npm run dev      # desenvolvimento local (http://localhost:3000)
npm run build    # build estático em out/ (valida os baremas automaticamente)
npm run lint     # ESLint
```

O build executa a validação estrutural dos baremas (`src/lib/validate.ts`) —
dados inconsistentes interrompem a publicação.

## Deploy

Push na `main` dispara o GitHub Actions (`.github/workflows/deploy.yml`), que
publica o build estático no GitHub Pages com `NEXT_PUBLIC_BASE_PATH=/SIMUOSCE-`.
A cada deploy com mudança de conteúdo, incrementar a versão do cache em
`public/sw.js`.
