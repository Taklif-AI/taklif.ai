import { SignUp } from "@/components/auth/sign-up";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <SignUp />
    </Suspense>
  );
}
