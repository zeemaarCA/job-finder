'use client'

import { SessionProvider, useSession } from "next-auth/react";
import Loader from "@components/Loader";

export default function SessionProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionCheck>{children}</SessionCheck>
    </SessionProvider>
  );
}

function SessionCheck({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  // Show loader while the session is loading
  if (status === "loading") {
    return <Loader />;
  }

  return <>{children}</>;
}
