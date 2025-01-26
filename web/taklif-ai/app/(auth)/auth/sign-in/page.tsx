import { SignIn } from "@/components/auth/sign-in";
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>

  );

}