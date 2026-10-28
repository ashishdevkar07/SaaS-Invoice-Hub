
import { NextResponse } from "next/server";
import { db } from "../../lib/dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "Invoices";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { success: false, error: "Email required" },
      { status: 400 }
    );
  }

  try {
    const result = await db.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "#userEmail = :email",
        ExpressionAttributeNames: {
          "#userEmail": "email",
        },
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
    );

    return NextResponse.json({
      success: true,
      invoices: result.Items || [],
    });
  } catch (error: unknown) {
    console.error("GET invoices error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to load invoices";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
