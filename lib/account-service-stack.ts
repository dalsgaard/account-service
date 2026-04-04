import { CfnOutput, Duration, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { AttributeType, BillingMode, ProjectionType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as path from 'path';

export class AccountServiceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'AccountTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'customerId-all-index',
      partitionKey: { name: 'customerId', type: AttributeType.STRING },
      projectionType: ProjectionType.ALL,
    });

    const createdTopic = new Topic(this, 'AccountCreatedTopic');
    const deletedTopic = new Topic(this, 'AccountDeletedTopic');

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
        DELETED_TOPIC_ARN: deletedTopic.topicArn,
      },
    });

    table.grantReadWriteData(handler);
    createdTopic.grantPublish(handler);
    deletedTopic.grantPublish(handler);

    const customerDeletedHandler = new NodejsFunction(
      this,
      'CustomerDeletedHandler',
      {
        entry: 'lambda/customer-deleted.ts',
        runtime: Runtime.NODEJS_24_X,
        timeout: Duration.seconds(30),
        description: 'Deletes accounts when a customer is deleted',
        environment: {
          TABLE_NAME: table.tableName,
        },
      },
    );

    table.grantReadWriteData(customerDeletedHandler);
    customerDeletedHandler.addEventSource(
      new SqsEventSource(customerDeletedQueue),
    );

    const api = new HttpApi(this, 'AccountApi', {
      description: 'Account Service API',
    });

    api.addRoutes({
      path: '/{proxy+}',
      integration: new HttpLambdaIntegration('AccountIntegration', handler),
    });

    new CfnOutput(this, 'ApiUrl', {
      value: api.apiEndpoint,
      exportName: 'AccountServiceStack-ApiUrl',
    });

    new CfnOutput(this, 'AccountDeletedTopicArn', {
      value: deletedTopic.topicArn,
      exportName: 'AccountServiceStack-AccountDeletedTopicArn',
    });

    const specsBucket = Bucket.fromBucketName(
      this,
      'OpenApiSpecsBucket',
      Fn.importValue('CustomerServiceStack-OpenApiSpecsBucketName'),
    );

    new BucketDeployment(this, 'UploadOpenApiSpec', {
      sources: [
        Source.asset(path.join(__dirname, '../openapi'), {
          exclude: ['types.ts', 'types.js', 'types.d.ts'],
        }),
      ],
      destinationBucket: specsBucket,
      destinationKeyPrefix: 'account-service',
    });
  }
}
