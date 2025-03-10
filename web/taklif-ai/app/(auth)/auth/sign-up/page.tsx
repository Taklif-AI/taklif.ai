import { SignUp } from "@/components/auth/sign-up";
import { Suspense } from "react";

export const metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <Suspense>
      <SignUp />
    </Suspense>
  );
}
