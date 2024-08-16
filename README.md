# JoaoPechincha

Este é um projeto de bot de WhatsApp para aviso de promoções desenvolvido em [Node.js](https://nodejs.org/) utilizando a biblioteca [WhatsappWebJS](https://docs.wwebjs.dev) para interagir com a API do WhatsApp e a tecnologia [Kafka](https://kafka.apache.org/) para mensageria.

Este é um bot de Whatsapp para aviso e rastreio de promoções de produtos através de grupos no Whatsapp ou poll. Desenvolvido em [Node.js](https://nodejs.org/) com a biblioteca [WhatsappWebJS](https://docs.wwebjs.dev) utilizando mensageria [Kafka](https://kafka.apache.org/), containers [Docker](https://docs.docker.com/compose/) e banco [PostgreSQL](https://www.postgresql.org/download/
).
## Pré-requisitos

Docker e uma conexão estável

## Uso

1. Crie um .env na raiz do projeto que seja composto por 
```
POLL_URL='{{URL POLL}}' (caso tenha)
KAFKA_TOPIC=WHATSAPP-RESPONSES
POLL_INTERVAL=300000
GROU_ID=TEST-GROUP

DB_USER={{DBUSER}}
PASSWORD={{SENHADOBANCO}}
HOST=postgres
DATABASE={{DATABASE}}
```
1. Inicie o bot de WhatsApp: `docker compose up --build`.
2. Escaneie o código QR exibido no terminal usando o WhatsApp em seu dispositivo móvel.
2.1(tip). Caso algum dos servicos de qrcode nao funcione vocÊ pode dar restart apenas no container do respectivo container. 
3. Entre em grupos para analise das mensagens ou configure um POLL

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request ou mandar um pix :p.

## Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).
