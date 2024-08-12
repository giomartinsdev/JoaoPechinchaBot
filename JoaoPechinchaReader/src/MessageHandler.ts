import MessageRepository from './MessageRepository';
import DatabaseConnection from './DatabaseConnection';
import MyMessage from './MessageInterface';


class MessageHandler {
  private messageRepository: MessageRepository;
  private databaseConnection: DatabaseConnection;

  constructor(messageRepository: MessageRepository, databaseConnection: DatabaseConnection) {
    this.messageRepository = messageRepository;
    this.databaseConnection = databaseConnection;
  }

  private isProductMessage(message: string): boolean {
    const productPattern = /Produto:\s*\w+/;
    return productPattern.test(message);
  }

  private cancelRequest(message: string): boolean { 
    const cancelPattern = /Cancelar/;
    return cancelPattern.test(message);

  }

  private async isMember(message: MyMessage): Promise<boolean> {
    const isMember: boolean = await this.messageRepository.verifyIfIsMember(message.id.remote);
    return isMember
  }

  public async processMessage(message: MyMessage): Promise<void> {
    if (!await this.isMember(message)) {
      await this.sendResponse(message, "Por favor, torne-se um membro para continuar.");
      return;
    }

    if (this.cancelRequest(message.body)) {
      if (!await this.messageRepository.cancelRequest(message)) {
        await this.sendResponse(message, "Erro ao cancelar solicitacão de rastreio de produto.");
      }
      await this.sendResponse(message, "Solicitação de rastreio de produto cancelada.");

      return;
    }

    if (!this.isProductMessage(message.body)) {
      const productString: string = 'Produto: \n Informacoes adicionais: \n Valor máximo: \n';
      await this.sendResponse(message, `Por favor, informe o texto necessário para cadastrar um produto. ${productString}`);
      return;
    }

    const userRequest: boolean = await this.messageRepository.saveUserRequest(message);
    if (!userRequest) {
      await this.sendResponse(message, "Erro ao realizar solicitação.");
    }
    await this.sendResponse(message, "Solicitação realizada com sucesso.");

  }

  private async sendResponse(message: MyMessage, response: string): Promise<void> {
    console.log(`Enviando resposta para ${message.id.remote}: ${response}`);
  }
}

export default MessageHandler;


