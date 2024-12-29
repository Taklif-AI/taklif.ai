import { Meteors } from "@/components/ui/meteors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";
import Link from "next/link";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";

export default function SignUp() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 transform scale-[0.80] bg-opacity-50 blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800 px-8 py-12 h-full rounded-2xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <Meteors number={20} />
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-center mb-8">
              <Brain className="h-12 w-12 text-purple-500" />
            </div>
            
            <h2 className="text-3xl font-bold text-center text-white mb-2">Create Account</h2>
            <p className="text-gray-400 text-center mb-8">Join our AI platform today</p>
            
            <SocialAuthButtons mode="sign-up" />
            
            <form className="mt-6 space-y-6">
              <div>
                <Input
                  type="text"
                  placeholder="Full name"
                  className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                Create Account
              </Button>
            </form>
            
            <p className="mt-6 text-center text-gray-400">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-purple-400 hover:text-purple-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}