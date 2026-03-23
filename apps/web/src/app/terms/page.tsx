import PublicPageShell from "@/components/landing/PublicPageShell";

export const metadata = {
  title: "Terms of Service | Yapsolutely",
  description: "Terms and conditions for using the Yapsolutely voice agent platform.",
};

export default function TermsPage() {
  return (
    <PublicPageShell>
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <div className="mb-10">
          <h1 className="font-display text-[1.75rem] sm:text-[2.25rem] font-semibold tracking-[-0.03em] text-foreground mb-3 leading-[1.08]">
            Terms of Service
          </h1>
          <p className="font-body text-[0.82rem] text-text-subtle">
            Last updated: March 22, 2026
          </p>
        </div>

        <div className="prose-yap space-y-8">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Yapsolutely (&quot;the Platform&quot;), operated by Yapsolutely, Inc. (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to all of these Terms, you may not access or use the Platform.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              Yapsolutely provides an AI-powered voice agent platform that enables users to create, configure, and deploy conversational AI agents capable of handling inbound telephone calls. The Platform includes agent configuration tools, phone number provisioning, real-time call management, transcript generation, and analytics dashboards.
            </p>
          </section>

          <section>
            <h2>3. Account Registration</h2>
            <p>
              To use the Platform, you must create an account by providing accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2>4. Acceptable Use</h2>
            <p>You agree to use the Platform only for lawful purposes and in accordance with these Terms. You may not:</p>
            <ul>
              <li>Use the Platform for any illegal or unauthorized purpose</li>
              <li>Use AI agents to impersonate real individuals without their consent</li>
              <li>Make deceptive or misleading calls that violate applicable telemarketing laws</li>
              <li>Violate the Telephone Consumer Protection Act (TCPA) or similar regulations</li>
              <li>Use the Platform to harass, abuse, or threaten any person</li>
              <li>Attempt to gain unauthorized access to any part of the Platform</li>
              <li>Interfere with or disrupt the integrity or performance of the Platform</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Platform</li>
            </ul>
          </section>

          <section>
            <h2>5. AI Agent Disclosure</h2>
            <p>
              You are required to ensure that callers interacting with your AI agents are made aware, either at the beginning of the call or through appropriate disclosures, that they are communicating with an AI-powered system. Failure to provide adequate disclosure may result in account suspension or termination.
            </p>
          </section>

          <section>
            <h2>6. Telephony & Compliance</h2>
            <p>
              You are solely responsible for ensuring that your use of the Platform complies with all applicable telecommunications laws, including but not limited to the TCPA, FCC regulations, and state-level telemarketing laws. Yapsolutely provides the technical infrastructure but does not guarantee compliance on your behalf.
            </p>
          </section>

          <section>
            <h2>7. Intellectual Property</h2>
            <p>
              The Platform, including all software, designs, text, and other content, is owned by Yapsolutely, Inc. and is protected by copyright, trademark, and other intellectual property laws. You retain ownership of your agent configurations, prompts, and any data you upload to the Platform, subject to our right to use such data to provide and improve the service.
            </p>
          </section>

          <section>
            <h2>8. Data & Transcripts</h2>
            <p>
              Call recordings and transcripts generated through the Platform are stored securely and accessible through your account dashboard. You are responsible for ensuring that your use of call recording and transcription features complies with applicable consent and disclosure laws in all relevant jurisdictions.
            </p>
          </section>

          <section>
            <h2>9. Payment Terms</h2>
            <p>
              Certain features of the Platform may require payment. You agree to pay all fees associated with your selected plan in a timely manner. Fees are non-refundable except as required by law or as explicitly stated in these Terms. We reserve the right to change pricing with 30 days&apos; notice.
            </p>
          </section>

          <section>
            <h2>10. Service Availability</h2>
            <p>
              We strive to maintain high availability but do not guarantee uninterrupted access to the Platform. We may suspend or restrict access for maintenance, updates, or security reasons. We are not liable for any losses resulting from service interruptions.
            </p>
          </section>

          <section>
            <h2>11. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Yapsolutely, Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising from your use of the Platform.
            </p>
          </section>

          <section>
            <h2>12. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Yapsolutely, Inc. and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Platform, your violation of these Terms, or your violation of any rights of a third party.
            </p>
          </section>

          <section>
            <h2>13. Termination</h2>
            <p>
              We may suspend or terminate your account at any time for violation of these Terms or for any other reason at our discretion. Upon termination, your right to use the Platform ceases immediately. You may export your data within 30 days of termination.
            </p>
          </section>

          <section>
            <h2>14. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be communicated via email or through the Platform at least 30 days before they take effect. Continued use of the Platform after changes become effective constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2>15. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the state or federal courts located in Delaware.
            </p>
          </section>

          <section>
            <h2>16. Contact</h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <a href="mailto:legal@yapsolutely.com" className="text-text-body hover:text-foreground transition-colors underline underline-offset-2">
                legal@yapsolutely.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </PublicPageShell>
  );
}
