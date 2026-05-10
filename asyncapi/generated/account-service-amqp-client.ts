// Generated — do not edit manually

import amqplib from "amqplib";
import type { AccountServiceClient } from "./account-service";
export type AccountServiceAmqpClientConfig = {
    url: string;
    exchange: string;
};
export async function createAccountServiceAmqpClient(config: AccountServiceAmqpClientConfig): Promise<AccountServiceClient & {
    close: () => Promise<void>;
}> {
    const connection = await amqplib.connect(config.url);
    const channel = await connection.createConfirmChannel();
    await channel.assertExchange(config.exchange, "topic", { durable: true });
    return {
        sendAccountCreated: async (accountCreated) => {
            channel.publish(config.exchange, "account-created", Buffer.from(JSON.stringify(accountCreated)));
            await channel.waitForConfirms();
        },
        sendAccountUpdated: async (accountUpdated) => {
            channel.publish(config.exchange, "account-updated", Buffer.from(JSON.stringify(accountUpdated)));
            await channel.waitForConfirms();
        },
        sendAccountDeleted: async (accountDeleted) => {
            channel.publish(config.exchange, "account-deleted", Buffer.from(JSON.stringify(accountDeleted)));
            await channel.waitForConfirms();
        },
        close: async () => {
            await connection.close();
        }
    };
}
