// Example: pages/sse-client.js (or a component)
"use client"
import { useEffect } from "react";

export default function SSEClient() {
  useEffect(() => {
    const eventSource = new EventSource("/api/sse");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("New event:", data);
    };

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return <div>Check the console for server sent events.</div>;
}
