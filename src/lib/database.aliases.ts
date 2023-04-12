import { Database } from "./database.types";

export type Conversation = Database["public"]["Tables"]["conversation"]["Row"];
export type Message = Database["public"]["Tables"]["message"]["Row"];
export type MessageInsert = Database["public"]["Tables"]["message"]["Insert"];
