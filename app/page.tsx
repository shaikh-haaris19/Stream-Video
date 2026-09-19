"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {

  const { data: session } = useSession();


  useEffect(() => {
    console.log("Session Data:", session);
  }, [session]);

  return (
    <div>

      

    </div>
  );
}
