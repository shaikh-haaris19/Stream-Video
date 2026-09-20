"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {

    const router = useRouter();

    return (
        <nav className="flex items-center justify-between p-6 bg-gray-100">

            {/* Website Name  */}
            <div className="text-2xl font-bold text-gray-800">
                <span className="cursor-pointer" onClick={() => router.push('/')}>StreamVideo</span>
            </div>

            {/* Upload Video & SignOut Button  */}
            <div className="flex items-center space-x-2 md:space-x-4">

                <Button onClick={() => router.push('/upload')} variant="outline" className="ml-auto shadow text-sm md:text-lg py-2 md:py-5 px-2 md:px-4 cursor-pointer">
                    Upload Video
                </Button>

                <Button onClick={() => signOut({ callbackUrl: '/sign-in' })} variant="destructive" className="ml-auto border border-red-500 shadow text-sm md:text-lg py-2 md:py-5 px-2 md:px-4 cursor-pointer">
                    Sign Out
                </Button>

            </div>

        </nav>
    );
}
