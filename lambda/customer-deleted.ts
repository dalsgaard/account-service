import { SQSEvent } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  QueryCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.TABLE_NAME!;
const CUSTOMER_ID_INDEX = 'customerId-index';

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

    for (const item of result.Items ?? []) {
      await client.send(
        new DeleteCommand({
          TableName: TABLE_NAME,
          Key: { id: item.id },
        }),
      );
    }
  }
};
