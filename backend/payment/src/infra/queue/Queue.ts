import amqp from "amqplib";

export default interface Queue {
  connect(): Promise<void>;
  publish(event: string, input: any): Promise<void>;
  consume(event: string, callback: Function): Promise<void>;
}

export class RabbitMQAdapter implements Queue {
  connection: any;
  channel: any;

  constructor() {}

  async connect(): Promise<void> {
    this.connection = await amqp.connect("amqp://localhost");
    this.channel = await this.connection.createChannel();
  }

  async publish(event: string, input: any): Promise<void> {
    // Garante que a fila existe antes de enviar
    await this.channel.assertQueue(event, { durable: true });
    this.channel.sendToQueue(event, Buffer.from(JSON.stringify(input)));
  }

  async consume(event: string, callback: Function): Promise<void> {
    // Garante que a fila existe antes de consumir
    await this.channel.assertQueue(event, { durable: true });
    this.channel.consume(event, async (message: any) => {
      const input = JSON.parse(message.content.toString());
      await callback(input);
      this.channel.ack(message);
    });
  }
}
