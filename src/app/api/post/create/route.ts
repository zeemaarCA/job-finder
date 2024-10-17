import { NextResponse } from "next/server";
import { db } from "@lib/db";

export async function POST(request: Request) {
  try {
    const { title, content, userId } = await request.json();

    const result = await db.post.create({
      data: {
        title,
        content,
        published: true,
        author: { connect: { id: userId } },
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}