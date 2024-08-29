import { Client, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

class WhatsappHandler {
  public client: Client;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    this.client.on("ready", () => {
      console.log("WhatsappHandler client is running!");
    });

    this.client.on("qr", (qr) => {
      qrcode.generate(qr, { small: true });
    });

    this.client.initialize();
  }

  verifyIfIsDirectMessage(message: Message): boolean {
    return message.id.remote.split("@")[1] === "c.us";
  }
}

export default WhatsappHandler;
