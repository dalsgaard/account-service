import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  ScanCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Logger } from '@aws-lambda-powertools/logger';
import { randomUUID, randomInt } from 'crypto';
import { createAccountServiceClient } from '../asyncapi/generated/account-service-aws-client';
import type { Account } from '../asyncapi/generated/account-service';

function generateIban(): string {
  // Danish IBAN: DK + 2 check digits + 4-digit bank code + 10-digit account number
  const bankCode = '5000'; // Danske Bank sandbox
  const accountNumber = String(randomInt(1_000_000_000, 9_999_999_999));
  const bban = bankCode + accountNumber;

  // ISO 7064 MOD-97 check digits
  const numeric = bban + '182800'; // 'DK' = 13 18, '00' placeholder
  const mod97 = BigInt(numeric) % 97n;
  const checkDigits = String(98n - mod97).padStart(2, '0');

  return `DK${checkDigits}${bban}`;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(s: string): boolean {
  return UUID_RE.test(s);
}

const dynamo = new DynamoDBClient({});
const topics = createAccountServiceClient({
  accountCreatedTopicArn: process.env.CREATED_TOPIC_ARN!,
  accountUpdatedTopicArn: process.env.UPDATED_TOPIC_ARN!,
  accountDeletedTopicArn: process.env.DELETED_TOPIC_ARN!,
});
const TABLE_NAME = process.env.TABLE_NAME!;
const logger = new Logger({ serviceName: 'account-service' });

const app = new Hono();

app.get('/accounts', async (c) => {
  const customerId = c.req.query('customerId');

  if (customerId) {
    if (!isUuid(customerId)) return c.json({ error: 'Invalid customerId' }, 400);
    const result = await dynamo.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'customerId-all-index',
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
  const body = await c.req.json<Omit<Account, 'id' | 'iban'>>();
  const account: Account = { id: randomUUID(), iban: generateIban(), ...body };

  await dynamo.send(
    new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshall(account),
    }),
  );

  await topics.sendAccountCreated(account);

  logger.info('Account created', {
    accountId: account.id,
    customerId: account.customerId,
  });
  return c.json(account, 201);
});

app.patch('/accounts/:id', async (c) => {
  const id = c.req.param('id');
  if (!isUuid(id)) return c.json({ error: 'Invalid id' }, 400);

  const { name } = await c.req.json<{ name: string }>();

  const result = await dynamo.send(
    new UpdateItemCommand({
      TableName: TABLE_NAME,
      Key: marshall({ id }),
      UpdateExpression: 'SET #name = :name',
      ExpressionAttributeNames: { '#name': 'name' },
      ExpressionAttributeValues: marshall({ ':name': name }),
      ConditionExpression: 'attribute_exists(id)',
      ReturnValues: 'ALL_NEW',
    }),
  );

  if (!result.Attributes) {
    return c.json({ error: 'Account not found' }, 404);
  }

  const account = unmarshall(result.Attributes) as Account;

  await topics.sendAccountUpdated(account);

  logger.info('Account updated', { accountId: id });
  return c.json(account);
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

  await topics.sendAccountDeleted({ id });

  logger.info('Account deleted', { accountId: id });
  return c.body(null, 204);
});

export const handler = handle(app);
