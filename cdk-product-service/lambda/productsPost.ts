import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);


export const handler = async (event: {body: string }) => {
    const body = JSON.parse(event.body);
    try {
            const PRODUCT_TABLE = process.env.PRODUCT_TABLE_NAME;
            const STOCK_TABLE = process.env.STOCK_TABLE_NAME;
            if (!body.title || !body.description || !body.price || !body.count || typeof body.title !== 'string' || typeof body.description !== 'string' || typeof body.price !== 'number' || typeof body.count !== 'number') {
                return {
                    statusCode: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        message: 'Missing required fields'
                    })
                };
            }
            const productId = Math.floor(Math.random() * 10000000000);
            const paramsProduct = {
                TableName: PRODUCT_TABLE,
                Item: {
                    id: `${productId}`,
                    title: body.title,
                    description: body.description,
                    price: body.price
                }
              };
              const paramsStock = {
                TableName: STOCK_TABLE,
                Item: {
                  product_id: `${productId}`,
                  count: body.count
                }
              };
              await dynamo.send(new PutCommand(paramsProduct));
              await dynamo.send(new PutCommand(paramsStock));
              return {
                statusCode: 201,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    message: 'Product created',
                    productId: productId
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