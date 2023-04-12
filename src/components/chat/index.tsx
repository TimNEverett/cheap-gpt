// write a react component to show a message chat

import { useChat } from "@/contexts/chat.context";
import { Message } from "@/lib/database.aliases";
import { cn } from "@/utils/classname";
import { FC, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BiStop } from "react-icons/bi";

const Chat = () => {
  const {
    curConversationMessages,
    curResponse,
    curConversation,
    isStreamingResponse,
    stopStreamingResponse,
  } = useChat();
  const chatContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  }, [curConversationMessages, curResponse, chatContainer]);

  if (!curConversation)
    return (
      <div className="flex justify-center items-center w-full h-full bg-gray-200">
        <div>Start a new chat</div>
      </div>
    );

  return (
    <div className="flex flex-col justify-end w-full bg-gray-200 h-full relative pb-16">
      <div className="flex w-full flex-col overflow-hidden">
        <div
          ref={chatContainer}
          className="overflow-y-scroll overflow-x-hidden space-y-2 w-full flex flex-col items-center py-2"
        >
          {curConversationMessages
            .filter((m) => m.role !== "system")
            .map((m) => (
              <MessageListItem key={m.id} message={m} />
            ))}
          {curResponse && (
            <MessageListItem
              message={{
                content: curResponse,
                role: "assistant",
                id: Infinity,
                conversation: curConversation?.id || "",
                created_at: new Date().toDateString(),
              }}
            />
          )}
          {isStreamingResponse && (
            <div className="w-full flex justify-center">
              <button
                onClick={() => stopStreamingResponse()}
                className="bg-white p-2 rounded-full border-red-500 border-2 text-red-500"
              >
                <BiStop size="2em" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="absolute w-full bottom-0">
        <ChatInput />
      </div>
    </div>
  );
};

const MessageListItem: FC<{ message: Message }> = ({ message }) => {
  return (
    <div
      className={cn(
        "p-2 prose flex flex-col w-full rounded",
        message.role == "assistant" && "bg-gray-700 text-white",
        message.role == "user" && "bg-white"
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} className="">
        {message.content}
      </ReactMarkdown>
    </div>
  );
};

export default Chat;
