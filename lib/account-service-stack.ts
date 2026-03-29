import { CfnOutput, Duration, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export class AccountServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'AccountTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    const createdTopic = new Topic(this, 'AccountCreatedTopic');

    const customerDeletedQueue = new Queue(this, 'CustomerDeletedQueue');

    const customerDeletedTopic = Topic.fromTopicArn(
      this,
      'CustomerDeletedTopic',
      Fn.importValue('CustomerServiceStack-CustomerDeletedTopicArn'),
    );
    customerDeletedTopic.addSubscription(
      new SqsSubscription(customerDeletedQueue),
    );

    const handler = new NodejsFunction(this, 'AccountHandler', {
      entry: 'lambda/index.ts',
      runtime: Runtime.NODEJS_24_X,
      timeout: Duration.seconds(30),
      description: 'Account service Lambda handler',
      environment: {
        TABLE_NAME: table.tableName,
        CREATED_TOPIC_ARN: createdTopic.topicArn,
        CUSTOMER_DELETED_QUEUE_URL: customerDeletedQueue.queueUrl,
      },
    });

    table.grantReadWriteData(handler);
    createdTopic.grantPublish(handler);
    customerDeletedQueue.grantConsumeMessages(handler);

    const api = new HttpApi(this, 'AccountApi', {
      description: 'Account Service API',
    });

    api.addRoutes({
      path: '/{proxy+}',
      integration: new HttpLambdaIntegration('AccountIntegration', handler),
    });

    new CfnOutput(this, 'ApiUrl', {
      value: api.apiEndpoint,
    });
  }
}
