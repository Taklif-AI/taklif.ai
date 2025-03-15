import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
export function SocialAuthButtons() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <Button
          variant="outline"
          className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-800 hover:text-white"
          onClick={() =>
            signIn("google", {
              callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
            })
          }
        >
          <Image
            src="https://www.google.com/favicon.ico"
            alt="Google"
            width={20}
            height={16}
            className="mr-2"
          />
          Google
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-900 px-2 text-gray-400">
            Or continue with
          </span>
        </div>
      </div>
    </div>
  );
}
