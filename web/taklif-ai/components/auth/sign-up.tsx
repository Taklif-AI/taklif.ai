"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { useState, useTransition } from "react";
import { register } from "@/actions/register";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
export const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    startTransition(() => {
      register(formData).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

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
              />{" "}
            </div>

            <h2 className="text-3xl font-bold text-center text-white mb-2">
              Create Account
            </h2>
            <p className="text-gray-400 text-center mb-8">
              Join our AI platform today
            </p>

            <SocialAuthButtons />

            <form
              className="mt-6 space-y-6"
              method="POST"
              onSubmit={handleSubmit}
            >
              <div>
                <Input
                  name="name"
                  value={formData.name}
                  type="text"
                  disabled={isPending}
                  placeholder="Name"
                  className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  name="email"
                  value={formData.email}
                  type="email"
                  disabled={isPending}
                  placeholder="Email"
                  className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <Input
                  name="password"
                  value={formData.password}
                  type={showPassword ? "text" : "password"}
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
              <div className="relative">
                <Input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  type={showConfirmPassword ? "text" : "password"}
                  disabled={isPending}
                  placeholder="Password Confirmation"
                  className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-purple-400 hover:text-purple-300" />
                  ) : (
                    <Eye className="h-4 w-4 text-purple-400 hover:text-purple-300" />
                  )}
                </button>
              </div>

              <FormError message={error} />
              <FormSuccess message={success} />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-700 hover:to-purple-500 text-white"
              >
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/sign-in"
                className="text-purple-400 hover:text-purple-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
