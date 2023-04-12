import { useChat } from "@/contexts/chat.context";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { IoMdReturnRight } from "react-icons/io";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage, isStreamingResponse } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isStreamingResponse) return;
    await sendMessage(message);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex border-t p-4 rounded bg-white items-center relative"
    >
      <TextareaAutosize
        className="flex-1 resize-none outline-none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxRows={15}
        placeholder="Type a message..."
        disabled={isStreamingResponse}
        onKeyUp={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <button
        type="submit"
        className="px-6 py-2 border rounded bg-primary-500 self-end text-white flex items-center space-x-2"
      >
        <IoMdReturnRight />
        {/* <span>Send</span> */}
      </button>
    </form>
  );
};

export default ChatInput;
