
import { NextResponse } from "next/server";
import { db } from "../../lib/dynamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "UserSettings";

// GET: Fetch settings for a user
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
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { email },
      })
    );

    return NextResponse.json({
      success: true,
      settings: result.Item || {},
    });
  } catch (error: unknown) {
    console.error("GET settings error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to load settings";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// POST: Save settings for a user
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      companyName,
      companyAddress,
      phone,
      gstin,
      bankName,
      accountNumber,
      ifscCode,
      upiId,
    } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email required" },
        { status: 400 }
      );
    }

    const item = {
      email,
      companyName,
      companyAddress,
      phone,
      gstin,
      bankName,
      accountNumber,
      ifscCode,
      upiId,
      updatedAt: new Date().toISOString(),
    };

    await db.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    return NextResponse.json({
      success: true,
      settings: item,
    });
  } catch (error: unknown) {
    console.error("POST settings error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to save settings";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
