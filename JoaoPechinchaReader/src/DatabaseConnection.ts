import { Pool, PoolClient, QueryResult } from 'pg';

class DatabaseConnection {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: 'postgres',
      password: 'senha_segura',
      host: 'postgres',
      port: 5432,
      database: 'postgres',
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