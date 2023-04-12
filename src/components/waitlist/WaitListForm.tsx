import { validateEmail } from "@/utils/validators";
import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { joinWaitlist } from "@/lib/supabase/waitlist";
import Link from "next/link";

export const WaitListForm = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState<string>("");
  const [joined, setJoined] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }
    const { error: joinWaitlistError } = await joinWaitlist(email);
    if (joinWaitlistError) {
      if (
        joinWaitlistError.message ===
        'duplicate key value violates unique constraint "allow_list_email_key"'
      ) {
        setJoined(true);
      } else {
        setError(joinWaitlistError.message);
      }
    } else {
      setJoined(true);
    }
  };

  if (joined)
    return (
      <div className="text-center flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">Thank you!</h2>
        <p className="text-gray-700">
          You have been added to the waitlist. <br /> We will send you an email
          to let you know you are in!
        </p>
        <Link href="/" className="underline mt-12">
          Go back to Login
        </Link>
      </div>
    );
  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2 w-full">
      <div className="text-xl">Waitlist</div>
      <Input
        label="email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit" disabled={!validateEmail(email)}>
        Join Waitlist
      </Button>
      <div className="min-h-[6rem] text-red-700 text-center">{error}</div>
    </form>
  );
};
