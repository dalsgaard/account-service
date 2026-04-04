import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
  ScanCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { Logger } from '@aws-lambda-powertools/logger';
import { randomUUID } from 'crypto';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(s: string): boolean {
  return UUID_RE.test(s);
}

const dynamo = new DynamoDBClient({});
const sns = new SNSClient({});
const TABLE_NAME = process.env.TABLE_NAME!;
const CREATED_TOPIC_ARN = process.env.CREATED_TOPIC_ARN!;
const DELETED_TOPIC_ARN = process.env.DELETED_TOPIC_ARN!;
const logger = new Logger({ serviceName: 'account-service' });

const app = new Hono();

app.get('/accounts', async (c) => {
  const customerId = c.req.query('customerId');

  if (customerId) {
    if (!isUuid(customerId)) return c.json({ error: 'Invalid customerId' }, 400);
    const result = await dynamo.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'customerId-index',
        KeyConditionExpression: 'customerId = :customerId',
        ExpressionAttributeValues: marshall({ ':customerId': customerId }),
      }),
    );
    const accounts = (result.Items ?? []).map((item) => unmarshall(item));
    logger.info('Listed accounts by customer', { customerId, count: accounts.length });
    return c.json(accounts);
  }

  const result = await dynamo.send(new ScanCommand({ TableName: TABLE_NAME }));
  const accounts = (result.Items ?? []).map((item) => unmarshall(item));
  logger.info('Listed accounts', { count: accounts.length });
  return c.json(accounts);
});

app.get('/accounts/:id', async (c) => {
  const id = c.req.param('id');
  if (!isUuid(id)) return c.json({ error: 'Invalid id' }, 400);

  const result = await dynamo.send(
    new GetItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ id }),
    }),
  );

  if (!result.Item) {
    logger.warn('Account not found', { accountId: id });
    return c.json({ error: 'Account not found' }, 404);
  }
  return c.json(unmarshall(result.Item));
});

app.post('/accounts', async (c) => {
  const body = await c.req.json();
  const account = { id: randomUUID(), ...body };

  await dynamo.send(
    new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshall(account),
    }),
  );

  await sns.send(
    new PublishCommand({
      TopicArn: CREATED_TOPIC_ARN,
      Message: JSON.stringify(account),
    }),
  );

  logger.info('Account created', {
    accountId: account.id,
    customerId: account.customerId,
  });
  return c.json(account, 201);
});

app.delete('/accounts/:id', async (c) => {
  const id = c.req.param('id');
  if (!isUuid(id)) return c.json({ error: 'Invalid id' }, 400);

  await dynamo.send(
    new DeleteItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ id }),
    }),
  );

  await sns.send(
    new PublishCommand({
      TopicArn: DELETED_TOPIC_ARN,
      Message: JSON.stringify({ id }),
      Subject: 'account.deleted',
    }),
  );

  logger.info('Account deleted', { accountId: id });
  return c.body(null, 204);
});

export const handler = handle(app);
