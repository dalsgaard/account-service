// Generated — do not edit manually

import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { AccountServiceClient } from "./account-service";
export type AccountServiceClientConfig = {
    accountCreatedTopicArn: string;
    accountUpdatedTopicArn: string;
    accountDeletedTopicArn: string;
};
export function createAccountServiceClient(config: AccountServiceClientConfig): AccountServiceClient {
    const sns = new SNSClient({});
    return {
        sendAccountCreated: async (accountCreated) => {
            await sns.send(new PublishCommand({
                TopicArn: config.accountCreatedTopicArn,
                Message: JSON.stringify(accountCreated)
            }));
        },
        sendAccountUpdated: async (accountUpdated) => {
            await sns.send(new PublishCommand({
                TopicArn: config.accountUpdatedTopicArn,
                Message: JSON.stringify(accountUpdated),
                Subject: "account.updated"
            }));
        },
        sendAccountDeleted: async (accountDeleted) => {
            await sns.send(new PublishCommand({
                TopicArn: config.accountDeletedTopicArn,
                Message: JSON.stringify(accountDeleted),
                Subject: "account.deleted"
            }));
        }
    };
}
