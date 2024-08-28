import { MongoClient, Db } from 'mongodb';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class MongoDBHandler {
  private static client: MongoClient;
  private static db: Db;

  static async connect() {
    console.log("connecting to mongodb...");
    const uri = process.env.MONGODB_URI || "mongodb_uri";
    this.client = new MongoClient(uri);
    try {
      await this.client.connect();
      this.db = this.client.db(process.env.MONGODB_DB_NAME || "db_name");
      console.log("Conectado ao MongoDB!");
    } catch (error) {
      console.error("err establishing connection to mongodb:", error);
    }
  }

  static async disconnect() {
    if (this.client) {
      try {
        await this.client.close();
        console.log("mongodb disconnected!");
      } catch (error) {
        console.error("err disconnecting mongodb:", error)
      }
    } else {
      console.log("no one active connection with mongodb to disconnect.");
    }
  }

  static async getDocument(collectionName: string, query: object) {
    try {
      const collection = this.db.collection(collectionName);
      const result = await collection.find(query).toArray();
      return result;
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      throw error;
    }
  }

  static async insertDocument(collectionName: string, document: object) {
    try {
      const collection = this.db.collection(collectionName);
      const result = await collection.insertOne(document);
      return result;
    } catch (error) {
      console.error("Erro ao inserir documento:", error);
      throw error;
    }
  }

  static async updateDocument(collectionName: string, query: object, newValues: object) {
    try {
      const collection = this.db.collection(collectionName);
      const result = await collection.updateOne(query, { $set: newValues });
      return result;
    } catch (error) {
      console.error("Erro ao atualizar documento:", error);
      throw error;
    }
  }

  static async deleteDocument(collectionName: string, query: object) {
    try {
      const collection = this.db.collection(collectionName);
      const result = await collection.deleteOne(query);
      return result;
    } catch (error) {
      console.error("Erro ao deletar documento:", error);
      throw error;
    }
  }
}

export class PostgreHandler {
  private static client: Client;
  private static credentials: {
    user: string,
    host: string,
    database: string,
    password: string,
    port: number
  };

  constructor() {
    PostgreHandler.credentials = {
      user: process.env.PG_USER || 'postgres',
      host: process.env.PG_HOST || 'localhost',
      database: process.env.PG_DATABASE || 'postgres',
      password: process.env.PG_PASSWORD || 'senha_segura',
      port: parseInt(process.env.PG_PORT || '5432') 
    };
  }

  static async connect() {
    console.log("connecting to pgsql...");
    this.client = new Client(this.credentials);
    try {
      await this.client.connect();
      console.log("connected to mongodb!");
    } catch (error) {
      console.error("err establishing connection to pgsql:", error);
    }
  }

  static async disconnect() {
    if (this.client) {
      try {
        await this.client.end();
        console.log("mongodb disconnected!");
      } catch (error) {
        console.error("err disconnecting pgsql: ", error);
      }
    } else {
      console.log("no one active connection with pgsql to disconnect.");
    }
  }

  static async executeQuery(query: string, params: undefined[]) {
    try {
      const res = await this.client.query(query, params);
      return res.rows;
    } catch (error) {
      console.error("err running query:", error);
      throw error;
    }
  }

}