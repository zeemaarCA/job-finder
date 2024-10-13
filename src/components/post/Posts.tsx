interface PostsProps {
  post: {
    title: string;
    content: string | null;
    author: {
      name: string | null;
    } | null;
  };
}
export default function Posts({ post }: PostsProps) {
  return (
    <>

      <div className="bg-purple-50 shadow-sm rounded-md p-3">
        <h3>{post.title}</h3>
        <p>{post.content}</p>
        <p>Author: {post.author?.name || "Unknown"}</p>
      </div>

    </>
  )
}
