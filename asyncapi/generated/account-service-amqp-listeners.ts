// Generated — do not edit manually

import amqplib from "amqplib";
import type { CustomerDeleted } from "./account-service";

export type AmqpListenerConfig = {
  url: string;
  exchange: string;
  queue: string;
};

/** Cascade-delete all accounts belonging to the deleted customer */
export async function createCustomerDeletedAmqpListener(config: AmqpListenerConfig, callback: (message: CustomerDeleted) => Promise<void>): Promise<{ close(): Promise<void> }> {
  const connection = await amqplib.connect(config.url);
  const channel = await connection.createChannel();
  await channel.assertExchange(config.exchange, "topic", { durable: true });
  await channel.assertQueue(config.queue, { durable: true });
  await channel.bindQueue(config.queue, config.exchange, "customer-deleted");
  channel.consume(config.queue, async (msg) => {
    if (!msg) return;
    await callback(JSON.parse(msg.content.toString()));
    channel.ack(msg);
  });
  return { close: async () => { await connection.close(); } };
}