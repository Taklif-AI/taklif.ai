'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { login } from "@/actions/login";
import { useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Turnstile } from 'next-turnstile';
import Link from "next/link";
import Image from "next/image"
export const SignIn = () => {
    const turnstileTokenRef = useRef<string | null>(null);
    const [turnstileStatus, setTurnstileStatus] = useState<
        "success" | "error" | "expired" | "required">("required");
    // const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [formData, setFormData] = useState({ email: '', password: '', code: '', 'cf-turnstile-response': '' });
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (turnstileStatus !== 'success' || !turnstileTokenRef.current) {
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
                .catch(() => setError('Something went wrong!'))
        })

    }
    return (
        <div className="min-h-screen w-full bg-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md relative">
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 transform scale-[0.80] bg-opacity-50 blur-3xl" />
                <div className="relative shadow-xl bg-gray-900 border border-gray-800 px-8 py-12 h-full rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        {/* <Meteors number={20} /> */}
                    </div>

                    <div className="relative">
                        <div className="flex items-center justify-center mb-8">
                            <Image
                                src="/taklif-logo.svg"
                                alt="Taklif.ai Logo"
                                width={350}
                                height={350}
                                priority
                                className="object-contain"
                            />                        </div>

                        <h2 className="text-3xl font-bold text-center text-white mb-2">{showTwoFactor ? "2FA" : "Welcome Back"}</h2>
                        {showTwoFactor && (
                            <p className="text-gray-400 text-center mb-8">Enter the code you just received in your email</p>
                        )}
                        {!showTwoFactor && (
                            <>
                                <p className="text-gray-400 text-center mb-8">Sign in to continue to your AI workspace</p>
                                <SocialAuthButtons />
                            </>
                        )}




                        <form className="mt-6 space-y-6" method="POST" onSubmit={handleSubmit}>

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
                                    <div>
                                        <Input
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            disabled={isPending}
                                            placeholder="Password"
                                            className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                                            onChange={handleChange}
                                        />
                                        <Button
                                            size="sm"
                                            variant="link"
                                            asChild
                                            className="px-0 mt-1 font-normal"
                                            color="purple"
                                        >

                                            <Link href="/auth/reset" className="text-purple-400 hover:text-purple-300">
                                                Forgot password?
                                            </Link>
                                        </Button>
                                    </div>
                                </>
                            )}


                            <Turnstile
                                className="flex w-full justify-center"
                                theme="dark"
                                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                                retry="auto"
                                size="normal"
                                refreshExpired="auto"
                                sandbox={process.env.NODE_ENV === 'development'}
                                onError={() => {
                                    setTurnstileStatus("error");
                                    setError("Security check failed. Please try again.");
                                }}
                                onExpire={() => {
                                    setTurnstileStatus("expired");
                                    setError("Security check expired. Please verify again.");
                                }}
                                onLoad={() => {
                                    setTurnstileStatus("required");
                                    setError("");
                                }}
                                onVerify={(token) => {
                                    setTurnstileStatus("success");
                                    turnstileTokenRef.current = token;
                                    // setTurnstileToken(token);
                                    setError("");
                                }}
                            />


                            <FormError message={error || urlError} />
                            <FormSuccess message={success} />
                            <Button type="submit" disabled={isPending} className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-700 hover:to-purple-500 text-white">
                                {showTwoFactor ? 'Confirm' : 'Login'}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-gray-400">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/sign-up" className="text-purple-400 hover:text-purple-300">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div >
        </div >

    );
}
