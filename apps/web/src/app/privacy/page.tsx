import PublicPageShell from "@/components/landing/PublicPageShell";

export const metadata = {
  title: "Privacy Policy — Yapsolutely",
  description: "How Yapsolutely collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <PublicPageShell>
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <div className="mb-10">
          <h1 className="font-display text-[1.75rem] sm:text-[2.25rem] font-semibold tracking-[-0.03em] text-foreground mb-3 leading-[1.08]">
            Privacy Policy
          </h1>
          <p className="font-body text-[0.82rem] text-text-subtle">
            Last updated: March 22, 2026
          </p>
        </div>

        <div className="prose-yap space-y-8">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Yapsolutely, Inc. (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the Yapsolutely platform (&quot;the Platform&quot;), including our website, dashboard, APIs, and voice agent services.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <h3>Account Information</h3>
            <p>
              When you create an account, we collect your name, email address, password (hashed), and optionally your organization name and role. If you sign in via Google OAuth, we receive your name, email, and profile picture from Google.
            </p>
            <h3>Agent & Configuration Data</h3>
            <p>
              We store the agent configurations you create, including system prompts, voice model selections, first messages, tool integrations, and other customization settings.
            </p>
            <h3>Call Data</h3>
            <p>
              When calls are handled through the Platform, we collect call metadata (caller number, duration, timestamps, status), call recordings (where enabled), and generated transcripts. Caller phone numbers are collected as part of standard telephony operations.
            </p>
            <h3>Usage Data</h3>
            <p>
              We automatically collect information about how you interact with the Platform, including pages visited, features used, API calls made, browser type, operating system, and IP address.
            </p>
            <h3>Payment Information</h3>
            <p>
              Payment processing is handled by third-party payment processors. We do not store your full credit card number or banking details on our servers.
            </p>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve the Platform</li>
              <li>Process and manage your AI voice agent configurations</li>
              <li>Handle inbound calls and generate transcripts</li>
              <li>Send you service-related notifications and updates</li>
              <li>Respond to your requests and support inquiries</li>
              <li>Monitor and analyze usage patterns to improve performance</li>
              <li>Detect, prevent, and address security issues and fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2>4. Call Recording & Transcription</h2>
            <p>
              Call recordings and transcripts are stored securely and are accessible only through your authenticated account. We process call audio using third-party speech-to-text and text-to-speech providers (such as Deepgram) to enable real-time voice conversations and generate transcripts. Audio data sent to these providers is processed in accordance with their respective privacy policies and data processing agreements.
            </p>
            <p>
              You are responsible for providing appropriate notice and obtaining any required consent from callers regarding recording and transcription, in compliance with applicable federal and state laws.
            </p>
          </section>

          <section>
            <h2>5. AI Processing</h2>
            <p>
              Conversation content is processed by AI language models (such as Anthropic Claude) to generate agent responses in real time. We transmit conversation context to these providers during active calls. These providers process data in accordance with their own privacy policies and do not retain conversation data for their own training purposes under our agreements.
            </p>
          </section>

          <section>
            <h2>6. Data Sharing & Disclosure</h2>
            <p>We may share your information with:</p>
            <ul>
              <li><strong>Service providers:</strong> Third-party vendors who assist in operating the Platform (telephony, AI, hosting, analytics, payment processing)</li>
              <li><strong>Legal requirements:</strong> When required by law, regulation, or legal process</li>
              <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With your consent:</strong> When you explicitly authorize sharing</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>
          </section>

          <section>
            <h2>7. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information, including encryption in transit (TLS) and at rest, access controls, secure authentication (bcrypt password hashing), and regular security reviews. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2>8. Data Retention</h2>
            <p>
              We retain your account data for as long as your account is active. Call recordings and transcripts are retained according to your account settings and applicable retention policies. Upon account deletion, we will remove your personal data within 30 days, except where retention is required by law.
            </p>
          </section>

          <section>
            <h2>9. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of certain data processing activities</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p>
              To exercise these rights, contact us at{" "}
              <a href="mailto:privacy@yapsolutely.com" className="text-text-body hover:text-foreground transition-colors underline underline-offset-2">
                privacy@yapsolutely.com
              </a>.
            </p>
          </section>

          <section>
            <h2>10. Cookies & Tracking</h2>
            <p>
              We use essential cookies to maintain your session and authentication state. We may use analytics cookies to understand how you use the Platform. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2>11. Children&apos;s Privacy</h2>
            <p>
              The Platform is not intended for use by individuals under 18 years of age. We do not knowingly collect personal information from children. If we learn that we have collected data from a child, we will take steps to delete that information promptly.
            </p>
          </section>

          <section>
            <h2>12. International Data Transfers</h2>
            <p>
              Your information may be processed and stored in the United States or other countries where our service providers operate. By using the Platform, you consent to the transfer of your information to these jurisdictions, which may have different data protection laws than your country of residence.
            </p>
          </section>

          <section>
            <h2>13. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be communicated via email or through the Platform at least 30 days before they take effect. The &quot;Last updated&quot; date at the top of this policy reflects the most recent revision.
            </p>
          </section>

          <section>
            <h2>14. Contact Us</h2>
            <p>
              For questions or concerns about this Privacy Policy or our data practices, contact us at{" "}
              <a href="mailto:privacy@yapsolutely.com" className="text-text-body hover:text-foreground transition-colors underline underline-offset-2">
                privacy@yapsolutely.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </PublicPageShell>
  );
}
