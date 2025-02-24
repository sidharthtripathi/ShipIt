// app/api/sse/route.js
export const maxDuration = 60;
export const dynamic = 'force-dynamic'
import { getRedis } from "@/lib/redis";
import { NextRequest } from "next/server";
import { commandOptions } from 'redis';

export async function GET(request : NextRequest,{params} : {params : {id : string}}) {
    const client = await getRedis()
    const {id} = params
    const encoder = new TextEncoder();
    let lastId = '0'

    // Create a ReadableStream that sends an event every second
    const stream = new ReadableStream({
      async start(controller) {
        // When the client aborts the request, clean up the interval and close the stream
        request.signal.addEventListener("abort", async() => {
        controller.close();
        await client.disconnect()
      });
        while(true){
            const response = await client.xRead(
                commandOptions(
                  {
                    isolated: true
                  }
                ), [
                  {
                    key: `logs:${id}`,
                    id: lastId
                  }
                ], {
                  COUNT: 1,
                  BLOCK: 0
                }
              );
              if(response){
                const entry = response[0].messages[0];
                const event = `data: ${JSON.stringify(entry.message)}\n\n`;
                lastId = entry.id
                controller.enqueue(encoder.encode(event));
              }
        }
      },
    });
  
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }
  