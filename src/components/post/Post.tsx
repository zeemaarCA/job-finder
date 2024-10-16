"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react";
import { LuPencil } from "react-icons/lu";


interface PostsProps {
  post: {
    id: string;
    title: string;
    content: string | null;
    author: {
      name: string | null;
      username: string | null;
      id: string;
    } | null;
  };
}
export default function Post({ post }: PostsProps) {
  const { data: session } = useSession();
  return (
    <>

      <div className="bg-slate-50 shadow-sm rounded-md p-3">

        <h3>{post.title}</h3>
        <p>{post.content}</p>
        <p className="mb-4">Author: {post.author?.username || "Unknown"}</p>

        {post.author?.id === session?.user.id && (
          <Link href={`/edit-post/${post.id}`} className="border-t w-full inline-block pt-4">
            <Button variant="expandIcon" Icon={LuPencil} iconPlacement="right">
              Edit
            </Button>
          </Link>
        )}
      </div>

    </>
  )
}
