"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export const RegistrationComplete = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const registered = sessionStorage.getItem("registered");

    if (!email || !registered) {
      router.replace("/auth/sign-in");
      return;
    }



    const interval = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prev) => prev - 1);
      }
    }, 1000);

    const timeout = setTimeout(() => {
      sessionStorage.removeItem("registered");
      router.push("/auth/sign-in");
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [email, router, countdown]);

  return (
    <div className="min-h-screen w-full bg-gray-800 flex items-center justify-center p-4">
      {/* Gradient Background Effect */}
      <div className="w-full max-w-md relative">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 transform scale-[0.80] bg-opacity-50 blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800 px-8 py-12 h-full rounded-2xl overflow-hidden">
          <div className="relative text-center">
            <div className="flex items-center justify-center mb-8">
              <Image
                src="/taklif-logo.svg"
                alt="Taklif.ai Logo"
                width={350}
                height={350}
                priority
                className="object-contain"
              />{" "}
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Check Your Email
            </h2>
            <p className="text-gray-400 mb-4">
              We&apos;ve sent a confirmation link to{" "}
              <span className="font-bold text-purple-400">{email}</span>.
              <br />
              Please check your inbox and click the link to activate your account.
            </p>
            <p className="text-gray-400">
              Redirecting to sign in{" "}
              <span className="font-bold text-purple-400">{countdown}</span>{" "}
              seconds...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
