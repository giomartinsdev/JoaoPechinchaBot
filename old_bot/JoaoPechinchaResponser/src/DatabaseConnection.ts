import { Pool, PoolClient, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

class DatabaseConnection {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      password: process.env.PASSWORD || 'senha_segura',
      host: process.env.HOST || 'postgres',
      port: 5432,
      database: process.env.DATABASE || 'postgres'
    });
    console.log('Connected to database');
  }

  async runQuery(query: string, values: any[]): Promise<QueryResult> {
    const client: PoolClient = await this.pool.connect();
    try {
      const result: QueryResult = await client.query(query, values);
      return result;
    } finally {
      client.release();
    }
  }
}

export default DatabaseConnection;