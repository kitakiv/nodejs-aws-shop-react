import { products} from "./productsData";
export const handler = async () => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: products,
            statusCode: 200
         }),
    };
};