"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Input } from "@components/ui/input";
import { useSession } from "next-auth/react";
import { ReloadIcon } from "@radix-ui/react-icons";
type FormData = {
  title: string;
  content: string;
  authorId: string;
};
export default function EditPost({ params }: { params: { id: string } }) {

  const [formData, setFormData] = useState<FormData>({ title: '', content: '', authorId: '' });
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { id } = params;
  const fetchedRef = useRef(false);
  const { data: session } = useSession();

  useEffect(() => {
    // Ensure both session.user.id and formData.authorId are defined
    if (session?.user?.id && formData.authorId) {
      if (session.user.id !== formData.authorId) {
        toast.error("You are not authorized to edit this post, redirecting...");
        router.push("/");
      }
    }
  }, [session?.user?.id, formData.authorId, router]);


  useEffect(() => {
    const fetchPost = async () => {
      // prevent fetching the post again if it has already been fetched
      if (fetchedRef.current) return;
      fetchedRef.current = true;
      try {
        setIsFetching(true);
        const response = await fetch(`/api/post/${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
          setIsFetching(false);
        } else {
          // Redirect to post list if the post is not found
          router.push("/");
          toast.error("Post not found, redirecting...");
        }
      } catch (error) {
        setIsFetching(false);
        console.log(error);
        router.push("/");
        toast.error("An unexpected error occurred, redirecting...");
      }
    };

    if (id) fetchPost();
  }, [id, router]);


  const updatePost = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!id) {
      return toast.error("Post ID not found");
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/post/${id}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Post updated successfully");
        router.push("/");
        setIsSubmitting(false);
      } else {
        if (response.status === 404) {
          // Redirect if post not found
          router.push("/");
          toast.error("Post not found, redirecting...");
        } else {
          toast.error(data.error || "Error updating post");
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="container py-6 mt-10 border border-slate-200 w-full max-w-sm">
      <h1>Edit Post</h1>
      <div className="form mt-5">
        <form className="flex flex-col gap-4" onSubmit={updatePost}>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input type="text" id="title" placeholder={isFetching ? "Loading..." : "Title"} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" placeholder={isFetching ? "Loading..." : "Content"} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
          </div>
          {isSubmitting ? (
            <Button disabled className="btn-theme">
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button className="btn-theme" type="submit" disabled={isFetching}>
              Update Post
            </Button>
          )}
        </form>
      </div>
    </div>
  )
}
