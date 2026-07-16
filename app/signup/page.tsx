import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create your workspace",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your workspace"
      subtitle="Your knowledge graph starts building the moment you sign up."
      footer={
        <>
          By signing up you agree to our{" "}
          <Link href="/terms" className="text-white hover:text-accent">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-white hover:text-accent">
            Privacy Policy
          </Link>
          .
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
