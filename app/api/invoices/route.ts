import { NextResponse } from "next/server";
import { db } from "../../lib/dynamodb";
import { ScanCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

// GET: Fetch all invoices for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const result = await db.send(
      new ScanCommand({
        TableName: "Invoices",
        FilterExpression: "email = :email",
        ExpressionAttributeValues: { ":email": email },
      })
    );

    return NextResponse.json({ success: true, invoices: result.Items || [] });
  } catch (error: any) {
    console.error("API GET Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a new invoice
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, clientName, amount, dueDate, status } = body;

    if (!email || !clientName || !amount || !dueDate) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const id = randomUUID(); // Must be named 'id' to match your table's primary key schema

    await db.send(
      new PutCommand({
        TableName: "Invoices",
        Item: {
          id,          // Changed from invoiceId to id
          email,
          clientName,
          amount: Number(amount),
          dueDate,
          status: status || "Pending",
          createdAt: new Date().toISOString(),
        },
      })
    );

    return NextResponse.json({ success: true, message: "Invoice created successfully" });
  } catch (error: any) {
    console.error("API POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove an invoice by id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id"); // Match parameter name

    if (!id) {
      return NextResponse.json({ success: false, error: "Invoice ID is required" }, { status: 400 });
    }

    await db.send(
      new DeleteCommand({
        TableName: "Invoices",
        Key: { id }, // Match primary key name
      })
    );

    return NextResponse.json({ success: true, message: "Invoice deleted successfully" });
  } catch (error: any) {
    console.error("API DELETE Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
