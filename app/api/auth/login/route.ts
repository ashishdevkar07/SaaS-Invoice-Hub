import { NextResponse } from "next/server";
import { db } from "../../../lib/dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import * as crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    // Fetch user from DynamoDB Users table
    const result = await db.send(
      new GetCommand({ TableName: "Users", Key: { email } })
    );

    if (!result.Item) {
      return NextResponse.json({ success: false, error: "User not found. Please register." }, { status: 404 });
    }

    // Verify password hash
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
    if (result.Item.password !== hashedPassword) {
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "Login successful", email: result.Item.email });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}