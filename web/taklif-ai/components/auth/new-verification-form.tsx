'use client';
import { Meteors } from "@/components/ui/meteors";
import { Brain } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (!token) {
            setError("Missing Token!");
            return;
        }

        newVerification(token)
            .then((data) => {
                setSuccess(data.success)
                setError(data.error)
            })
            .catch(() => {
                setError("Something went wrong!");
            })
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);


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
                        <h5 className="text-3xl font-bold text-center text-white mb-2">Confirming verification</h5>
                        <p className="text-gray-400 text-center mb-8">Confirm verification to continue to your AI workspace</p>
                        <div className="flex items-center w-full justify-center">

                            {!success && !error && (
                                <BeatLoader color="purple" />
                            )}

                            <FormSuccess message={success} />
                            <FormError message={error} />
                        </div>
                        <p className="mt-6 text-center text-gray-400">
                            Back to {" "}
                            <Link href="/auth/sign-in" className="text-purple-400 hover:text-purple-300">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div >
        </div >

    );
}