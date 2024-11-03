import { formSchema } from "@/app/schema/schema";
import { NextRequest, NextResponse } from "next/server";
import {generateSlug} from 'random-word-slugs'
export async function POST(req:NextRequest){
    try {
        const body = formSchema.parse(await req.json())
        const msgToPush = {...body,domain : generateSlug(2)}
        return NextResponse.json({trackingURL : `/status/${msgToPush.domain}`})
    } catch (error) {
        console.log(error)
        return NextResponse.json({msg : "Invalid Payload"},{status : 400})
    }
    
    
}