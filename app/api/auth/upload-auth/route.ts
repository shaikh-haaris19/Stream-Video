import { getUploadAuthParams } from "@imagekit/next/server"

export async function GET() {

    try {

        const authenticationParams = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
        })

        return Response.json({
            authenticationParams,
            publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
        })

    } catch (error) {

        console.error(error)
        return Response.json({ error: "Failed to get upload auth params" }, { status: 500 })
        
    }

}