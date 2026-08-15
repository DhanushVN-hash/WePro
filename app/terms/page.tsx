export const metadata = {
  title: "Terms & Conditions | WE PRO Industrial Products",
  description:
    "Terms and conditions governing the use of the WE PRO Industrial Products website.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-secondary text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-sm font-semibold tracking-wider uppercase text-primary">
            WE PRO Industrial Products
          </p>

          <h1 className="mt-3 text-4xl md:text-5xl font-bold">
            Terms & Conditions
          </h1>

          <p className="mt-4 text-gray-300">
            Please read these terms carefully before using our website or
            submitting an enquiry.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="space-y-10 text-gray-700 leading-7">

          <section>
            <h2 className="text-2xl font-bold text-[#101820] mb-4">
              1. Acceptance of Terms
            </h2>

            <p>
              By accessing or using the WE PRO Industrial Products website,
              you agree to be bound by these Terms & Conditions. If you do
              not agree with these terms, please do not use the website or
              submit an enquiry through our forms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#101820] mb-4">
              2. About Our Website
            </h2>

            <p>
              This website provides information about industrial pneumatic
              tools, fastening equipment, fasteners, accessories and related
              products offered by WE PRO Industrial Products.
            </p>

            <p className="mt-3">
              Product information is provided for general reference and may
              be updated, modified or discontinued without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#101820] mb-4">
              3. Product Information
            </h2>

            <p>
              We make reasonable efforts to keep product descriptions,
              specifications, images and other information accurate.
              However, specifications, availability, packaging and product
              appearance may change from time to time.
            </p>

            <p className="mt-3">
              Images shown on the website are for illustrative purposes and
              may not always represent the exact appearance of the supplied
              product.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#101820] mb-4">
              4. Enquiries and Quotations
            </h2>

            <p>
              Submitting an enquiry through this website does not constitute
              an order or create a contract of sale.
            </p>

            <p className="mt-3">
              Prices, availability, delivery timelines, payment terms and
              other commercial conditions will be confirmed separately by
              WE PRO Industrial Products.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#101820] mb-4">
              5. Accuracy of Information Provided by Users
            </h2>

            <p>
              When submitting an enquiry, you agree to provide information
              that is accurate and complete. You should not submit false,
              misleading, unlawful or fraudulent information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#101820] mb-4">
              6. Intellectual Property
            </h2>

            <p>
              Unless otherwise stated, the content of this website,
              including text, graphics, logos, images, layout and other
              materials, is owned by or used with permission by WE PRO
              Industrial Products.
            </p>

            <p className="mt-3">
              You may not reproduce, copy, distribute, modify or commercially
              exploit website content without appropriate permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#101820] mb-4">
              7. Website Availability
            </h2>

            <p>
              We aim to keep the website available and functioning properly,
              but we do not guarantee that the website will always be
              available, uninterrupted or free from errors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#101820] mb-4">
              8. External Services and Links
            </h2>

            <p>
              The website may use third-party services or contain links to
              external websites. We are not responsible for the content,
              availability or policies of third-party websites or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#101820] mb-4">
              9. Limitation of Liability
            </h2>

            <p>
              To the extent permitted by applicable law, WE PRO Industrial
              Products shall not be responsible for losses arising solely
              from reliance on general information displayed on this website.
              Product use should always follow the applicable manufacturer's
              instructions, specifications and safety requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#101820] mb-4">
              10. Changes to These Terms
            </h2>

            <p>
              We may update these Terms & Conditions from time to time.
              Changes will be posted on this page when applicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#101820] mb-4">
              11. Contact Us
            </h2>

            <p>
              If you have questions about these Terms & Conditions, please
              contact us:
            </p>

            <div className="mt-4 rounded-lg bg-gray-50 border border-gray-200 p-5">
              <p className="font-semibold text-[#101820]">
                WE PRO Industrial Products
              </p>

              <p className="mt-2">
                Email: weproindustrial@gmail.com
              </p>

              <p>
                Phone: 7338883738 / 9382888810
              </p>

              <p className="mt-2">
                No: 92 Yeshwanth Nagar Main Road,
                <br />
                Madambakkam, Chennai - 600126,
                <br />
                Tamil Nadu, India
              </p>
            </div>
          </section>

          <div className="border-t border-gray-200 pt-6 text-sm text-gray-500">
            Last updated: August 2026
          </div>

        </div>
      </section>
    </main>
  );
}