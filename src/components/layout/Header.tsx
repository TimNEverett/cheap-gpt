import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/lib/database.types";
import { useRouter } from "next/router";

export const Header = () => {
  const supabase = useSupabaseClient<Database>();
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };
  return (
    <div className="flex items-center justify-end bg-primary-500 text-white h-12 p-2">
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};
