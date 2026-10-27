import { NextResponse } from "next/server";
import { db } from "../../../lib/dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import * as crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const userResult = await db.send(
      new GetCommand({ TableName: "Users", Key: { email } })
    );

    if (!userResult.Item) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

    if (userResult.Item.passwordHash !== passwordHash) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: { email: userResult.Item.email, businessName: userResult.Item.businessName },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}