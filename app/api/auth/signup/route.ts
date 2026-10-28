import { NextResponse } from "next/server";
import { db } from "../../../lib/dynamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import * as crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email, password, businessName } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    // Check if user already exists in DynamoDB
    const existing = await db.send(
      new GetCommand({ TableName: "Users", Key: { email } })
    );

    if (existing.Item) {
      return NextResponse.json({ success: false, error: "User already exists" }, { status: 400 });
    }

    // Hash password securely
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    // Save new user to DynamoDB
    await db.send(
      new PutCommand({
        TableName: "Users",
        Item: {
          email,
          password: hashedPassword,
          businessName: businessName || "",
          createdAt: new Date().toISOString(),
        },
      })
    );

    return NextResponse.json({ success: true, message: "User registered successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}