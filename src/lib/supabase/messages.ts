import { supabase } from "./browserClient";

export const saveMessage = async ({
  content,
  conversation,
  role,
}: {
  content: string;
  conversation: string;
  role: "user" | "assistant" | "system";
}) => {
  return await supabase
    .from("message")
    .insert({
      content,
      conversation,
      role,
    })
    .select("*")
    .limit(1)
    .single();
};

export const loadMessages = async (conversation: string) => {
  return await supabase
    .from("message")
    .select("*")
    .eq("conversation", conversation)
    .order("created_at", { ascending: true });
};
