'use client';
import { Meteors } from "@/components/ui/meteors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";
import Link from "next/link";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/new-password";


export const NewPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
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

        console.log(formData);

        startTransition(() => {
            newPassword(formData,token)
                .then((data) => {
                    setError(data?.error);
                    setSuccess(data?.success);
                })
        })

    }
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

                        <h2 className="text-3xl font-bold text-center text-white mb-2">New password</h2>
                        <p className="text-gray-400 text-center mb-8">Enter password to continue to your AI workspace</p>

                        <form className="mt-6 space-y-6" method="POST" onSubmit={handleSubmit}>
                            <div>
                                <Input
                                    name="password"
                                    value={formData.password}
                                    type="password"
                                    disabled={isPending}
                                    placeholder="Password"
                                    className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Input
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    type="password"
                                    disabled={isPending}
                                    placeholder="Password Confirmation"
                                    className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400"
                                    onChange={handleChange}
                                />
                            </div>

                            <FormError message={error} />
                            <FormSuccess message={success} />
                            <Button type="submit" disabled={isPending} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                                Reset password
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
