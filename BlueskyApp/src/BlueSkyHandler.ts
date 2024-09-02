import { Agent, CredentialSession } from '@atproto/api';
import dotenv from 'dotenv';
dotenv.config();

export class BlueSkyHandler {
  private session: CredentialSession;
  private agent: Agent;
  constructor() {
    this.session = new CredentialSession(
      new URL('https://bsky.social')
    )
    this.agent = new Agent(this.session)
  }

  async login() {
    await this.session.login({
      identifier: 'hubpromo.bsky.social',
      password: 'giovannietataufodas'
    });
  }

  async createPost(text: string, createdAt: string) {
    await this.agent.post({
      text,
      createdAt
    });
  }

}