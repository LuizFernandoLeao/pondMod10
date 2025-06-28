const express = require('express');
require('express-async-errors');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Carrega variáveis de ambiente
dotenv.config();

// Configuração do banco de dados
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'rinha',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20, // limite de conexões no pool
  idleTimeoutMillis: 30000 // tempo máximo de inatividade
});

// Função para conectar ao banco
const conectarAoBanco = async () => {
  try {
    await pool.connect();
    console.log('Conectado ao banco de dados PostgreSQL');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};

// Função para inicializar a aplicação
const inicializarApp = async () => {
  // Conectar ao banco de dados
  await conectarAoBanco();
  
  const app = express();
  
  // Middlewares
  app.use(express.json());
  app.use(cors());
  
  // Rota para criar uma transação
  app.post('/clientes/:id/transacoes', async (req, res) => {
    const { id } = req.params;
    const { valor, tipo, descricao } = req.body;
    
    // Validações
    if (!valor || !Number.isInteger(valor) || valor <= 0) {
      return res.status(422).json({ erro: 'Valor inválido' });
    }
    
    if (!tipo || (tipo !== 'c' && tipo !== 'd')) {
      return res.status(422).json({ erro: 'Tipo inválido' });
    }
    
    if (!descricao || typeof descricao !== 'string' || 
        descricao.length < 1 || descricao.length > 10) {
      return res.status(422).json({ erro: 'Descrição inválida' });
    }
    
    // Iniciar transação
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Verificar se cliente existe
      const clienteResult = await client.query(
        'SELECT * FROM clientes WHERE id = $1',
        [id]
      );
      
      if (clienteResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }
      
      const cliente = clienteResult.rows[0];
      const limite = cliente.limite;
      let saldo = cliente.saldo;
      
      // Para transações do tipo débito
      if (tipo === 'd') {
        if (saldo - valor < -limite) {
          await client.query('ROLLBACK');
          return res.status(422).json({ erro: 'Saldo insuficiente' });
        }
        saldo -= valor;
      } else {
        // Para transações do tipo crédito
        saldo += valor;
      }
      
      // Atualizar saldo do cliente
      await client.query(
        'UPDATE clientes SET saldo = $1 WHERE id = $2',
        [saldo, id]
      );
      
      // Registrar transação
      await client.query(
        'INSERT INTO transacoes (cliente_id, valor, tipo, descricao) VALUES ($1, $2, $3, $4)',
        [id, valor, tipo, descricao]
      );
      
      await client.query('COMMIT');
      
      // Retornar resultado
      return res.status(200).json({
        limite: limite,
        saldo: saldo
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao processar transação:', error);
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    } finally {
      client.release();
    }
  });
  
  // Rota para obter extrato
  app.get('/clientes/:id/extrato', async (req, res) => {
    const { id } = req.params;
    
    try {
      // Verificar se cliente existe
      const clienteResult = await pool.query(
        'SELECT * FROM clientes WHERE id = $1',
        [id]
      );
      
      if (clienteResult.rows.length === 0) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }
      
      const cliente = clienteResult.rows[0];
      
      // Buscar últimas transações (máximo 10)
      const transacoesResult = await pool.query(
        'SELECT valor, tipo, descricao, created_at as realizada_em ' +
        'FROM transacoes WHERE cliente_id = $1 ' +
        'ORDER BY created_at DESC LIMIT 10',
        [id]
      );
      
      const dataExtrato = new Date().toISOString();
      
      // Montar resposta
      const extrato = {
        saldo: {
          total: cliente.saldo,
          data_extrato: dataExtrato,
          limite: cliente.limite
        },
        ultimas_transacoes: transacoesResult.rows
      };
      
      return res.status(200).json(extrato);
      
    } catch (error) {
      console.error('Erro ao obter extrato:', error);
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  });
  
  // Middleware para tratar erros
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  });
  
  // Iniciar servidor
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

inicializarApp().catch(console.error);
