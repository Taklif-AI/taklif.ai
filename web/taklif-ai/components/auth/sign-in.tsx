"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Turnstile } from "next-turnstile";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { login } from "@/actions/login";

export const SignIn = () => {
  const turnstileTokenRef = useRef<string | null>(null);
  const [turnstileStatus, setTurnstileStatus] = useState<
    "success" | "error" | "expired" | "required"
  >("required");

  const [turnstileSize, setTurnstileSize] = useState<"normal" | "compact">(
    "normal"
  );

  useEffect(() => {
    // Update Turnstile size based on screen width
    const updateTurnstileSize = () => {
      setTurnstileSize(window.innerWidth < 640 ? "compact" : "normal");
    };

    updateTurnstileSize(); // Initial check
    window.addEventListener("resize", updateTurnstileSize);

    return () => {
      window.removeEventListener("resize", updateTurnstileSize);
    };
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: "",
    "cf-turnstile-response": "",
  });
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [showPassword, setShowPassword] = useState(false);
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (turnstileStatus !== "success" || !turnstileTokenRef.current) {
      setError("Please verify you are not a robot!");
      return;
    }

    startTransition(() => {
      login({ ...formData, token: turnstileTokenRef.current }, callbackUrl)
        .then((data) => {
          if (data?.error) {
            setError(data.error);
          }

          if (data?.success) {
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 transform scale-[0.80] bg-opacity-50 blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800 px-8 py-12 h-full rounded-2xl overflow-hidden">
          <div className="relative">
            <div className="flex items-center justify-center mb-8">
              <Image
                src="/taklif-logo.svg"
                alt="Taklif.ai Logo"
                width={350}
                height={350}
                priority
                className="object-contain"
              />
            </div>

            <h2 className="text-3xl font-bold text-center text-white mb-2">
              {showTwoFactor ? "2FA" : "Welcome Back"}
            </h2>

            {!showTwoFactor && (
              <>
                <p className="text-gray-400 text-center mb-8">
                  Continue your AI-powered learning
                </p>
                <SocialAuthButtons />
              </>
            )}

            <form
              className="mt-6 space-y-6"
              method="POST"
              onSubmit={handleSubmit}
            >
              {showTwoFactor && (
                <div>
                  <Input
                    name="code"
                    type="text"
                    value={formData.code}
                    disabled={isPending}
                    placeholder="Two Factor Code"
                    className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                    onChange={handleChange}
                  />
                </div>
              )}

              {!showTwoFactor && (
                <>
                  <div>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled={isPending}
                      placeholder="Email address"
                      className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      disabled={isPending}
                      placeholder="Password"
                      className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-purple-400 hover:text-purple-300" />
                      ) : (
                        <Eye className="h-4 w-4 text-purple-400 hover:text-purple-300" />
                      )}
                    </button>
                  </div>
                  <Button size="sm" variant="link" asChild className="px-0 font-normal">
                    <Link href="/auth/reset" className="text-purple-400 hover:text-purple-300">
                      Forgot password?
                    </Link>
                  </Button>
                </>
              )}

              {/* Responsive Turnstile */}
              <Turnstile
                key={showTwoFactor ? "2fa" : "login"}
                className="flex w-full justify-center"
                theme="dark"
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                retry="auto"
                size={turnstileSize} // Dynamic size
                refreshExpired="auto"
                sandbox={process.env.NODE_ENV === "development"}
                onError={() => setTurnstileStatus("error")}
                onExpire={() => setTurnstileStatus("expired")}
                onLoad={() => setTurnstileStatus("required")}
                onVerify={(token) => {
                  setTurnstileStatus("success");
                  turnstileTokenRef.current = token;
                  setError("");
                }}
              />

              <FormError message={error || urlError} />
              <FormSuccess message={success} />
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-700 hover:to-purple-500 text-white"
              >
                {showTwoFactor ? "Confirm" : "Login"}
              </Button>
            </form>

            <p className="mt-6 text-center text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/auth/sign-up" className="text-purple-400 hover:text-purple-300">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
