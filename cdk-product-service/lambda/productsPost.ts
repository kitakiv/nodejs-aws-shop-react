
import {
    DynamoDBDocumentClient, TransactWriteCommand,
    TransactWriteCommandInput
} from "@aws-sdk/lib-dynamodb";
import { headers, StatusCode, StatusCodeMessage } from "./request/constans";
import uuid from "./request/uuidId";
import client from "./middleware/middleware";

const dynamo = DynamoDBDocumentClient.from(client);


export const handler = async (event: { body: string }) => {
    const body = JSON.parse(event.body);
    try {
        const PRODUCT_TABLE = process.env.PRODUCT_TABLE_NAME;
        const STOCK_TABLE = process.env.STOCK_TABLE_NAME;
        if (!body || !body.title || !body.description || !body.price || !body.count || typeof body.title !== 'string' || typeof body.description !== 'string' || typeof body.price !== 'number' || typeof body.count !== 'number') {
            return {
                statusCode: StatusCode.BAD_REQUEST,
                headers,
                body: JSON.stringify({
                    message: StatusCodeMessage.BAD_REQUEST
                })
            };
        }
        const productId = uuid();
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
        const transactItems: TransactWriteCommandInput = {
            TransactItems: [
                {
                    Put: {
                        TableName: paramsProduct.TableName,
                        Item: paramsProduct.Item,
                        ConditionExpression: 'attribute_not_exists(id)'
                    }
                },
                {
                    Put: {
                        TableName: paramsStock.TableName,
                        Item: paramsStock.Item,
                        ConditionExpression: 'attribute_not_exists(product_id)'
                    }
                }
            ]
        };
        await dynamo.send(new TransactWriteCommand(transactItems));
        return {
            statusCode: StatusCode.CREATED,
            headers,
            body: JSON.stringify(
                {
                    id: `${productId}`,
                    title: body.title,
                    description: body.description,
                    price: body.price,
                    count: body.count
                }
            )
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: StatusCode.INTERNAL_SERVER_ERROR,
            headers,
            body: JSON.stringify({
                message: StatusCodeMessage.INTERNAL_SERVER_ERROR,
                error: error instanceof Error ? error.message : 'Unknown error'
            })
        };
    }
};