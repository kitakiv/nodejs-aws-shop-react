import { getProductById } from "./productsData";

export const handler = async (event: { pathParameters: { id: string } }) => {
    const productId = event.pathParameters?.id;
    const product = await getProductById(productId);
    if (!product) {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: `Product with id: ${productId} not found`,
            }),
        };
    }
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    };
};