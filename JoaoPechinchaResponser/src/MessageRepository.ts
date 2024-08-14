import { v4 as uuidv4 } from 'uuid';
import DatabaseConnection from "./DatabaseConnection";
import { ParsedData } from './MessageConsumer';

class MessageRepository {
  private databaseConnection: DatabaseConnection;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseConnection = databaseConnection;
  }

  async saveProductOnDB(parsedProduct: ParsedData) {
    const query = 'INSERT INTO products VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';

    const uuid = uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const product = parsedProduct.products[parsedProduct.products.length - 1] || null;
    const coupons = parsedProduct.coupons[parsedProduct.coupons.length - 1] || null;
    const url = parsedProduct.urls[parsedProduct.urls.length - 1] || null;
    const price = parsedProduct.prices[parsedProduct.prices.length - 1].trim() || null;

    const params = [uuid, createdAt, updatedAt, product, '0', parsedProduct.message, url, coupons, price];
    const result = await this.databaseConnection.runQuery(query, params);
    return result;
  }

  async discoverRequestsforTheProduct(parsedProduct: ParsedData) {
    const lastProduct = parsedProduct.products[parsedProduct.products.length - 1];
    if (!lastProduct) {
      return null;
    }

    const words = lastProduct.split(' ').filter(word => word.trim() !== '');
    const productValue = parseFloat(parsedProduct.prices[0].replace('R$', '').replace(',', '.').trim());

    let query = `
    SELECT DISTINCT member_id
    FROM user_requests
    WHERE (${words.map((_, index) => `product_name ILIKE '%' || $${index + 1} || '%'`).join(' OR ')})
      AND product_value >= $${words.length + 1}
      AND (${words.map((_, index) => `addtional_info ILIKE '%' || $${index + 1} || '%'`).join(' OR ')})
  `;
    
    const params = [...words, productValue];

    const result = await this.databaseConnection.runQuery(query, params);

    if (result.rows.length > 0) {
      return result.rows.map(row => row.member_id);
    } else {
      return null;
    }
  }

  async getMemberContact(memberId: string) {
    const query = 'SELECT user_contact FROM members WHERE id = $1';
    const params = [memberId];

    const result = await this.databaseConnection.runQuery(query, params);

    if (result.rows.length > 0) {
      return result.rows[0].user_contact;
    } else {
      return null;
    }
  }
}

export default MessageRepository