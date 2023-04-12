// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  ChatCompletionOptions,
  OpenAI,
} from "https://deno.land/x/openai@1.2.1/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseServiceClient } from "../_shared/supabase.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    // Now we can get the session or user object
    const payload = await req.json();
    console.log(payload);
    const {
      record: { id: conversation_id },
    } = payload;
    // get messages from the conversation in supabase

    const { data: messages, error } = await supabaseServiceClient
      .from("message")
      .select("*")
      .eq("conversation", conversation_id)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    //get messages for the conversation in supabase
    const parsedMessages = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    // have openAI generate a name for the conversation

    const options: ChatCompletionOptions = {
      model: Deno.env.get("OPENAI_MODEL") || "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an api taking creating a name for a conversation from the first two messages. Return only a name",
        },
        ...parsedMessages,
        { role: "user", content: "Generate a name for this conversation" },
      ],
      temperature: 0,
    };

    const openAi = new OpenAI(Deno.env.get("OPENAI_API_KEY") || "");

    const chatResponse = await openAi.createChatCompletion(options);

    const name = chatResponse.choices[0].message.content;

    // update the conversation in supabase with the generated name

    const { error: updateError } = await supabaseServiceClient
      .from("conversation")
      .update({ name })
      .eq("id", conversation_id);

    if (updateError) throw new Error(updateError.message);

    return new Response(null, { headers: corsHeaders, status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
