import Posts from "@components/post/Posts";
// import { CgSpinner } from "react-icons/cg";
export default async function Home() {
  return (
    <>
      {/* <span className="flex justify-center my-8 gap-1"><CgSpinner className="animate-spin h-6 w-6" /> Loading...</span> */}
      <Posts />
    </>
  );
}
