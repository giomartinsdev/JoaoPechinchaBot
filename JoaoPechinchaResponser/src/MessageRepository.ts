import { ParsedData } from './MessageConsumer';
import { v4 as uuidv4 } from 'uuid';
import DatabaseConnection from './DatabaseConnection';
import { INSERT_PRODUCT_QUERY, SELECT_MEMBER_CONTACT_QUERY } from './queries';
import { EMOJIS, FORBIDDEN_WORDS } from './constants';

class MessageRepository {
  private databaseConnection: DatabaseConnection;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseConnection = databaseConnection;
  }

  async saveProductOnDB(parsedProduct: ParsedData) {
    parsedProduct.products = parsedProduct.products.map(product => product.trim());

    const emojiRegex = new RegExp(EMOJIS.join('|'), 'g');
    parsedProduct.products = parsedProduct.products.map(product => product.replace(emojiRegex, '').trim());

    const specialCharRegex = /[_*]/g;
    parsedProduct.products = parsedProduct.products.map(product => product.replace(specialCharRegex, '').trim());

    let forbiddenWordsInProduct = 0;
    parsedProduct.products.forEach(element => {
      if (!(FORBIDDEN_WORDS.some(word => element.toLowerCase().startsWith(word) || element.toLowerCase().includes(word)))) {
        forbiddenWordsInProduct += 1;
      }
    });

    let productName = '';
    let url = '';

    for (let i = parsedProduct.products.length - 1; i >= 0; i--) {
      const product = parsedProduct.products[i];
      if (!FORBIDDEN_WORDS.some(word => product.toLowerCase().startsWith(word) || product.toLowerCase().includes(word))) {
        productName = product.trim();
        break;
      }
    }

    url = parsedProduct.urls[0].trim();

    if (!productName) {
      return null;
    }

    const coupons = parsedProduct.coupons.length > 0 ? parsedProduct.coupons.join(', ') : null;

    const price = parsedProduct.prices.length > 0 ? parsedProduct.prices[parsedProduct.prices.length - 1].replace(/[^0-9,]/g, '').trim() : null;

    const uuid = uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const params = [uuid, createdAt, updatedAt, productName, '0', parsedProduct.message, url, coupons, `R$${price}`];
    const result = await this.databaseConnection.runQuery(INSERT_PRODUCT_QUERY, params);
    return result;
  }

  async discoverRequestsforTheProduct(parsedProduct: ParsedData) {
    parsedProduct.products = parsedProduct.products.map(product => product.trim());
    const emojiRegex = new RegExp(EMOJIS.join('|'), 'g');
    parsedProduct.products = parsedProduct.products.map(product => product.replace(emojiRegex, '').trim());
    const specialCharRegex = /[_*]/g;
    parsedProduct.products = parsedProduct.products.map(product => product.replace(specialCharRegex, '').trim());

    const validProducts = parsedProduct.products.filter(product =>
      !product.toLowerCase().startsWith('grupo') &&
      !product.toLowerCase().startsWith('produtos') &&
      !product.toLowerCase().includes('promoção')
    );

    if (validProducts.length === 0) {
      return null;
    }

    const productToUse = validProducts[0];

    const words = productToUse.split(' ').filter(word => word.trim() !== '');
    const productValue = parseFloat(parsedProduct.prices[0].replace('R$', '').replace(',', '.').trim());

    let query = `
    SELECT DISTINCT member_id
    FROM user_requests
    WHERE (${words.map((_, index) => `product_name ILIKE '%' || $${index + 1} || '%'`).join(' OR ')})
      AND product_value >= $${words.length + 1}
      AND (${words.map((_, index) => `addtional_info ILIKE '%' || $${index + 1} || '%'`).join(' OR ')})
      AND request_status = 'active'
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
    const params = [memberId];

    const result = await this.databaseConnection.runQuery(SELECT_MEMBER_CONTACT_QUERY, params);

    if (result.rows.length > 0) {
      return result.rows[0].user_contact;
    } else {
      return null;
    }
  }
}

export default MessageRepository;