# Rinha de Backend 2024/Q1 - Créditos e Débitos

## Sobre o projeto

Este projeto é uma implementação da [Rinha de Backend 2024/Q1](https://github.com/zanfranceschi/rinha-de-backend-2024-q1) que consiste em uma API para gestão de transações financeiras (créditos e débitos) com alto volume de requisições.

## Arquitetura

A solução foi construída utilizando:

- **Node.js com Express**: Escolhido pela alta performance em I/O e facilidade de escrita de APIs REST
- **PostgreSQL**: Banco de dados relacional robusto para armazenar os dados de clientes e transações
- **NGINX**: Para balanceamento de carga entre as duas instâncias da API
- **Docker e Docker Compose**: Para conteinerização e orquestração da aplicação

### Diagrama da Arquitetura

```
┌─────────────┐       ┌─────────────┐
│             │       │             │
│   Cliente   │──────▶│    NGINX    │
│             │       │             │
└─────────────┘       └──────┬──────┘
                             │
                             ▼
         ┌─────────────┬─────────────┐
         │             │             │
         │    API 1    │    API 2    │
         │             │             │
         └─────┬───────┴───────┬─────┘
               │               │
               │               │
               ▼               ▼
         ┌─────────────────────────────┐
         │                             │
         │        PostgreSQL           │
         │                             │
         └─────────────────────────────┘
```

## Estratégias de implementação

### 1. Segurança

- Validação rigorosa dos dados de entrada
- Uso de variáveis de ambiente para configurações sensíveis
- Isolamento dos serviços em contêineres Docker

### 2. Integridade dos dados

- Uso de transações SQL para garantir que operações de débito e crédito sejam atômicas
- Validação de limites de crédito no momento da transação
- Restrições de chave estrangeira no banco de dados

### 3. Disponibilidade

- Múltiplas instâncias da API para alta disponibilidade
- Balanceamento de carga para distribuir requisições
- Gerenciamento de conexões de banco de dados com pool de conexões

### 4. Escalabilidade

- Arquitetura horizontalmente escalável, permitindo adição de mais instâncias API conforme necessário
- Uso eficiente de recursos com limites de CPU e memória configurados
- Configuração do PostgreSQL otimizada para alto volume de transações

### 5. Performance

- Otimização do banco de dados com índices estratégicos
- Configuração do PostgreSQL para performance (`checkpoint_timeout`, `max_wal_size`, `synchronous_commit=off`)
- Minimização de E/S desnecessária (desativação de logs de acesso no NGINX)
- Pool de conexões para reutilização eficiente das conexões com o banco de dados

### 6. Manutenibilidade

- Código organizado e comentado
- Separação clara de responsabilidades
- Uso de arquivos de ambiente para configuração

### 7. Testabilidade

- Estrutura que permite testes de unidade e integração
- Interfaces claras e bem definidas
- Possibilidade de mockar dependências externas

## Como executar

### Pré-requisitos

- Docker
- Docker Compose

### Execução

```bash
# Baixar e iniciar os containers
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Acessar a API
# Extrato: GET http://localhost:9999/clientes/1/extrato
# Transação: POST http://localhost:9999/clientes/1/transacoes
```

## Dependências

- Node.js 18+
- Express 4.18+
- PostgreSQL 15+
- NGINX
