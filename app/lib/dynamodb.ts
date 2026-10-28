import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const accessKeyId = process.env.ACCESS_KEY?.trim() || "";
const secretAccessKey = process.env.SECRET_KEY?.trim() || "";
const region = process.env.REGION?.trim() || "ap-southeast-2";

const client = new DynamoDBClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const db = DynamoDBDocumentClient.from(client);
export const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "Invoices";