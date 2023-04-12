import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

const Login = () => {
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="p-2 md:p-40 w-full lg:p-80 text-center">
        <div className="text-xl">Login</div>
        <LoginForm />
        <Link href={"/auth/signup"}>Sign up</Link>
      </div>
    </div>
  );
};

export default Login;
