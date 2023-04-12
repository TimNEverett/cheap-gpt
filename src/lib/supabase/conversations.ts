import { supabase } from "./browserClient";

export const loadConversations = async () => {
  return await supabase
    .from("conversation")
    .select("*")
    .order("created_at", { ascending: true });
};

export const delConversation = async (conversationId: string) => {
  return await supabase.from("conversation").delete().eq("id", conversationId);
};
