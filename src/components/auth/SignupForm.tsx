import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { validateEmail, validatePassword } from "@/utils/validators";
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "@/lib/database.types";
import { useRouter } from "next/router";

// Supabase auth needs to be triggered client-side
export default function SignupForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const supabase = useSupabaseClient<Database>();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter and 1 number"
      );
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <form className="flex flex-col space-y-2 w-full" onSubmit={handleSubmit}>
      <Input
        label="email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        tooltip="Password must be minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter and 1 number"
      />
      <Button
        type="submit"
        disabled={!validateEmail(email) || !validatePassword(password)}
      >
        Sign up
      </Button>
      <div className="min-h-[6rem] text-red-700 text-center">{error}</div>
    </form>
  );
}
