import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";

export const supabaseServiceClient = createClient(
  Deno.env.get("NEXT_PUBLIC_SUPABASE_URL") || "",
  Deno.env.get("SERVICE_KEY_SUPABASE") || ""
);
