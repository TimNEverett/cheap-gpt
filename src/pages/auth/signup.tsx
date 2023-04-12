"use client";
import Link from "next/link";
import SignupForm from "@/components/auth/SignupForm";

const Signup = () => {
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="p-2 md:p-40 w-full lg:p-80 text-center">
        <div className="text-xl ">Sign Up</div>
        <SignupForm />
        <Link href={"/auth/login"}>Login</Link>
      </div>
    </div>
  );
};

export default Signup;
