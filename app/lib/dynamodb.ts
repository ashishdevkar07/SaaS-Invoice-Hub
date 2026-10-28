
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: "ap-southeast-2",
});

export const db = DynamoDBDocumentClient.from(client);
export const TABLE_NAME = "Invoices";
