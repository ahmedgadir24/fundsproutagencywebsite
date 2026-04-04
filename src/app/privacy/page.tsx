import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl prose-custom">
          <h1>Privacy Policy</h1>
          <p>
            <em>Last Updated: April 2026</em>
          </p>

          <p>
            This Privacy Policy describes how Fundsprout (&quot;we,&quot;
            &quot;us,&quot; or &quot;our&quot;) collects, uses, and protects
            information when you use the Fundsprout Grant Database (the
            &quot;Service&quot;) at this website.
          </p>

          <h2>1. Information We Collect</h2>

          <h3>1.1 Information You Provide</h3>
          <ul>
            <li>
              <strong>Account Information:</strong> When you create an account,
              we collect your email address and password. You may optionally
              provide your name and organization name.
            </li>
            <li>
              <strong>Assessment Information:</strong> If you use our grant
              matching assessment, we collect your organization type, focus area,
              and geographic location.
            </li>
            <li>
              <strong>Payment Information:</strong> Payment is processed by
              Stripe, Inc. We do not store your credit card number. We receive
              your email address and a transaction identifier from Stripe.
            </li>
          </ul>

          <h3>1.2 Information Collected Automatically</h3>
          <ul>
            <li>
              <strong>Usage Data:</strong> We may collect information about how
              you use the Service, such as pages visited, grants viewed, and
              search queries.
            </li>
            <li>
              <strong>Device Information:</strong> We may collect your browser
              type, operating system, and IP address for security and analytics
              purposes.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve the Service</li>
            <li>Process your payment and manage your account</li>
            <li>
              Send you updates about new grants and database changes (if you
              opted in)
            </li>
            <li>
              Respond to your requests, comments, or questions
            </li>
            <li>
              Detect, prevent, and address technical issues or fraud
            </li>
          </ul>

          <h2>3. How We Share Your Information</h2>
          <p>
            We do not sell, rent, or trade your personal information. We may
            share information with:
          </p>
          <ul>
            <li>
              <strong>Stripe:</strong> For payment processing. Stripe&apos;s
              privacy policy is available at{" "}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                stripe.com/privacy
              </a>
              .
            </li>
            <li>
              <strong>Supabase:</strong> For authentication and data storage.
              Supabase&apos;s privacy policy is available at{" "}
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                supabase.com/privacy
              </a>
              .
            </li>
            <li>
              <strong>As Required by Law:</strong> We may disclose information if
              required to do so by law or in response to valid legal process.
            </li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your
            information. All data is transmitted over HTTPS and stored in secure,
            encrypted databases. However, no method of transmission over the
            Internet is 100% secure.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain your account information for as long as your account is
            active or as needed to provide the Service. If you request account
            deletion, we will delete your personal information within 30 days,
            except as required by law.
          </p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your account and personal data</li>
            <li>Opt out of marketing communications at any time</li>
          </ul>

          <h2>7. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management.
            We do not use third-party advertising cookies.
          </p>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            The Service is not directed to children under 13. We do not
            knowingly collect information from children under 13.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of material changes by posting the updated policy on this page
            with a revised &quot;Last Updated&quot; date.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, contact us at{" "}
            <a href="mailto:support@fundsprout.ai">support@fundsprout.ai</a>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
