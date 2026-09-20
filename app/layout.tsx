import type { Metadata } from "next";
import "./globals.css";
import ProviderWrapper from "@/app/Components/Providers";
import Navbar from "@/app/Components/Navbar";

export const metadata: Metadata = {
  title: "Stream-Video",
  description: "A video streaming platform built with Next.js, ImageKit, and MongoDB. Upload, manage, and stream your videos seamlessly.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={` h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ProviderWrapper>
          <Navbar />
          {children}
        </ProviderWrapper>
      </body>
    </html>
  );
}
