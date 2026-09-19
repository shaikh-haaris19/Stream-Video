"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {

    const router = useRouter();

    return (
        <nav className="flex items-center justify-between p-6 bg-gray-100">

            {/* Website Name  */}
            <div className="text-2xl font-bold text-gray-800">StreamVideo</div>

            {/* Upload Video & SignOut Button  */}
            <div className="flex items-center space-x-4">

                <Button onClick={() => router.push('/upload')} variant="outline" className="ml-auto shadow text-lg py-5 px-4 cursor-pointer">
                    Upload Video
                </Button>

                <Button onClick={() => signOut({ callbackUrl: '/sign-in' })} variant="destructive" className="ml-auto border border-red-500 shadow text-lg py-5 px-4 cursor-pointer">
                    Sign Out
                </Button>

            </div>

        </nav>
    );
}
