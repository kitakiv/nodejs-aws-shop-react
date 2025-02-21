import { products } from "./productsData";
export const handler = async () => {
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            data: products,
            statusCode: 200
         }),
    };
};