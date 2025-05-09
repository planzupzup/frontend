import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_REST_API_KEY;
const KAKAO_REDIRECT_URI = `${process.env.NEXT_PUBLIC_API_HOST}/login/kakao`;

export const GET = async (req:NextRequest, res:NextResponse) => {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    await( axios.post('http://43.203.206.198:8080/api/login', {
        code : code
    }));

    console.log(code);
    
    window.location.reload();
    
    return NextResponse.json(
    { status: 200 });
}