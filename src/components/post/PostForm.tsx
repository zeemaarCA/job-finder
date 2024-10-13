"use client"

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function PostForm() {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (response.ok) {
        setTitle("");
        setContent("");
        toast.success("Post created successfully");
        router.refresh()
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
    <>
      <div className="container py-6 mt-10 border border-slate-200 w-full max-w-sm">
        <h1>Create Post</h1>
        <div className="form mt-5">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">Title</Label>
              <Input type="text" id="title" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <Button className="btn-theme" type="submit">
              Create Post
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
