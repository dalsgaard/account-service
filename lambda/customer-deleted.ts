import { SQSEvent } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { Logger } from '@aws-lambda-powertools/logger';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.TABLE_NAME!;
const CUSTOMER_ID_INDEX = 'customerId-all-index';
const logger = new Logger({ serviceName: 'account-service' });

export const handler = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    const sns = JSON.parse(record.body);
    const { id: customerId } = JSON.parse(sns.Message);

    const result = await client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: CUSTOMER_ID_INDEX,
        KeyConditionExpression: 'customerId = :customerId',
        ExpressionAttributeValues: { ':customerId': customerId },
      }),
    );

    const accounts = result.Items ?? [];
    logger.info('Deleting accounts for deleted customer', {
      customerId,
      count: accounts.length,
    });

    for (const item of accounts) {
      await client.send(
        new DeleteCommand({
          TableName: TABLE_NAME,
          Key: { id: item.id },
        }),
      );
      logger.info('Account deleted', { accountId: item.id, customerId });
    }
  }
};
