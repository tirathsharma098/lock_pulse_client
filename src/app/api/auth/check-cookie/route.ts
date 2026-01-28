import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';

export async function GET () {
    try{
        const cookie = await cookies();
        const token = cookie.get("auth");
        if (token)
            return NextResponse.json({
                success: true
            }, {status: 200})
        else return NextResponse.json({
            success: false
        }, {status: 401})
    } catch (err) {
        return NextResponse.json({
            success: false
        }, {status: 500})
    }
}

export async function POST () {
    try{
        const cookie = await cookies();
        cookie.delete({
            name: 'auth',
            path: '/',
            domain: process.env.COOKIE_DOMAIN,
            sameSite: 'strict',
            secure: true,
        });
        return NextResponse.json({
            success: true
        }, {status: 200});
    } catch (err){
        return NextResponse.json({
            success: false
        }, {status: 500});
    }
}