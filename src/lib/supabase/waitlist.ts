import { supabase } from "./browserClient";

export const joinWaitlist = async (email: string) => {
  return await supabase.rpc("join_waitlist", {
    email,
  });
};
