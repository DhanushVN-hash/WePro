"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { supabase } from "@/lib/supabase";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  product: string;
  message: string;
};

const getInitialForm = (defaultProduct: string): FormData => ({
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "+91",
  phone: "",
  product: defaultProduct,
  message: "",
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
   * Detect when reCAPTCHA v3 is available.
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
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  /*
   * Execute reCAPTCHA v3.
   *
   * v3 does NOT display a checkbox.
   * Google generates a token when the user performs
   * the protected action.
   */
  const getCaptchaToken = async (): Promise<string | null> => {
    if (!siteKey) {
      return null;
    }

    if (!window.grecaptcha) {
      return null;
    }

    return new Promise((resolve) => {
      window.grecaptcha!.ready(async () => {
        try {
          const token = await window.grecaptcha!.execute(siteKey, {
            action: "enquiry_submit",
          });

          resolve(token);
        } catch (error) {
          console.error("reCAPTCHA error:", error);
          resolve(null);
        }
      });
    });
  };

  const validateForm = () => {
    setErrorMessage("");

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.product.trim() ||
      !form.message.trim()
    ) {
      setErrorMessage("Please fill all required fields.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    const phoneDigits = form.phone.replace(/\D/g, "");

    if (phoneDigits.length < 10) {
      setErrorMessage("Please enter a valid phone number.");
      return false;
    }

    const termsElement = document.getElementById("terms");

    if (
      !termsElement ||
      termsElement.getAttribute("data-checked") !== "true"
    ) {
      setErrorMessage("Please accept the Terms & Conditions.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      /*
       * Generate the reCAPTCHA v3 token only when
       * the user submits the enquiry.
       */
      const captchaToken = await getCaptchaToken();

      if (siteKey && !captchaToken) {
        setErrorMessage(
          "Security verification failed. Please try again."
        );
        return;
      }

      const fullName =
        `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

      const fullPhone =
        `${form.countryCode} ${form.phone.trim()}`.trim();

      /*
       * Keep your existing Supabase database structure:
       * name, email, phone, product, message
       */
      const { error } = await supabase
        .from("enquiries")
        .insert([
          {
            name: fullName,
            email: form.email.trim(),
            phone: fullPhone,
            product: form.product.trim(),
            message: form.message.trim(),
          },
        ]);

      if (error) {
        console.error("Supabase enquiry error:", error);

        setErrorMessage(
          "Unable to submit your enquiry. Please try again."
        );

        return;
      }

      /*
       * Send notification through your API.
       *
       * captchaToken is sent to the server so the server
       * can verify it with Google.
       */
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email: form.email.trim(),
          phone: fullPhone,
          product: form.product.trim(),
          message: form.message.trim(),
          captchaToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(
          result.error ||
            "Unable to send your enquiry. Please try again."
        );

        return;
      }

      setSuccessMessage(
        "Enquiry sent successfully! Our team will get back to you soon."
      );

      setForm(getInitialForm(defaultProduct));

      const termsElement = document.getElementById("terms");

      if (termsElement) {
        (termsElement as HTMLInputElement).checked = false;
        termsElement.setAttribute("data-checked", "false");
      }
    } catch (error) {
      console.error("Submission error:", error);

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
          src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
          strategy="afterInteractive"
          onLoad={() => {
            setCaptchaReady(true);
          }}
        />
      )}

      <section
        id="enquiry"
        className="bg-white"
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
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                "
                loading="lazy"
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-black/45
                "
              />

              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  p-10
                  text-white
                "
              >

                <div
                  className="
                    mb-3
                    h-[3px]
                    w-12
                    bg-yellow-400
                  "
                />

                <p
                  className="
                    text-sm
                    font-medium
                    uppercase
                    tracking-[0.12em]
                    text-yellow-400
                  "
                >
                  WE PRO Industrial Products
                </p>

                <h2
                  className="
                    mt-2
                    max-w-md
                    text-3xl
                    font-bold
                    leading-tight
                  "
                >
                  Industrial Products &
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
              ${
                showImage
                  ? ""
                  : "mx-auto w-full max-w-4xl"
              }
            `}
          >

            <div className="mx-auto w-full max-w-2xl">

              {/* ======================================
                  HEADING
                  ====================================== */}

              <div className="mb-8">

                <h2
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

                <div
                  className="
                    mt-3
                    h-[3px]
                    w-14
                    bg-primary
                  "
                />

                <p
                  className="
                    mt-3
                    text-sm
                    text-gray-600
                    sm:text-base
                  "
                >
                  {subtitle}
                </p>

              </div>

              {/* ======================================
                  ERROR MESSAGE
                  ====================================== */}

              {errorMessage && (
                <div
                  role="alert"
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
                    Product *
                  </label>

                  <input
                    id="product"
                    name="product"
                    type="text"
                    value={form.product}
                    onChange={handleChange}
                    placeholder="Product name or model"
                    required
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
                      <option value="+91">
                        IN +91
                      </option>

                      <option value="+1">
                        US +1
                      </option>

                      <option value="+44">
                        UK +44
                      </option>

                      <option value="+971">
                        UAE +971
                      </option>

                      <option value="+65">
                        SG +65
                      </option>

                      <option value="+60">
                        MY +60
                      </option>
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
                      Phone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone"
                      required
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

                </div>

                {/* ======================================
                    TERMS
                    ====================================== */}

                <TermsCheckbox />

                {/* ======================================
                    CAPTCHA STATUS
                    ====================================== */}

                {siteKey && !captchaReady && (
                  <p className="text-xs text-gray-500">
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
                    reCAPTCHA site key is not configured.
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
                  {loading
                    ? "Submitting..."
                    : "Submit"}
                </button>

              </form>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}

/*
 * Terms & Conditions checkbox
 */
function TermsCheckbox() {
  const [checked, setChecked] = useState(false);

  return (
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
        type="checkbox"
        required
        checked={checked}
        onChange={(e) => {
          const value = e.target.checked;

          setChecked(value);

          const element =
            document.getElementById("terms");

          if (element) {
            element.setAttribute(
              "data-checked",
              String(value)
            );
          }
        }}
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
  );
}