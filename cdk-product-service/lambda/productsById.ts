import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event: { pathParameters: { id: string } }) => {
    const productId = event.pathParameters?.id;
    try {
            const PRODUCT_TABLE = process.env.PRODUCT_TABLE_NAME;
            const STOCK_TABLE = process.env.STOCK_TABLE_NAME;
            const [resultProduct, resultStock] = await Promise.all([
                dynamo.send(new QueryCommand({
                    TableName: PRODUCT_TABLE
                    ,KeyConditionExpression: 'id = :id',
                    ExpressionAttributeValues: {
                        ':id': productId
                    }
                })),
                dynamo.send(new QueryCommand({
                    TableName: STOCK_TABLE,
                    KeyConditionExpression: 'product_id = :product_id',
                    ExpressionAttributeValues: {
                        ':product_id': productId
                    }
                }))
            ]);
            if (!resultProduct.Items || !resultStock.Items) {
                return {
                    statusCode: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        message: `Product with id ${productId} not found`
                    })
                };
            }
            const product = resultProduct.Items;
            const stock = resultStock.Items;
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    ...product[0],
                    count: stock[0].count || 0
                })
            };
        } catch (error) {
            console.error('Error:', error);
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    message: 'Internal server error',
                    error: error instanceof Error ? error.message : 'Unknown error'
                })
            };
        }
};