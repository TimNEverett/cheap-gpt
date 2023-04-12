import { WaitListForm } from "@/components/waitlist/WaitListForm";

const Login = () => {
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <div className="p-2 md:p-40 w-full lg:p-80 text-center">
        <WaitListForm />
      </div>
    </div>
  );
};

export default Login;
