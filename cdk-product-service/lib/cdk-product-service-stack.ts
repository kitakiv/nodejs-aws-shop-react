import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class CdkProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productTable = dynamodb.Table.fromTableName(this, 'ProductTable', 'ProductTable');
    const stockTable = dynamodb.Table.fromTableName(this, 'StockTable', 'StockTable');

    const getProductsList = new lambda.Function(this, 'getProductsListApi', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'products.handler',
      environment: {
        PRODUCT_TABLE_NAME: productTable.tableName,
        STOCK_TABLE_NAME: stockTable.tableName,
      },
    });

    const createProduct = new lambda.Function(this, 'createProductApi', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'productsPost.handler',
      environment: {
        PRODUCT_TABLE_NAME: productTable.tableName,
        STOCK_TABLE_NAME: stockTable.tableName,
      },
    });

    const getProductById = new lambda.Function(this, 'getProductByIdApi', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'productsById.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        PRODUCT_TABLE_NAME: productTable.tableName,
        STOCK_TABLE_NAME: stockTable.tableName,
      },
    });

    const api = new apigateway.RestApi(this, 'ProductApi', {
      deployOptions: {
        stageName: 'dev'
      },
    });
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

  }
}
