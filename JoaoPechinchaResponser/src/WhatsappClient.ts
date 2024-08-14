import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

class WhatsappClient {
  public client: Client;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
    });

    this.client.on('ready', () => {
      console.log('WhatsappWeb of responser client is running!');
    });

    this.client.on('qr', (qr) => {
      qrcode.generate(qr, { small: true });
    });

    this.client.initialize();
  }
}


export default WhatsappClient;