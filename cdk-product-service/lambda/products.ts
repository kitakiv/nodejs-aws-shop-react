
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async () => {
    try {
        const PRODUCT_TABLE = process.env.PRODUCT_TABLE_NAME;
        const STOCK_TABLE = process.env.STOCK_TABLE_NAME;

        const [resultProduct, resultStock] = await Promise.all([
            dynamo.send(new ScanCommand({
                TableName: PRODUCT_TABLE
            })),
            dynamo.send(new ScanCommand({
                TableName: STOCK_TABLE
            }))
        ]);
        const products = resultProduct.Items || [];
        const stocks = resultStock.Items || [];
        const combinedItems = products.map(product => {
            const stock = stocks.find(stock => stock.product_id === product.id);
            return {
                ...product,
                count: stock ? stock.count : 0
            };
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(combinedItems)
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