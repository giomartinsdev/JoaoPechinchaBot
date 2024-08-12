import { v4 as uuidv4 } from 'uuid';
import DatabaseConnection from "./DatabaseConnection";
import MyMessage from './MessageInterface';

class MessageRepository {
  private databaseConnection: DatabaseConnection;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseConnection = databaseConnection;
  }

  async verifyIfIsMember(remoteId: string): Promise<boolean> {
    const query = 'SELECT id FROM members WHERE user_contact = $1';
    const params = [remoteId];
    const result = await this.databaseConnection.runQuery(query, params);

    if (result.rowCount == 0) {
      return false;
    }

    return true;
  }
  
  async saveMember(message: MyMessage) {;
    const query: string = 'INSERT INTO members VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const fullNumber = message.id.remote.split('@')[0];
    const ddd = fullNumber.slice(0, 4);
    const cellphone = fullNumber.substring(4);

    const uuid = uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const params = [uuid, createdAt, updatedAt, ddd, cellphone, message.id.remote, message._data.notifyName];
    const result = await this.databaseConnection.runQuery(query, params);
    return result;
  }

  async getMemberId(remoteId: string): Promise<string> { 
    const query = 'SELECT id FROM members WHERE user_contact = $1';
    const params = [remoteId];
    const result = await this.databaseConnection.runQuery(query, params);

    return result.rows[0].id;
  };

  async getRequestId(product_name: string, remoteId: string): Promise<string> {
    const memberId = this.getMemberId(remoteId);
    const query = 'SELECT id FROM user_requests WHERE product_name = $1 AND member_id = $2';
    const params = [product_name, memberId];
    const result = await this.databaseConnection.runQuery(query, params);
    return result.rows[0].id;
   };

  async extractProduct(messageBody: string): Promise<string | null> {
    const productPattern = /Cancelar:\s*(\w+)/i; 
    const match = messageBody.match(productPattern);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
    return null;
  }
  
  async saveUserRequest(message: any): Promise<boolean> { 
    try {
      const coreInfo = await this.getCoreInformation(message);
      const query = 'INSERT INTO user_requests VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';
      
      const memberId = await this.getMemberId(message.id.remote);
      const uuid = uuidv4();
      const createdAt = new Date().toISOString();
      const updatedAt = new Date().toISOString();
      
      const params = [uuid, createdAt, updatedAt, coreInfo.product, '0', coreInfo.value, memberId, 'active', coreInfo.additionalInfo];
      const result = await this.databaseConnection.runQuery(query, params);
      
      console.log('User request saved:', result.rowCount);
      return true;

    } catch (error) {
      console.error('Failed to save user request:', error);
      return false
    }
  };

  async getCoreInformation(message: MyMessage): Promise<coreInformation> {
    const coreInformation = message.body.split('\n').map(line => line.split(':').map(part => part.trim().toLowerCase()));
    const coreObject = {
      'product': coreInformation[0][1],
      'additionalInfo': coreInformation[1][1].split(','),
      'value': isNaN(parseInt(coreInformation[2][1])) ? 0 : parseInt(coreInformation[2][1])
    };

    return coreObject;

  }

  async cancelRequest(message: MyMessage): Promise<boolean> {
    try {
      const product = await this.extractProduct(message.body)
      const memberId = await this.getMemberId(message.id.remote)
      const query = 'UPDATE user_requests SET request_status = $1 WHERE member_id = $2 AND product_name = $3';
      const params = ['cancelled', memberId, product];
      const result = await this.databaseConnection.runQuery(query, params);
      return true

    } catch (error) {
      console.error('Failed to cancel user request:', error);
      return false
    }
  }

}

interface coreInformation {
  product: string;
  additionalInfo: string[];
  value: number;
}

export default MessageRepository;