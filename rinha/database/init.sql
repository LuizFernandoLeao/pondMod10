-- Criação das tabelas
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    limite INTEGER NOT NULL,
    saldo INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS transacoes (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    valor INTEGER NOT NULL,
    tipo CHAR(1) NOT NULL,
    descricao VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_cliente_id FOREIGN KEY (cliente_id) REFERENCES clientes (id)
);

-- Índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_transacoes_cliente_id ON transacoes (cliente_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_created_at ON transacoes (created_at DESC);

-- Inserir clientes conforme especificação
DO $$
BEGIN
    -- Limpar tabelas se necessário
    TRUNCATE TABLE transacoes CASCADE;
    TRUNCATE TABLE clientes CASCADE;
    
    -- Reiniciar sequências
    ALTER SEQUENCE clientes_id_seq RESTART WITH 1;
    ALTER SEQUENCE transacoes_id_seq RESTART WITH 1;
    
    -- Inserir os 5 clientes requeridos
    INSERT INTO clientes (nome, limite, saldo)
    VALUES
      ('Cliente 1', 100000, 0),
      ('Cliente 2', 80000, 0),
      ('Cliente 3', 1000000, 0),
      ('Cliente 4', 10000000, 0),
      ('Cliente 5', 500000, 0);
END;
$$;
