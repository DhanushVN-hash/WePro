"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  product: string;
  message: string;
  termsAccepted: boolean;
};

const COUNTRY_CODES = [
  "+91",
  "+1",
  "+44",
  "+971",
  "+65",
  "+60",
] as const;

const MAX_LENGTHS = {
  firstName: 50,
  lastName: 50,
  email: 254,
  phone: 20,
  product: 150,
  message: 3000,
} as const;

const getInitialForm = (defaultProduct: string): FormData => ({
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "+91",
  phone: "",
  product: defaultProduct,
  message: "",
  termsAccepted: false,
});

type EnquiryFormProps = {
  title?: string;
  subtitle?: string;
  defaultProduct?: string;
  imageSrc?: string;
  showImage?: boolean;
};

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: {
          action: string;
        }
      ) => Promise<string>;
    };
  }
}

export default function EnquiryForm({
  title = "SEND US YOUR QUESTIONS!",
  subtitle = "Fill out the form below and our team will get back to you.",
  defaultProduct = "",
  imageSrc = "https://res.cloudinary.com/dthrkeu9m/image/upload/f_auto,q_auto/1000181275_i2jdei",
  showImage = true,
}: EnquiryFormProps) {
  const [form, setForm] = useState<FormData>(
    getInitialForm(defaultProduct)
  );

  const [loading, setLoading] = useState(false);
  const [captchaReady, setCaptchaReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  /*
   * Keep the product synchronized if the parent changes
   * the default product while this component is mounted.
   */
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      product: defaultProduct,
    }));
  }, [defaultProduct]);

  /*
   * Detect when reCAPTCHA v3 has loaded.
   */
  useEffect(() => {
    if (!siteKey) return;

    if (window.grecaptcha) {
      setCaptchaReady(true);
    }
  }, [siteKey]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleTermsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      termsAccepted: e.target.checked,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  /*
   * Generate a reCAPTCHA v3 token only when submitting.
   */
  const getCaptchaToken = async (): Promise<string | null> => {
    if (!siteKey || !window.grecaptcha) {
      return null;
    }

    try {
      return await new Promise<string | null>((resolve) => {
        window.grecaptcha!.ready(async () => {
          try {
            const token = await window.grecaptcha!.execute(siteKey, {
              action: "enquiry_submit",
            });

            resolve(token || null);
          } catch (error) {
            console.error("reCAPTCHA execution failed:", error);
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error("reCAPTCHA error:", error);
      return null;
    }
  };

  /*
   * Client-side validation.
   *
   * IMPORTANT:
   * This improves UX but is NOT a security boundary.
   * The API must validate everything again.
   */
  const validateForm = (): boolean => {
    setErrorMessage("");

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim().toLowerCase();
    const product = form.product.trim();
    const message = form.message.trim();
    const phone = form.phone.trim();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !product ||
      !message
    ) {
      setErrorMessage("Please fill all required fields.");
      return false;
    }

    if (!form.termsAccepted) {
      setErrorMessage("Please accept the Terms & Conditions.");
      return false;
    }

    if (!COUNTRY_CODES.includes(form.countryCode as any)) {
      setErrorMessage("Please select a valid country code.");
      return false;
    }

    if (firstName.length > MAX_LENGTHS.firstName) {
      setErrorMessage("First name is too long.");
      return false;
    }

    if (lastName.length > MAX_LENGTHS.lastName) {
      setErrorMessage("Last name is too long.");
      return false;
    }

    if (email.length > MAX_LENGTHS.email) {
      setErrorMessage("Email address is too long.");
      return false;
    }

    if (product.length > MAX_LENGTHS.product) {
      setErrorMessage("company name is too long.");
      return false;
    }

    if (message.length > MAX_LENGTHS.message) {
      setErrorMessage("Enquiry message is too long.");
      return false;
    }

    /*
     * Practical email validation.
     * The server must still validate the email.
     */
    const emailRegex =
      /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i;

    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    /*
     * Keep phone input practical while allowing:
     * spaces, +, -, brackets and dots.
     */
    if (!/^[0-9+\-().\s]+$/.test(phone)) {
      setErrorMessage("Please enter a valid phone number.");
      return false;
    }

    const phoneDigits = phone.replace(/\D/g, "");

    if (
      phoneDigits.length < 7 ||
      phoneDigits.length > 15
    ) {
      setErrorMessage("Please enter a valid phone number.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    /*
     * Prevent double submission.
     */
    if (loading) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      /*
       * Generate CAPTCHA immediately before the API request.
       */
      const captchaToken = await getCaptchaToken();

      if (siteKey && !captchaToken) {
        setErrorMessage(
          "Security verification failed. Please try again."
        );
        return;
      }

      const firstName = form.firstName.trim();
      const lastName = form.lastName.trim();
      const email = form.email.trim().toLowerCase();
      const product = form.product.trim();
      const message = form.message.trim();
      const phone = form.phone.trim();

      const fullName = `${firstName} ${lastName}`.trim();

      const fullPhone = `${form.countryCode} ${phone}`.trim();

      /*
       * IMPORTANT:
       *
       * This component intentionally does NOT insert directly
       * into Supabase.
       *
       * The server API should:
       * 1. Validate the request
       * 2. Verify reCAPTCHA
       * 3. Apply rate limiting
       * 4. Save the enquiry to Supabase
       * 5. Send notification email
       */
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          firstName,
          lastName,
          email,
          phone: fullPhone,
          countryCode: form.countryCode,
          product,
          message,
          termsAccepted: form.termsAccepted,
          captchaToken,
        }),
      });

      /*
       * Don't assume the API always returns valid JSON.
       */
      let result: {
        success?: boolean;
        error?: string;
      } = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        setErrorMessage(
          result.error ||
            "Unable to submit your enquiry. Please try again."
        );
        return;
      }

      setSuccessMessage(
        "Enquiry sent successfully! Our team will get back to you soon."
      );

      setForm(getInitialForm(defaultProduct));
    } catch (error) {
      console.error("Enquiry submission failed:", error);

      setErrorMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ==========================================
          GOOGLE reCAPTCHA v3
          ========================================== */}

      {siteKey && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(
            siteKey
          )}`}
          strategy="afterInteractive"
          onLoad={() => {
            setCaptchaReady(true);
          }}
          onError={() => {
            setCaptchaReady(false);
            setErrorMessage(
              "Security verification could not be loaded. Please refresh the page and try again."
            );
          }}
        />
      )}

      <section
        id="enquiry"
        className="bg-white"
        aria-labelledby="enquiry-title"
      >
        <div
          className={
            showImage
              ? "grid lg:grid-cols-[0.85fr_1.15fr]"
              : "block"
          }
        >
          {/* ==========================================
              IMAGE
              ========================================== */}

          {showImage && (
            <div className="relative hidden min-h-[650px] lg:block">
              <img
                src={imageSrc}
                alt="WE PRO Industrial Products"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-black/45" />

              <div className="absolute bottom-0 left-0 right-0 p-10 text-white">
                <div className="mb-3 h-[3px] w-12 bg-yellow-400" />

                <p className="text-sm font-medium uppercase tracking-[0.12em] text-yellow-400">
                  WE PRO Industrial Products
                </p>

                <h2 className="mt-2 max-w-md text-3xl font-bold leading-tight">
                  Industrial Products &
                  <br />
                  Fastening Solutions
                </h2>
              </div>
            </div>
          )}

          {/* ==========================================
              FORM
              ========================================== */}

          <div
            className={`
              bg-white
              px-5
              py-12
              sm:px-8
              sm:py-14
              lg:px-14
              lg:py-16
              ${showImage ? "" : "mx-auto w-full max-w-4xl"}
            `}
          >
            <div className="mx-auto w-full max-w-2xl">
              {/* ======================================
                  HEADING
                  ====================================== */}

              <div className="mb-8">
                <h2
                  id="enquiry-title"
                  className="
                    text-3xl
                    font-bold
                    tracking-tight
                    text-[#101820]
                    sm:text-4xl
                  "
                >
                  {title}
                </h2>

                <div className="mt-3 h-[3px] w-14 bg-primary" />

                <p className="mt-3 text-sm text-gray-600 sm:text-base">
                  {subtitle}
                </p>
              </div>

              {/* ======================================
                  ERROR MESSAGE
                  ====================================== */}

              {errorMessage && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="
                    mb-5
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-700
                  "
                >
                  {errorMessage}
                </div>
              )}

              {/* ======================================
                  SUCCESS MESSAGE
                  ====================================== */}

              {successMessage && (
                <div
                  role="status"
                  aria-live="polite"
                  className="
                    mb-5
                    border
                    border-green-200
                    bg-green-50
                    px-4
                    py-3
                    text-sm
                    text-green-700
                  "
                >
                  {successMessage}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                noValidate
              >
                {/* ======================================
                    FIRST NAME + LAST NAME
                    ====================================== */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-800
                      "
                    >
                      First Name *
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      required
                      maxLength={MAX_LENGTHS.firstName}
                      autoComplete="given-name"
                      disabled={loading}
                      className="
                        h-11
                        w-full
                        border
                        border-gray-400
                        bg-white
                        px-3
                        text-sm
                        text-gray-900
                        outline-none
                        placeholder:text-gray-400
                        focus:border-gray-800
                      "
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-800
                      "
                    >
                      Last Name *
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      required
                      maxLength={MAX_LENGTHS.lastName}
                      autoComplete="family-name"
                      disabled={loading}
                      className="
                        h-11
                        w-full
                        border
                        border-gray-400
                        bg-white
                        px-3
                        text-sm
                        text-gray-900
                        outline-none
                        placeholder:text-gray-400
                        focus:border-gray-800
                      "
                    />
                  </div>
                </div>

                {/* ======================================
                    EMAIL
                    ====================================== */}

                <div>
                  <label
                    htmlFor="email"
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-800
                    "
                  >
                    Email *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    maxLength={MAX_LENGTHS.email}
                    autoComplete="email"
                    inputMode="email"
                    disabled={loading}
                    className="
                      h-11
                      w-full
                      border
                      border-gray-400
                      bg-white
                      px-3
                      text-sm
                      text-gray-900
                      outline-none
                      placeholder:text-gray-400
                      focus:border-gray-800
                    "
                  />
                </div>

                {/* ======================================
                    PRODUCT
                    ====================================== */}

                <div>
                  <label
                    htmlFor="product"
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-800
                    "
                  >
                    company *
                  </label>

                  <input
                    id="product"
                    name="product"
                    type="text"
                    value={form.product}
                    onChange={handleChange}
                    placeholder="company name or"
                    required
                    maxLength={MAX_LENGTHS.product}
                    disabled={loading}
                    className="
                      h-11
                      w-full
                      border
                      border-gray-400
                      bg-white
                      px-3
                      text-sm
                      text-gray-900
                      outline-none
                      placeholder:text-gray-400
                      focus:border-gray-800
                    "
                  />
                </div>

                {/* ======================================
                    COUNTRY CODE + PHONE
                    ====================================== */}

                <div
                  className="
                    grid
                    grid-cols-[0.7fr_1.3fr]
                    gap-3
                    sm:grid-cols-[0.65fr_1.35fr]
                    sm:gap-5
                  "
                >
                  <div>
                    <label
                      htmlFor="countryCode"
                      className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-800
                      "
                    >
                      Code
                    </label>

                    <select
                      id="countryCode"
                      name="countryCode"
                      value={form.countryCode}
                      onChange={handleChange}
                      disabled={loading}
                      autoComplete="tel-country-code"
                      className="
                        h-11
                        w-full
                        border
                        border-gray-400
                        bg-white
                        px-3
                        text-sm
                        text-gray-800
                        outline-none
                        focus:border-gray-800
                      "
                    >
                      <option value="+91">IN +91</option>
                      <option value="+1">US +1</option>
                      <option value="+44">UK +44</option>
                      <option value="+971">UAE +971</option>
                      <option value="+65">SG +65</option>
                      <option value="+60">MY +60</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="
                        mb-2
                        block
                        text-sm
                        font-medium
                        text-gray-800
                      "
                    >
                      Phone *
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      required
                      maxLength={MAX_LENGTHS.phone}
                      autoComplete="tel"
                      inputMode="tel"
                      disabled={loading}
                      className="
                        h-11
                        w-full
                        border
                        border-gray-400
                        bg-white
                        px-3
                        text-sm
                        text-gray-900
                        outline-none
                        placeholder:text-gray-400
                        focus:border-gray-800
                      "
                    />
                  </div>
                </div>

                {/* ======================================
                    ENQUIRY
                    ====================================== */}

                <div>
                  <label
                    htmlFor="message"
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-gray-800
                    "
                  >
                    Enquiry *
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what you are looking for..."
                    required
                    maxLength={MAX_LENGTHS.message}
                    disabled={loading}
                    className="
                      w-full
                      resize-none
                      border
                      border-gray-400
                      bg-white
                      px-3
                      py-3
                      text-sm
                      text-gray-900
                      outline-none
                      placeholder:text-gray-400
                      focus:border-gray-800
                    "
                  />

                  <p className="mt-1 text-right text-xs text-gray-400">
                    {form.message.length}/{MAX_LENGTHS.message}
                  </p>
                </div>

                {/* ======================================
                    TERMS
                    ====================================== */}

                <label
                  htmlFor="terms"
                  className="
                    flex
                    cursor-pointer
                    items-start
                    gap-3
                    pt-1
                    text-sm
                    text-gray-700
                  "
                >
                  <input
                    id="terms"
                    name="termsAccepted"
                    type="checkbox"
                    checked={form.termsAccepted}
                    onChange={handleTermsChange}
                    required
                    disabled={loading}
                    className="
                      mt-0.5
                      h-5
                      w-5
                      shrink-0
                      cursor-pointer
                      accent-yellow-400
                    "
                  />

                  <span>
                    I accept the{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="
                        font-medium
                        text-gray-900
                        underline
                        underline-offset-2
                        hover:text-yellow-600
                      "
                    >
                      Terms & Conditions
                    </a>
                  </span>
                </label>

                {/* ======================================
                    CAPTCHA STATUS
                    ====================================== */}

                {siteKey && !captchaReady && (
                  <p
                    className="text-xs text-gray-500"
                    role="status"
                    aria-live="polite"
                  >
                    Security verification is loading...
                  </p>
                )}

                {!siteKey && (
                  <div
                    className="
                      border
                      border-yellow-200
                      bg-yellow-50
                      px-3
                      py-2
                      text-xs
                      text-yellow-800
                    "
                  >
                    Security verification is not configured.
                  </div>
                )}

                {/* ======================================
                    SUBMIT
                    ====================================== */}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    (!!siteKey && !captchaReady)
                  }
                  className="
                    mt-2
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    bg-primary
                    px-6
                    text-base
                    font-bold
                    text-black
                    transition-colors
                    duration-150
                    hover:bg-primary-hover
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}