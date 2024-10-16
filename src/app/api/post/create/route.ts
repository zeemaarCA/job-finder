import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function POST(request: Request) {
  try {
    const { title, content, userId } = await request.json();

    const result = await prisma.post.create({
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