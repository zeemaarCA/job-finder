import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
	try {
		const post = await prisma.post.findUnique({
			where: {
				id: params.id,
			},
		});

		if (!post) {
			return NextResponse.json({ message: "Post not found" }, { status: 404 });
		}

		return NextResponse.json(post);
	} catch {
		return NextResponse.json(
			{ error: "Error retrieving post" },
			{ status: 500 }
		);
	}
};


export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
	const { title, content } = await request.json();

	try {
		const post = await prisma.post.update({
			where: {
				id: params.id,
			},
			data: {
				title: title,
				content: content,
			},
		});

		return NextResponse.json({ message: "Post updated successfully", post }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: "Error updating post" },
			{ status: 500 }
		);
	}
};
