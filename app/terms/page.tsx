import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${SITE_CONFIG.name}.`,
};

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-muted-2">Last updated: July 2026</p>

        <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-muted">
          <p className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4 text-sm text-amber-200">
            This is a placeholder Terms of Service for early development and
            testing. Before accepting real paying customers, have this
            reviewed and finalized by a qualified lawyer.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-white">1. Agreement to Terms</h2>
            <p className="mt-3">
              By accessing or using {SITE_CONFIG.name} (&ldquo;the
              Service&rdquo;), you agree to be bound by these Terms of
              Service. If you don&apos;t agree to these terms, please don&apos;t
              use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">2. Description of Service</h2>
            <p className="mt-3">
              {SITE_CONFIG.name} provides an AI-powered workspace that helps
              teams organize, search, and connect company knowledge,
              including documents you choose to upload.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">3. Accounts</h2>
            <p className="mt-3">
              You&apos;re responsible for maintaining the security of your
              account and for all activity that happens under it. Notify us
              immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">4. Your Content</h2>
            <p className="mt-3">
              You retain ownership of any documents or content you upload.
              You grant us a limited license to store and process that
              content solely to provide the Service to you.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">5. Acceptable Use</h2>
            <p className="mt-3">
              Don&apos;t use the Service to upload unlawful content, infringe
              on others&apos; rights, or attempt to disrupt or reverse-engineer
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">6. Termination</h2>
            <p className="mt-3">
              You may stop using the Service at any time. We may suspend or
              terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">7. Disclaimer</h2>
            <p className="mt-3">
              The Service is provided &ldquo;as is&rdquo; without warranties
              of any kind. AI-generated answers may be inaccurate — verify
              anything important against the source documents.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">8. Contact</h2>
            <p className="mt-3">
              Questions about these terms? Email{" "}
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
