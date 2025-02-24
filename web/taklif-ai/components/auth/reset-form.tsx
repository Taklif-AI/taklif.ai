'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { useState, useTransition } from "react";
import { reset } from "@/actions/reset";
import Image from "next/image"

export const ResetForm = () => {
    const [formData, setFormData] = useState({ email: '' });
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        startTransition(() => {
            reset(formData)
                .then((data) => {
                    setError(data?.error);
                    setSuccess(data?.success);
                })
        })

    }
    return (
        <div className="min-h-screen w-full bg-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md relative">
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 transform scale-[0.80] bg-opacity-50 blur-3xl" />
                <div className="relative shadow-xl bg-gray-900 border border-gray-800 px-8 py-12 h-full rounded-2xl overflow-hidden">
                   

                    <div className="relative">
                        <div className="flex items-center justify-center mb-8">
<div className="flex items-center justify-center mb-8">
                <Image
                src="/taklif-logo.svg"
                alt="Taklif.ai Logo"
                width={350}
                height={350}
                priority
                className="object-contain"/>
              </div>                        </div>

                        <h2 className="text-3xl font-bold text-center text-white mb-2">Forgot password?</h2>
                        <p className="text-gray-400 text-center mb-8">Reset it to continue to your AI workspace</p>

                        <form className="mt-6 space-y-6" method="POST" onSubmit={handleSubmit}>
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

                            <FormError message={error} />
                            <FormSuccess message={success} />
                            <Button type="submit" disabled={isPending} className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-700 hover:to-purple-500 text-white">
                                Send reset email
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-gray-400">
                            Back to {" "}
                            <Link href="/auth/sign-in" className="text-purple-400 hover:text-purple-300">
                                login
                            </Link>
                        </p>
                    </div>
                </div>
            </div >
        </div >

    );
}
