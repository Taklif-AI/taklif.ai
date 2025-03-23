import { RegistrationComplete } from "@/components/auth/registration-complete";
import { Suspense } from "react";

export const metadata = {
  title: "Registration Complete",
};
const RegistrationCompletePage = () => {
  return (
    <Suspense>
      <RegistrationComplete />
    </Suspense>
  );
};

export default RegistrationCompletePage;
