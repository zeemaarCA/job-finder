import PostForm from "@components/post/PostForm";
import Posts from "@components/post/Posts";
import prisma from "@lib/prisma";

async function getPosts() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      }
    }
  });
  return posts;
}

export default async function PostsPage() {
  const posts = await getPosts();
  return (
    <>
      <PostForm />
      <div className="container mt-6">
        <h1>Posts</h1>
        <div className="post-data grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {posts.map((post) => (
          <Posts key={post.id} post={post} />
        ))}
      </div>
    </div>
    </>
  )
}

