import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CdkProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const apiGatewayLoggingRole = new iam.Role(this, 'ApiGatewayLoggingRole', {
      assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonAPIGatewayPushToCloudWatchLogs')
      ],
      description: 'Role for API Gateway to push logs to CloudWatch',
    });

    const apiLogGroup = new logs.LogGroup(this, 'ApiGatewayLogGroup', {
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const apiGatewayAccount = new apigateway.CfnAccount(this, 'ApiGatewayAccount', {
      cloudWatchRoleArn: apiGatewayLoggingRole.roleArn
    });

    const productTable = dynamodb.Table.fromTableName(this, 'ProductTable', 'ProductTable');
    const stockTable = dynamodb.Table.fromTableName(this, 'StockTable', 'StockTable');

    const getProductsList = new lambda.Function(this, 'getProductsListApi', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'products.handler',
      logRetention: logs.RetentionDays.ONE_WEEK,
      environment: {
        PRODUCT_TABLE_NAME: productTable.tableName,
        STOCK_TABLE_NAME: stockTable.tableName,
      },
    });

    const createProduct = new lambda.Function(this, 'createProductApi', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'productsPost.handler',
      logRetention: logs.RetentionDays.ONE_WEEK,
      tracing: lambda.Tracing.ACTIVE,
      environment: {
        PRODUCT_TABLE_NAME: productTable.tableName,
        STOCK_TABLE_NAME: stockTable.tableName,
      },
    });

    const getProductById = new lambda.Function(this, 'getProductByIdApi', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'productsById.handler',
      code: lambda.Code.fromAsset('lambda'),
      logRetention: logs.RetentionDays.ONE_WEEK,
      environment: {
        PRODUCT_TABLE_NAME: productTable.tableName,
        STOCK_TABLE_NAME: stockTable.tableName,
      },
    });

    const api = new apigateway.RestApi(this, 'ProductApi', {
      deployOptions: {
        stageName: 'dev',
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        tracingEnabled: true,
        accessLogDestination: new apigateway.LogGroupLogDestination(apiLogGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields()
      },
    });
    api.node.addDependency(apiGatewayAccount);
     // GET /products
    const products = api.root.addResource('products');
    products.addMethod('GET', new apigateway.LambdaIntegration(getProductsList));
    products.addMethod('POST', new apigateway.LambdaIntegration(createProduct));

    // GET /products/{id}
    const product = products.addResource('{id}');
    product.addMethod('GET', new apigateway.LambdaIntegration(getProductById));

    productTable.grantReadData(getProductsList);
    productTable.grantReadData(getProductById);
    stockTable.grantReadData(getProductsList);
    stockTable.grantReadData(getProductById);
    productTable.grantWriteData(createProduct);
    stockTable.grantWriteData(createProduct);

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });

  }
}
