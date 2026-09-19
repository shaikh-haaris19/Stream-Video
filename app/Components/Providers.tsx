"use client";

import { SessionProvider } from "next-auth/react";
import { ImageKitProvider } from "@imagekit/next"

const UrlEndPoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!

export default function ProviderWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider refetchInterval={5 * 60}>
            <ImageKitProvider urlEndpoint={UrlEndPoint}>
            {children}
            </ImageKitProvider>
        </SessionProvider>
    );
}