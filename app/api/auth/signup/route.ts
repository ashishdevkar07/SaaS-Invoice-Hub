import { NextResponse } from "next/server";
import { db } from "../../../lib/dynamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import * as crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email, password, businessName } = await request.json();

    const existing = await db.send(
      new GetCommand({ TableName: "Users", Key: { email } })
    );

    if (existing.Item) {
      return NextResponse.json({ success: false, error: "User already exists" }, { status: 400 });
    }

    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

    await db.send(
      new PutCommand({
        TableName: "Users",
        Item: { email, passwordHash, businessName, createdAt: new Date().toISOString() },
      })
    );

    return NextResponse.json({ success: true, user: { email, businessName } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}