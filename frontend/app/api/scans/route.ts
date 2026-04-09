import { NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Fetch user's history, sorted by newest first
    const history = await db
      .collection("history")
      .find({ email: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(history);
  } catch (error) {
    console.error("History GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { filename, mbti, traits } = body;

    if (!filename || !mbti || !traits) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const newRecord = {
      email: session.user.email,
      filename,
      mbti,
      traits,
      createdAt: new Date(),
    };

    await db.collection("history").insertOne(newRecord);

    return NextResponse.json({ success: true, record: newRecord }, { status: 201 });
  } catch (error) {
    console.error("History POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
