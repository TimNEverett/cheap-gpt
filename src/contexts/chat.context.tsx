// make react context using typescript
import { Conversation, Message } from "@/lib/database.aliases";
import { Database } from "@/lib/database.types";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { serverSentEventHandler } from "@/lib/OpenAIStreamingResponse";
import { loadMessages, saveMessage } from "@/lib/supabase/messages";
import {
  delConversation,
  loadConversations,
} from "@/lib/supabase/conversations";
import { SSE } from "sse-ts";

interface IChatContext {
  conversations: Conversation[];
  curConversation: Conversation | null;
  curConversationMessages: Message[]; //use message id as key
  createConversation: () => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  curResponse: string;
  selectConversation: (conversationId: string) => void;
  isStreamingResponse: boolean;
  deleteConversation: (conversationId: string) => Promise<void>;
  stopStreamingResponse: () => void;
}

const ChatContext = createContext<IChatContext>({
  conversations: [],
  curConversation: null,
  curConversationMessages: [],
  createConversation: async () => {},
  sendMessage: async () => {},
  curResponse: "",
  selectConversation: () => {},
  isStreamingResponse: false,
  deleteConversation: async () => {},
  stopStreamingResponse: () => {},
});

export const ChatProvider: FC<PropsWithChildren> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [curConversation, setCurConversation] = useState<Conversation | null>(
    null
  );
  const [curConversationMessages, setCurConversationMessages] = useState<
    Message[]
  >([]);

  const [response, setResponse] = useState<string>("");
  const [isStreamingResponse, setIsStreamingResponse] =
    useState<boolean>(false);

  const [source, setSource] = useState<SSE | null>(null);

  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const session = useSession();

  const selectConversation = (conversationId: string) => {
    setCurConversation(
      conversations.find((c) => c.id === conversationId) || null
    );
  };

  const createConversation = async () => {
    if (!user) return;
    const { data: conversation, error } = await supabase
      .from("conversation")
      .insert({})
      .select("*")
      .limit(1)
      .single();
    if (error) console.error(`createConversation ERROR: ${error.message}`);
    if (conversation) {
      setConversations([...conversations, conversation]);
      setCurConversation(conversation);
    }
  };
  const sendMessage = useCallback(
    async (content: string) => {
      // hit the supabase function
      if (!session || !content || !curConversation) return;
      if (isStreamingResponse) return; // don't allow new messages while streaming response
      const { data, error } = await saveMessage({
        content,
        conversation: curConversation.id,
        role: "user",
      });
      if (error)
        console.error(
          `sendMessage - save user message ERROR : ${error.message}`
        );
      if (data) {
        setCurConversationMessages((prev) => [...prev, data]);
      }

      const source = serverSentEventHandler({
        messages: [
          {
            role: "system",
            content: curConversation.system_instruction,
          },
          ...curConversationMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: "user", content },
        ],
        accessToken: session.access_token,
        onData: (event) => {
          const data = event.choices[0].delta.content;
          if (data) setResponse((prev) => (prev += data));
        },
        onStart: () => setIsStreamingResponse(true),
        onComplete: async () => {
          setIsStreamingResponse(false);
          setSource(null);
        },
      });
      setSource(source);
    },
    [curConversation, session, isStreamingResponse, curConversationMessages]
  );

  const deleteConversation = async (conversationId: string) => {
    if (!user) return;
    const { error } = await delConversation(conversationId);
    if (error) console.error(`deleteConversation ERROR: ${error.message}`);
    else {
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (curConversation?.id === conversationId) {
        setCurConversation(null);
        setCurConversationMessages([]);
      }
    }
  };

  const stopStreamingResponse = () => {
    if (source) source.close();
    setIsStreamingResponse(false);
  };

  useEffect(() => {
    const effect = async () => {
      if (curConversation && response && !isStreamingResponse) {
        const { data: newMessage, error } = await saveMessage({
          content: response,
          conversation: curConversation.id,
          role: "assistant",
        });

        if (error)
          console.error(`sendMessage OnComplete ERROR: ${error.message}`);
        if (newMessage) {
          setCurConversationMessages((prev) => [...prev, newMessage]);
          setResponse("");
        }
      }
    };
    effect();
  }, [isStreamingResponse, response, curConversation]);

  useEffect(() => {
    const effect = async () => {
      if (!user) return;
      const { data: conversations, error } = await loadConversations();
      if (error) console.error(`loadConversations ERROR: ${error.message}`);
      if (conversations && conversations.length > 0) {
        setConversations(conversations);
        setCurConversation(conversations[conversations.length - 1]);
      }
    };
    if (user && supabase) effect();
  }, [user, supabase]);

  useEffect(() => {
    const effect = async () => {
      if (!curConversation) return;
      const { data: messages, error } = await loadMessages(curConversation.id);

      if (error) console.error(`loadMessages ERROR: ${error.message}`);
      if (messages) {
        setCurConversationMessages(messages);
      }
    };
    if (supabase && curConversation) effect();
  }, [supabase, curConversation]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        curConversation,
        curConversationMessages,
        createConversation,
        sendMessage,
        curResponse: response,
        selectConversation,
        isStreamingResponse,
        deleteConversation,
        stopStreamingResponse,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
