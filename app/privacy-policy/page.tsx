import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | WE PRO Industrial Products",
  description:
    "Privacy Policy for WE PRO Industrial Products.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Last Updated: October 3, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="space-y-10 leading-7 text-gray-700">
          {/* Introduction */}
          <section>
            <p>
              <strong className="font-semibold text-gray-900">
                WE PRO Industrial Products
              </strong>

            </p>

            <p className="mt-4">
              This Privacy Policy explains what information we collect, how we
              use it, how we protect it, and the choices available to you when
              you use our website and services.
            </p>

            <p className="mt-4">
              By using our website, you acknowledge that you have read and
              understood this Privacy Policy.
            </p>
          </section>

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              1. Information We Collect
            </h2>

            <p className="mt-4">
              We may collect information that you voluntarily provide to us
              when you contact us or submit an enquiry through our website.
            </p>

            <p className="mt-4">This may include:</p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Product or product-related information</li>
              <li>Message or enquiry details</li>
              <li>Any other information you voluntarily provide to us</li>
            </ul>

            <p className="mt-4">
              We may also automatically receive limited technical information
              when you visit our website, such as browser type, device
              information, IP address, and information necessary for website
              security and operation, where applicable.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              2. How We Use Your Information
            </h2>

            <p className="mt-4">
              We may use the information you provide for the following
              purposes:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>To respond to your enquiries</li>
              <li>To provide information about our products</li>
              <li>To communicate with you regarding your enquiry</li>
              <li>To understand your product requirements</li>
              <li>To provide customer support</li>
              <li>To improve our website, products, and services</li>
              <li>To maintain the security and functionality of our website</li>
              <li>To comply with applicable legal obligations</li>
            </ul>

            <p className="mt-4">
              We will use personal information only for legitimate and
              specified purposes relevant to the operation of our business and
              website.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              3. Product Enquiries
            </h2>

            <p className="mt-4">
              When you submit an enquiry through our website, the information
              you provide may be stored in our database and accessed by
              authorized WE PRO personnel for the purpose of responding to your
              enquiry.
            </p>

            <p className="mt-4">
              We do not make your enquiry information publicly available.
            </p>

            <p className="mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              4. Data Storage and Service Providers
            </h2>

            <p className="mt-4">
              Our website uses third-party technology and infrastructure
              providers to operate certain parts of our website and services.
            </p>

            <p className="mt-4">These may include:</p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong className="font-semibold text-gray-900">
                  Supabase
                </strong>{" "}
                — for database, authentication, and storage services
              </li>

              <li>
                <strong className="font-semibold text-gray-900">
                  Vercel
                </strong>{" "}
                — for website hosting and deployment
              </li>

              <li>
                <strong className="font-semibold text-gray-900">
                  Brevo
                </strong>{" "}
                — where applicable, for email communication and
                enquiry-related notifications
              </li>

              <li>
                <strong className="font-semibold text-gray-900">
                  Hostinger
                </strong>{" "}
                — for domain-related services
              </li>
            </ul>

            <p className="mt-4">
              These service providers may process or store information as
              necessary to provide their respective services.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              5. Data Security
            </h2>

            <p className="mt-4">
              We take reasonable technical and organizational measures to
              protect personal information against unauthorized access,
              alteration, disclosure, loss, or misuse.
            </p>

            <p className="mt-4">
              Our website uses HTTPS/TLS encryption for data transmitted
              between your browser and our website.
            </p>

            <p className="mt-4">
              Access to administrative systems and customer enquiry
              information is restricted to authorized personnel.
            </p>

            <p className="mt-4">
              However, no method of transmission or electronic storage can be
              guaranteed to be completely secure.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              6. Data Retention
            </h2>

            <p className="mt-4">
              We retain personal information only for as long as reasonably
              necessary for the purposes described in this Privacy Policy,
              including responding to enquiries, maintaining business records,
              resolving disputes, complying with legal obligations, and
              protecting our legitimate interests.
            </p>

            <p className="mt-4">
              When personal information is no longer required, we may securely
              delete or anonymize it, subject to applicable legal or regulatory
              requirements.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              7. Sharing of Personal Information
            </h2>

            <p className="mt-4">
              We do not sell or rent your personal information.
            </p>

            <p className="mt-4">We may share information with:</p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                Authorized employees or representatives who need the
                information to respond to your enquiry
              </li>

              <li>
                Technology and service providers that help us operate our
                website
              </li>

              <li>
                Government authorities or law-enforcement agencies where
                required by applicable law
              </li>

              <li>
                Professional advisers where reasonably necessary for legal,
                security, or compliance purposes
              </li>
            </ul>

            <p className="mt-4">
              Any sharing will be limited to what is reasonably necessary for
              the relevant purpose.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              8. Cookies and Similar Technologies
            </h2>

            <p className="mt-4">
              Our website may use cookies or similar technologies that are
              necessary for website functionality, security, authentication,
              or improving the user experience.
            </p>

            <p className="mt-4">
              Where applicable, additional cookies or analytics technologies
              may be used to understand website usage.
            </p>

            <p className="mt-4">
              You may be able to control cookies through your browser settings.
            </p>

            <p className="mt-4">
              If we introduce optional analytics, advertising, or other
              non-essential tracking technologies, we will provide appropriate
              information and choices where required by applicable law.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              9. Your Rights
            </h2>

            <p className="mt-4">
              Subject to applicable law, you may have rights relating to your
              personal information, including the ability to:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                Request information about the personal data we process about
                you
              </li>

              <li>
                Request correction of inaccurate or incomplete personal
                information
              </li>

              <li>
                Request deletion of personal information where applicable
              </li>

              <li>
                Withdraw consent where processing is based on consent
              </li>

              <li>
                Raise a grievance regarding the processing of your personal
                information
              </li>

              <li>
                Exercise other rights available to you under applicable
                data-protection laws
              </li>
            </ul>

            <p className="mt-4">
              Requests may be submitted using the contact details provided
              below.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              10. Withdrawal of Consent
            </h2>

            <p className="mt-4">
              Where we process your personal information based on your consent,
              you may withdraw that consent by contacting us using the details
              provided below.
            </p>

            <p className="mt-4">
              Withdrawal of consent will not affect the lawfulness of
              processing carried out before the withdrawal.
            </p>

            <p className="mt-4">
              Where another legal basis permits or requires us to retain or
              process information, we may continue such processing to the
              extent permitted or required by law.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              11. Children&apos;s Privacy
            </h2>

            <p className="mt-4">
              Our website is intended for a general audience and is not
              specifically directed toward children.
            </p>

            <p className="mt-4">
              We do not knowingly collect personal information from children in
              violation of applicable law.
            </p>

            <p className="mt-4">
              If you believe that a child has provided personal information to
              us improperly, please contact us so that we can take appropriate
              action.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              12. Third-Party Websites
            </h2>

            <p className="mt-4">
              Our website may contain links to third-party websites or
              services.
            </p>

            <p className="mt-4">
              We are not responsible for the privacy practices, security, or
              content of third-party websites.
            </p>

            <p className="mt-4">
              We encourage you to review the privacy policies of third-party
              websites before providing them with personal information.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              13. Changes to This Privacy Policy
            </h2>

            <p className="mt-4">
              We may update this Privacy Policy from time to time to reflect
              changes in our website, services, technology, legal requirements,
              or business practices.
            </p>

            <p className="mt-4">
              When we make changes, we will update the &quot;Last Updated&quot;
              date at the top of this Privacy Policy.
            </p>

            <p className="mt-4">
              We encourage you to periodically review this page for the latest
              information.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900">
              14. Contact Us
            </h2>

            <p className="mt-4">
              If you have questions, concerns, requests, or complaints
              regarding this Privacy Policy or the processing of your personal
              information, please contact us:
            </p>

            <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-5">
              <p className="font-semibold text-gray-900">
                WE PRO Industrial Products
              </p>

              <p className="mt-2">
                Email:{" "}
                <span className="text-gray-600">
                  [YOUR OFFICIAL EMAIL]
                </span>
              </p>

              <p className="mt-1">
                Phone:{" "}
                <span className="text-gray-600">
                  [YOUR PHONE NUMBER]
                </span>
              </p>

              <p className="mt-1">
                Address:{" "}
                <span className="text-gray-600">
                  [YOUR BUSINESS ADDRESS]
                </span>
              </p>

              <p className="mt-1">
                Website:{" "}
                <span className="text-gray-600">
                  [YOUR DOMAIN]
                </span>
              </p>
            </div>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-12 border-t border-gray-200 pt-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            ← Back to Home
          </Link>
        </div>
      </article>
    </main>
  );
}