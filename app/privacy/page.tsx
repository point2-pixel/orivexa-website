import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_CONFIG.name}.`,
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-24">
      <Container className="max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1 className="mt-8 text-display-md font-semibold tracking-tight text-white">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted-2">Last updated: July 2026</p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-muted">
          <p className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4 text-sm text-amber-200">
            This is a placeholder Privacy Policy for early development and
            testing. Before accepting real paying customers, have this
            reviewed and finalized by a qualified lawyer, especially for
            GDPR/data-residency requirements in your customers&apos;
            regions.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-white">1. What we collect</h2>
            <p className="mt-3">
              Account information (name, email) when you sign up, and any
              documents or content you choose to upload to your workspace.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">2. How we use it</h2>
            <p className="mt-3">
              To provide the Service — including processing your documents
              with Claude (Anthropic) to answer your questions — and to
              maintain your account and workspace.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">3. Third parties</h2>
            <p className="mt-3">
              We use Supabase for authentication and data storage, and
              Anthropic&apos;s Claude API to generate answers from your
              documents. Your content is not used to train models outside
              your workspace.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">4. Data retention</h2>
            <p className="mt-3">
              We keep your data as long as your account is active. You can
              delete uploaded documents at any time from the Documents page.
            </p>
          </section>

          <section id="cookies">
            <h2 className="text-lg font-semibold text-white">5. Cookies</h2>
            <p className="mt-3">
              We use essential cookies to keep you signed in and to remember
              your session. We don&apos;t use advertising or third-party
              tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">6. Your rights</h2>
            <p className="mt-3">
              You can access, export, or delete your data at any time.
              Contact us if you need help with a data request.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">7. Contact</h2>
            <p className="mt-3">
              Questions about this policy? Email{" "}
              <a
                href={`mailto:${SITE_CONFIG.contactEmail}`}
                className="text-white underline underline-offset-4 hover:text-accent"
              >
                {SITE_CONFIG.contactEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
