
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const accessKeyId = process.env.ACCESS_KEY?.trim();
const secretAccessKey = process.env.SECRET_ACCESS_KEY?.trim();
const region = process.env.REGION?.trim() || "ap-southeast-2";

if (!accessKeyId || !secretAccessKey) {
  throw new Error(
    "AWS credentials are missing. Check ACCESS_KEY and SECRET_ACCESS_KEY in Amplify."
  );
}

const client = new DynamoDBClient({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const db = DynamoDBDocumentClient.from(client);
export const TABLE_NAME = "Invoices";
