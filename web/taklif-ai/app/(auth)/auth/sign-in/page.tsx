import { SignIn } from "@/components/auth/sign-in";
import { Suspense } from "react";

export const metadata = {
  title: "Sign In",
};

export default function Page() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  );
}
