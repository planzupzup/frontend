import { BACK_HOST } from "@/app/components/modal/Login";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest, res:NextResponse) => {
    const url = new URL(req.url);

    await( axios.get(`${BACK_HOST}/login`));

    
    window.location.reload();
    
    return NextResponse.json(
    { status: 200 });
}