Here is your README content translated into English:

---

# JoaoPechincha

This is a WhatsApp bot project for promotion alerts developed in [Node.js](https://nodejs.org/) using the [WhatsappWebJS](https://docs.wwebjs.dev) library to interact with the WhatsApp API and [Kafka](https://kafka.apache.org/) for messaging.

This bot notifies and tracks product promotions via WhatsApp groups or polls. Developed in [Node.js](https://nodejs.org/) with the [WhatsappWebJS](https://docs.wwebjs.dev) library, it uses [Kafka](https://kafka.apache.org/) for messaging, [Docker](https://docs.docker.com/compose/) for containers, and [PostgreSQL](https://www.postgresql.org/download/) as the database.

## Prerequisites

Docker and a stable internet connection.

## Usage

1. Create a .env file at the root of the project with the following content:
   ```
   POLL_URL='{{POLL URL}}' (if applicable)
   KAFKA_TOPIC=WHATSAPP-RESPONSES
   POLL_INTERVAL=300000
   GROUP_ID=TEST-GROUP

   DB_USER={{DBUSER}}
   PASSWORD={{DATABASE_PASSWORD}}
   HOST=postgres
   DATABASE={{DATABASE}}
   ```
2. Start the WhatsApp bot: `docker compose up --build`.
3. Scan the QR code displayed in the terminal using WhatsApp on your mobile device.
   3.1 (Tip) If any of the QR code services do not work, you can restart only the respective container.
4. Join groups to analyze messages or configure a POLL.

## Contribution

Contributions are welcome! Feel free to open an issue, submit a pull request, or even send a Pix :p.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

Let me know if you’d like this saved directly into your README.md file or if you want any adjustments!
