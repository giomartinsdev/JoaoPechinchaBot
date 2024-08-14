import { v4 as uuidv4 } from 'uuid';
import DatabaseConnection from './DatabaseConnection';
import MyMessage from './MessageInterface';
import {
  SELECT_MEMBER_ID_QUERY,
  INSERT_MEMBER_QUERY,
  SELECT_REQUEST_ID_QUERY,
  INSERT_USER_REQUEST_QUERY,
  UPDATE_USER_REQUEST_STATUS_QUERY
} from './queries';
import { PRODUCT_CANCEL_PATTERN } from './constants';

class MessageRepository {
  private databaseConnection: DatabaseConnection;

  constructor(databaseConnection: DatabaseConnection) {
    this.databaseConnection = databaseConnection;
  }

  async verifyIfIsMember(remoteId: string): Promise<boolean> {
    const query = SELECT_MEMBER_ID_QUERY;
    const params = [remoteId];
    const result = await this.databaseConnection.runQuery(query, params);

    if (result.rowCount == 0) {
      return false;
    }

    return true;
  }

  async saveMember(message: MyMessage) {
    const query = INSERT_MEMBER_QUERY;
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
    const query = SELECT_MEMBER_ID_QUERY;
    const params = [remoteId];
    const result = await this.databaseConnection.runQuery(query, params);

    return result.rows[0].id;
  }

  async getRequestId(productName: string, remoteId: string): Promise<string> {
    const memberId = await this.getMemberId(remoteId);
    const query = SELECT_REQUEST_ID_QUERY;
    const params = [productName, memberId];
    const result = await this.databaseConnection.runQuery(query, params);
    return result.rows[0].id;
  }

  async extractProduct(messageBody: string): Promise<string | null> {
    const match = messageBody.match(PRODUCT_CANCEL_PATTERN);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
    return null;
  }

  async saveUserRequest(message: any): Promise<boolean> {
    try {
      const coreInfo = await this.getCoreInformation(message);
      const query = INSERT_USER_REQUEST_QUERY;

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
      return false;
    }
  }

  async getCoreInformation(message: MyMessage): Promise<CoreInformation> {
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
      const product = await this.extractProduct(message.body);
      const memberId = await this.getMemberId(message.id.remote);
      const query = UPDATE_USER_REQUEST_STATUS_QUERY;
      const params = ['cancelled', memberId, product];
      const result = await this.databaseConnection.runQuery(query, params);
      return true;

    } catch (error) {
      console.error('Failed to cancel user request:', error);
      return false;
    }
  }
}

interface CoreInformation {
  product: string;
  additionalInfo: string[];
  value: number;
}

export default MessageRepository;