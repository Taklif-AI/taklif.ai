import { NewVerificationForm } from "@/components/auth/new-verification-form";
import { Suspense } from "react";

export const metadata = {
  title: "Email Verification",
};
const NewVerificationPage = () => {
  return (
    <Suspense>
      <NewVerificationForm />
    </Suspense>
  );
};

export default NewVerificationPage;
