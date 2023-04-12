import { useChat } from "@/contexts/chat.context";
import { Conversation } from "@/lib/database.aliases";
import { cn } from "@/utils/classname";
import { formatRelativeDate } from "@/utils/formatters";
import { FC } from "react";
import { BiMessage, BiPlus, BiTrash } from "react-icons/bi";

const ConversationList = () => {
  const { conversations, createConversation, selectConversation } = useChat();
  const sortDateDescending = (a: Conversation, b: Conversation) => {
    const aDate = new Date(a.created_at);
    const bDate = new Date(b.created_at);
    if (aDate > bDate) return -1;
    if (aDate < bDate) return 1;
    return 0;
  };

  return (
    <div className="flex flex-col w-full p-2 space-y-2">
      <button
        className="p-2 border rounded flex items-center bg-primary-500 text-white"
        onClick={() => createConversation()}
      >
        <BiPlus className="w-8" />
        <span>New Chat</span>
      </button>
      {conversations.sort(sortDateDescending).map((c) => (
        <ConversationListItem
          key={c.id}
          conversation={c}
          onClick={() => selectConversation(c.id)}
        />
      ))}
    </div>
  );
};

const ConversationListItem: FC<{
  conversation: Conversation;
  onClick: () => void;
}> = ({ conversation, onClick }) => {
  const { deleteConversation, curConversation } = useChat();
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteConversation(conversation.id);
  };
  return (
    <div className="flex w-full items-center ">
      <div
        className={cn(
          "flex items-center hover:bg-gray-200 w-full py-2",
          conversation.id === curConversation?.id && "bg-gray-200"
        )}
        onClick={onClick}
      >
        <BiMessage className="w-6" />
        <div className="text-start text-sm flex-1 truncate">
          {conversation.name
            ? conversation.name
            : formatRelativeDate(conversation.created_at)}
        </div>
        <button
          className="w-6 flex justify-center h-full items-center"
          onClick={handleDelete}
        >
          <BiTrash />
        </button>
      </div>
    </div>
  );
};

export default ConversationList;
