import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const region = process.env.REGION || process.env.AWS_REGION || "ap-southeast-2";
const accessKeyId = process.env.ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY;

// Only pass the credentials block if the keys actually exist, 
// otherwise let the SDK fall back naturally without sending empty strings.
const clientConfig: any = {
  region,
};

if (accessKeyId && secretAccessKey) {
  clientConfig.credentials = {
    accessKeyId,
    secretAccessKey,
  };
}

const client = new DynamoDBClient(clientConfig);

export const db = DynamoDBDocumentClient.from(client);