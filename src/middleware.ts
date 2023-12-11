import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;
    if (pathname.startsWith('/auth')) {
        const token = request.cookies.get('token')?.value;
        if (token) {
            const cek = await cekToken(request, token);
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
            const cek = await cekToken(request, token);
            if (cek.success) {
                return NextResponse.next()
            }
            request.cookies.delete('token')
            return NextResponse.rewrite(new URL('/auth/login', request.url))
        } else {
            return NextResponse.rewrite(new URL('/auth/login', request.url))
        }
    }
}

const cekToken = async (request:NextRequest, token: string | boolean) => {
    try {
        const cek = await fetch(`${request.nextUrl.origin}/api/auth/detail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        });
        const cekuser = await cek.json();
        if (!cekuser.success) {
            return {
                success: false,
            }
        }
        return cekuser
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
