import { getProductById } from "./productsData";

export const handler = async (event : { pathParameters: { id: string } }) => {
    const productId = event.pathParameters?.id;
    const product = await getProductById(productId);
    if (!product) {
        return {
            statusCode: 404,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                statusCode: 404,
                message: `Product with id: ${productId} not found`,
            }),
        };
    }
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            data: product,
            statusCode: 200,
        }),
    };
};