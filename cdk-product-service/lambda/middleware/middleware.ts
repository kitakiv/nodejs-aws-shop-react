
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

type LambdaHandler = (event: any, context: any) => Promise<any>;

const logRequestMiddleware = (handler: LambdaHandler): LambdaHandler => {
  return async (event, context) => {
    console.log('Lambda request:', {
      functionName: context.functionName,
      args: event,
      timestamp: new Date().toISOString()
    });

    return handler(event, context);
  };
};
export default client;
export { logRequestMiddleware };
