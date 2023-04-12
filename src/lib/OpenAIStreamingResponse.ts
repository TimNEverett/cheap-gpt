import {
  CustomEventDataType,
  CustomEventType,
  SSE,
  SSEOptions,
  SSEOptionsMethod,
} from "sse-ts";
import { Message } from "./database.aliases";

type ServerSentEventHandlerProps = {
  onData: (data: any) => void;
  onComplete: () => void;
  onStart: () => void;
  messages: { role: string; content: string }[];
  accessToken: string;
};

export const serverSentEventHandler = ({
  messages,
  accessToken,
  onData,
  onStart,
  onComplete,
}: ServerSentEventHandlerProps) => {
  const sseOptions: SSEOptions = {
    method: SSEOptionsMethod.POST,
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
    payload: JSON.stringify({
      messages,
    }),
  };

  const source = new SSE(
    process.env.NEXT_PUBLIC_OPENAI_SUPABASE_URL || "",
    sseOptions
  );
  source.addEventListener("message", (event: CustomEventType) => {
    const dataEvent = event as CustomEventDataType;
    // Assuming we receive JSON-encoded data payloads:
    if (dataEvent.data === "[DONE]") {
      onComplete();
      source.close();
      return;
    }
    var payload = JSON.parse(dataEvent.data);
    onData(payload);
  });

  source.stream();
  onStart();
  return source;
};
