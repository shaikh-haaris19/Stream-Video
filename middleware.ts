import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";

export default withAuth(

    function middleware(req) {
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized({ req, token }) {

                const { pathname } = req.nextUrl

                // Allow the requests if the following is true...
                if (pathname.startsWith("/api/auth") || pathname === "/sign-in" || pathname === "/sign-up") {
                    return true
                }

                if(pathname === "/" || pathname.startsWith("/api/video")) {
                    return true
                }

                if (token) {
                    return true
                }

            }
        },
    },

)

export const config = {

    /* 

    Matches All Path Except :
    * - _next/static (static files)
    * - _next/image (image optimization files)
    * - favicon.ico 
    * - public/ (public files)
    
    */

    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public/).*)"
    ],
};