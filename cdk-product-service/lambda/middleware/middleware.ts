import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

client.middlewareStack.add(
  (next, context) => async (args) => {
    console.log("Incoming DynamoDB request:", {
      operation: context.commandName,
      service: context.clientName,
      args: args.input,
      timestamp: new Date().toISOString()
    });

    try {
      const result = await next(args);
      console.log("DynamoDB response:", {
        operation: context.commandName,
        success: true,
        output: result.output
      });

      return result;
    } catch (error) {
      console.error("DynamoDB error:", {
        operation: context.commandName,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  },
  {
    step: "build",
    name: "request-logger",
    override: true
  }
);

export default client;
