import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {deleteCookie} from "cookies-next";

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;
    if (pathname.startsWith('/auth')) {
        const token = request.cookies.get('token')?.value;
        if (token) {
            const cek = await cekToken(request, token, "panel");
            if (cek.success) {
                return NextResponse.redirect(new URL('/panel', request.url))
            }
            request.cookies.delete('token')
            return NextResponse.next()
        } else {
            return NextResponse.next()
        }
    }
    if (pathname.startsWith('/panel')) {
        const token = request.cookies.get('token')?.value;
        if (token) {
            const cek = await cekToken(request, token, "panel");
            if (cek.success) {
                return NextResponse.next()
            }
            request.cookies.delete('token')
            return NextResponse.rewrite(new URL('/auth/login', request.url))
        } else {
            return NextResponse.rewrite(new URL('/auth/login', request.url))
        }
    }
    if (pathname.startsWith('/santri')) {
        const token = request.cookies.get('token_santri')?.value;
        if (!token || token === "") {
            return NextResponse.redirect(new URL('/', request.url))
        }
        const cek = await cekToken(request, token, "santri")
        if (!cek.success) {
            request.cookies.delete('token_santri')
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    }
}

type Jenis = "panel" | "santri";
const cekToken = async (request: NextRequest, token: string | boolean, tipe: Jenis) => {
    try {
        let auth_url;
        switch (tipe) {
            case "panel":
                auth_url = "/api/auth/detail"
                break;
            case "santri":
                auth_url = "/api/auth/santri/detail"
                break;
            default:
                auth_url = "/api/auth/detail"
                break;
        }
        const cek = await fetch(request.nextUrl.origin + auth_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        });
        const response = await cek.json();
        if (!response.success) {
            return {
                success: false,
            }
        }
        return response
    } catch (error) {
        return {
            success: false,
        }
    }
}
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|assets|vercel|next).*)',
    ],
}
