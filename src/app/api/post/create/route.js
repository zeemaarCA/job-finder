import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function POST(request) {
  const { title, content } = await request.json();

  // Perform database operations here
  const result = await prisma.post.create({
    data: {
      title,
      content,
      published: true,
    },
  });

  return NextResponse.json(result);
}