# Tesouraria SaaS Demo API

API de demonstração para o sistema de tesouraria SaaS.

## Características

- **Framework**: NestJS + TypeScript
- **Modo**: Somente Leitura (Read-Only)
- **Dados**: Mockados localmente
- **CORS**: Habilitado para `http://localhost:4200`
- **Porta**: 3000
- **Prefixo Global**: `/api`

## Endpoints Disponíveis

### Health Check
```
GET http://localhost:3000/api/health
```

### Dashboard
```
GET http://localhost:3000/api/dashboard
```

### Transações
```
GET http://localhost:3000/api/transactions
GET http://localhost:3000/api/transactions?type=income
GET http://localhost:3000/api/transactions?type=expense
```

### Balancete
```
GET http://localhost:3000/api/balance-sheet
```

### Relatórios
```
GET http://localhost:3000/api/reports
```

## Instalação

```bash
npm install
```

## Executar em Desenvolvimento

```bash
npm run start:dev
```

A API estará disponível em: `http://localhost:3000/api`

## Build

```bash
npm run build
```

## Testes

```bash
npm test
```

## Estrutura do Projeto

```
src/
├── common/
│   ├── data/
│   │   └── mock-data.ts          # Dados mockados
│   └── interfaces/
│       └── transaction.interface.ts  # Interfaces TypeScript
├── health/
│   ├── health.controller.ts
│   └── health.module.ts
├── dashboard/
│   ├── dashboard.controller.ts
│   ├── dashboard.service.ts
│   └── dashboard.module.ts
├── transactions/
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   └── transactions.module.ts
├── balance-sheet/
│   ├── balance-sheet.controller.ts
│   ├── balance-sheet.service.ts
│   └── balance-sheet.module.ts
├── reports/
│   ├── reports.controller.ts
│   ├── reports.service.ts
│   └── reports.module.ts
├── app.module.ts
└── main.ts
```

## Observações

- ✅ Sem banco de dados
- ✅ Sem Prisma
- ✅ Sem autenticação/JWT
- ✅ Sem endpoints de escrita (POST, PUT, DELETE)
- ✅ Sem Docker
- ✅ Sem Swagger (por enquanto)
- ✅ Dados 100% mockados localmente
- ✅ CORS configurado para frontend Angular

## Próximos Passos

Para integração com banco de dados real:
1. Adicionar Prisma ou TypeORM
2. Configurar banco de dados (PostgreSQL, MySQL, etc.)
3. Implementar autenticação JWT
4. Adicionar endpoints de escrita
5. Adicionar validações com class-validator
6. Adicionar documentação Swagger
