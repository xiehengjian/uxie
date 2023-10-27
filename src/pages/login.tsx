import { Spinner } from "@/components/Spinner";
import { BrainIcon, ChevronLeftIcon, GoogleIcon } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container flex w-screen flex-col">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-fit justify-start",
        )}
      >
        <>
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Back
        </>
      </Link>
      <div className="mx-auto flex flex-1 flex-col justify-center space-y-6 sm:w-[350px]">
        <>
          <div className="flex flex-col space-y-2 text-center">
            <BrainIcon className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
          </div>

          <button
            type="button"
            className={cn(buttonVariants({ variant: "outline" }))}
            onClick={() => {
              setIsLoading(true);
              signIn("google");
            }}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : <GoogleIcon className="mr-2 h-4 w-4" />}{" "}
            Google
          </button>
        </>
      </div>
    </div>
  );
};
export default Login;
