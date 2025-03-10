import { NewPasswordForm } from "@/components/auth/new-password-form";
import { Suspense } from "react";

export const metadata = {
  title: "New Password",
};

const NewPasswordPage = () => {
  return (
    <Suspense>
      <NewPasswordForm />
    </Suspense>
  );
};

export default NewPasswordPage;
