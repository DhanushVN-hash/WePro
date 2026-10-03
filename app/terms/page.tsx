
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | WE PRO Industrial Products",
  description:
    "Terms and conditions governing the use of the WE PRO Industrial Products website.",
};

const sections = [
  {
    number: "1.",
    title: "Acceptance of Terms",
    content: (
      <p>
        By accessing or using the WE PRO Industrial Products website, you agree
        to be bound by these Terms & Conditions. If you do not agree with these
        terms, please do not use the website or submit an enquiry through our
        forms.
      </p>
    ),
  },
  {
    number: "2.",
    title: "About Our Website",
    content: (
      <>
        <p>
          This website provides information about industrial pneumatic tools,
          fastening equipment, fasteners, accessories, compressors and related
          products offered by WE PRO Industrial Products.
        </p>

        <p className="mt-4">
          Product information is provided for general reference and may be
          updated, modified or discontinued without prior notice.
        </p>
      </>
    ),
  },
  {
    number: "3.",
    title: "Product Information",
    content: (
      <>
        <p>
          We make reasonable efforts to keep product descriptions,
          specifications, images and other information accurate. However,
          specifications, availability, packaging and product appearance may
          change from time to time.
        </p>

        <p className="mt-4">
          Images shown on the website are for illustrative purposes and may not
          always represent the exact appearance of the supplied product.
        </p>

        <p className="mt-4">
          Customers should confirm the relevant product specifications and
          availability with WE PRO Industrial Products before placing an order.
        </p>
      </>
    ),
  },
  {
    number: "4.",
    title: "Enquiries and Quotations",
    content: (
      <>
        <p>
          Submitting an enquiry through this website does not constitute an
          order or create a contract of sale.
        </p>

        <p className="mt-4">
          Prices, availability, delivery timelines, payment terms and other
          commercial conditions will be confirmed separately by WE PRO
          Industrial Products.
        </p>
      </>
    ),
  },
  {
    number: "5.",
    title: "Accuracy of Information Provided by Users",
    content: (
      <p>
        When submitting an enquiry, you agree to provide information that is
        accurate and complete. You should not submit false, misleading,
        unlawful or fraudulent information through the website.
      </p>
    ),
  },
  {
    number: "6.",
    title: "Intellectual Property",
    content: (
      <>
        <p>
          Unless otherwise stated, original website content created by WE PRO
          Industrial Products, including text, graphics, website layout and
          original materials, is owned by or used with permission by WE PRO
          Industrial Products.
        </p>

        <p className="mt-4">
          Product names, trademarks, logos, photographs, specifications and
          other manufacturer-related materials may belong to their respective
          owners and are used where permitted.
        </p>

        <p className="mt-4">
          You may not reproduce, copy, distribute, modify or commercially
          exploit website content without appropriate permission.
        </p>
      </>
    ),
  },
  {
    number: "7.",
    title: "Website Availability",
    content: (
      <p>
        We aim to keep the website available and functioning properly, but we
        do not guarantee that the website will always be available,
        uninterrupted or free from errors. We may temporarily suspend or modify
        the website when necessary for maintenance, security, technical
        reasons or business requirements.
      </p>
    ),
  },
  {
    number: "8.",
    title: "External Services and Links",
    content: (
      <p>
        The website may use third-party services or contain links to external
        websites. We are not responsible for the content, availability,
        security or privacy practices of third-party websites or services that
        are outside our control.
      </p>
    ),
  },
  {
    number: "9.",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          To the extent permitted by applicable law, WE PRO Industrial Products
          shall not be responsible for losses arising solely from reliance on
          general information displayed on this website.
        </p>

        <p className="mt-4">
          Website information is provided for general informational purposes
          and should not be treated as a substitute for product-specific
          technical advice, manufacturer instructions, safety requirements or
          professional guidance.
        </p>

        <p className="mt-4">
          Product use should always follow the applicable manufacturer's
          instructions, specifications, operating requirements and safety
          procedures.
        </p>

        <p className="mt-4">
          Nothing in these Terms & Conditions is intended to exclude or limit
          any liability that cannot lawfully be excluded or limited under
          applicable law.
        </p>
      </>
    ),
  },
  {
    number: "10.",
    title: "Privacy and Personal Information",
    content: (
      <>
        <p>
          Information submitted through our enquiry forms may be collected,
          stored and processed for the purpose of responding to enquiries,
          providing product information, communicating with customers and
          operating our website.
        </p>

        <p className="mt-4">
          For information about how personal information is handled, please
          review our{" "}
          <Link
            href="/privacy-policy"
            className="font-medium text-primary hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    number: "11.",
    title: "Changes to These Terms",
    content: (
      <>
        <p>
          We may update these Terms & Conditions from time to time to reflect
          changes to our website, services, business practices or applicable
          legal requirements.
        </p>

        <p className="mt-4">
          Changes will be posted on this page when applicable, and the "Last
          Updated" date will be revised accordingly.
        </p>
      </>
    ),
  },
  {
    number: "12.",
    title: "Governing Law",
    content: (
      <>
        <p>
          These Terms & Conditions shall be governed by and interpreted in
          accordance with the applicable laws of India.
        </p>

        <p className="mt-4">
          Any dispute arising in connection with the use of this website or
          these Terms & Conditions shall be subject to the jurisdiction of the
          competent courts, subject to applicable law.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8 sm:py-14 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">
            WE PRO Industrial Products
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Terms & Conditions
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
            Please read these terms carefully before using our website or
            submitting an enquiry.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
            <span>Effective Date: October 3, 2026</span>
            <span>Last Updated: October 3, 2026</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-6 py-10 sm:px-8 sm:py-14 lg:px-10">
        <div className="max-w-4xl">
          {/* Introduction */}
          <div className="border-b border-gray-200 pb-8">
            <p className="text-base leading-7 text-gray-700">
              These Terms & Conditions govern your use of the WE PRO Industrial
              Products website. By accessing the website or submitting an
              enquiry, you agree to comply with the terms described below.
            </p>
          </div>

          {/* Terms */}
          <div>
            {sections.map((section) => (
              <section
                key={section.number}
                className="border-b border-gray-200 py-9 last:border-b-0"
              >
                <div className="flex gap-5">
                  <span className="w-8 shrink-0 pt-1 text-sm font-semibold text-primary">
                    {section.number}
                  </span>

                  <div className="min-w-0">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">
                      {section.title}
                    </h2>

                    <div className="mt-4 text-[15px] leading-7 text-gray-600">
                      {section.content}
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>



          {/* Bottom Links */}
          <div className="mt-10 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-primary"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            <Link
              href="/privacy-policy"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-primary"
            >
              Privacy Policy
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

