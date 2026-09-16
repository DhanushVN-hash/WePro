import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_LENGTHS = {
  name: 100,
  firstName: 50,
  lastName: 50,
  email: 254,
  phone: 20,
  countryCode: 5,
  product: 150,
  message: 3000,
} as const;

const ALLOWED_COUNTRY_CODES = new Set([
  "+91",
  "+1",
  "+44",
  "+971",
  "+65",
  "+60",
]);

const CAPTCHA_ACTION = "enquiry_submit";
const CAPTCHA_MIN_SCORE = 0.5;

const rateLimitStore = new Map<
  string,
  {
    count: number;
    resetAt: number;
  }
>();

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 50;

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = req.headers.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const existing = rateLimitStore.get(ip);

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });

    return false;
  }

  existing.count += 1;

  if (existing.count > RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  return false;
}

function cleanText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(email: string): boolean {
  if (!email || email.length > MAX_LENGTHS.email) {
    return false;
  }

  return /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$/i.test(
    email
  );
}

function isValidPhone(phone: string): boolean {
  if (
    phone.length < 7 ||
    phone.length > MAX_LENGTHS.phone
  ) {
    return false;
  }

  if (!/^[0-9+\-().\s]+$/.test(phone)) {
    return false;
  }

  const digits = phone.replace(/\D/g, "");

  return digits.length >= 7 && digits.length <= 15;
}

function isValidName(value: string): boolean {
  if (!value || value.length > MAX_LENGTHS.name) {
    return false;
  }

  return /^[\p{L}\p{M}'’.\-\s]+$/u.test(value);
}

function isValidProduct(value: string): boolean {
  return (
    value.length > 0 &&
    value.length <= MAX_LENGTHS.product
  );
}

function isValidMessage(value: string): boolean {
  return (
    value.length > 0 &&
    value.length <= MAX_LENGTHS.message
  );
}

async function verifyRecaptcha(
  token: string
): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is missing");
    return false;
  }

  try {
    const formData = new URLSearchParams();

    formData.append("secret", secretKey);
    formData.append("response", token);

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "reCAPTCHA verification request failed:",
        response.status
      );

      return false;
    }

    const result = (await response.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      hostname?: string;
      "error-codes"?: string[];
    };

    if (!result.success) {
      console.error(
        "reCAPTCHA rejected:",
        result["error-codes"] ?? []
      );

      return false;
    }

    if (result.action !== CAPTCHA_ACTION) {
      console.error(
        "Invalid reCAPTCHA action:",
        result.action
      );

      return false;
    }

    if (
      typeof result.score !== "number" ||
      result.score < CAPTCHA_MIN_SCORE
    ) {
      console.error(
        "reCAPTCHA score too low:",
        result.score
      );

      return false;
    }

    const expectedHostname =
      process.env.RECAPTCHA_EXPECTED_HOSTNAME;

    if (
      expectedHostname &&
      result.hostname !== expectedHostname
    ) {
      console.error(
        "Invalid reCAPTCHA hostname:",
        result.hostname
      );

      return false;
    }

    return true;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    // ------------------------------------------------------
    // 1. Request size protection
    // ------------------------------------------------------

    const contentLength = req.headers.get("content-length");

    if (
      contentLength &&
      Number(contentLength) > 50_000
    ) {
      return NextResponse.json(
        {
          error: "Request is too large.",
        },
        { status: 413 }
      );
    }

    // ------------------------------------------------------
    // 2. Rate limiting
    // ------------------------------------------------------

    const ip = getClientIp(req);

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error:
            "Too many enquiries. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "600",
          },
        }
      );
    }

    // ------------------------------------------------------
    // 3. Parse request body
    // ------------------------------------------------------

    let body: Record<string, unknown>;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------
    // 4. Read and normalize form values
    // ------------------------------------------------------

    const firstName = cleanText(body.firstName);
    const lastName = cleanText(body.lastName);
    const suppliedName = cleanText(body.name);
    const email = cleanText(body.email).toLowerCase();
    const phone = cleanText(body.phone);
    const countryCode = cleanText(body.countryCode);
    const product = cleanText(body.product);
    const message = cleanText(body.message);

    const captchaToken =
      typeof body.captchaToken === "string"
        ? body.captchaToken.trim()
        : "";

    const termsAccepted = body.termsAccepted === true;

    const fullName =
      suppliedName ||
      `${firstName} ${lastName}`.trim();

    const fullPhone = countryCode
      ? `${countryCode} ${phone}`
      : phone;

    // ------------------------------------------------------
    // 5. Required fields
    // ------------------------------------------------------

    if (
      !fullName ||
      !email ||
      !phone ||
      !product ||
      !message
    ) {
      return NextResponse.json(
        {
          error:
            "Please fill in all required fields.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------
    // 6. Length validation
    // ------------------------------------------------------

    if (
      fullName.length > MAX_LENGTHS.name ||
      firstName.length > MAX_LENGTHS.firstName ||
      lastName.length > MAX_LENGTHS.lastName ||
      email.length > MAX_LENGTHS.email ||
      phone.length > MAX_LENGTHS.phone ||
      countryCode.length > MAX_LENGTHS.countryCode ||
      product.length > MAX_LENGTHS.product ||
      message.length > MAX_LENGTHS.message
    ) {
      return NextResponse.json(
        {
          error: "One or more fields are too long.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------
    // 7. Name validation
    // ------------------------------------------------------

    if (!isValidName(fullName)) {
      return NextResponse.json(
        {
          error: "Please enter a valid name.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------
    // 8. Email validation
    // ------------------------------------------------------

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------
    // 9. Country code validation
    // ------------------------------------------------------

    if (
      countryCode &&
      !ALLOWED_COUNTRY_CODES.has(countryCode)
    ) {
      return NextResponse.json(
        {
          error: "Please select a valid country code.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------
    // 10. Phone validation
    // ------------------------------------------------------

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        {
          error: "Please enter a valid phone number.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------
    // 11. Product validation
    // ------------------------------------------------------

    if (!isValidProduct(product)) {
      return NextResponse.json(
        {
          error: "Please enter a valid product.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------
    // 12. Message validation
    // ------------------------------------------------------

    if (!isValidMessage(message)) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid enquiry message.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------
    // 13. Terms and conditions
    // ------------------------------------------------------

    if (!termsAccepted) {
      return NextResponse.json(
        {
          error:
            "Please accept the Terms & Conditions.",
        },
        { status: 400 }
      );
    }

    // ------------------------------------------------------
    // 14. reCAPTCHA validation
    // ------------------------------------------------------

    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.error("RECAPTCHA_SECRET_KEY is missing");

      return NextResponse.json(
        {
          error:
            "Security verification is not configured.",
        },
        { status: 500 }
      );
    }

    if (!captchaToken) {
      return NextResponse.json(
        {
          error:
            "Security verification failed. Please try again.",
        },
        { status: 400 }
      );
    }

    const captchaValid =
      await verifyRecaptcha(captchaToken);

    if (!captchaValid) {
      return NextResponse.json(
        {
          error:
            "Security verification failed. Please try again.",
        },
        { status: 403 }
      );
    }

    // ------------------------------------------------------
    // 15. Environment variables
    // ------------------------------------------------------

    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const recipientEmail =
      process.env.BREVO_RECIPIENT_EMAIL;

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Existing anon key — no service role key
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (
      !brevoApiKey ||
      !senderEmail ||
      !recipientEmail
    ) {
      console.error(
        "Brevo environment variables are missing."
      );

      return NextResponse.json(
        {
          error:
            "Email service is not configured. Please try again later.",
        },
        { status: 500 }
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error(
        "Supabase environment variables are missing."
      );

      return NextResponse.json(
        {
          error:
            "Database service is not configured. Please try again later.",
        },
        { status: 500 }
      );
    }

    // ------------------------------------------------------
    // 16. Prepare safe email content
    // ------------------------------------------------------

    const safeName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(fullPhone);
    const safeProduct = escapeHtml(product);

    const safeMessage = escapeHtml(message).replace(
      /\r?\n/g,
      "<br>"
    );

    // ------------------------------------------------------
    // 17. Send email FIRST using Brevo
    // ------------------------------------------------------

    let brevoResponse: Response;

    try {
      brevoResponse = await fetch(
        "https://api.brevo.com/v3/smtp/email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": brevoApiKey,
          },
          body: JSON.stringify({
            sender: {
              name: "WE PRO Industrial Products",
              email: senderEmail,
            },
            to: [
              {
                email: recipientEmail,
              },
            ],
            replyTo: {
              email,
              name: fullName,
            },
            subject: `New Enquiry - ${product}`,
            htmlContent: `
              <h2>New Product Enquiry</h2>

              <p>
                <strong>Name:</strong>
                ${safeName}
              </p>

              <p>
                <strong>Email:</strong>
                ${safeEmail}
              </p>

              <p>
                <strong>Phone:</strong>
                ${safePhone}
              </p>

              <p>
                <strong>Product:</strong>
                ${safeProduct}
              </p>

              <p>
                <strong>Terms accepted:</strong>
                Yes
              </p>

              <p>
                <strong>Message:</strong>
              </p>

              <p>
                ${safeMessage}
              </p>
            `,
          }),
          cache: "no-store",
        }
      );
    } catch (error) {
      console.error("Brevo network error:", error);

      return NextResponse.json(
        {
          error:
            "Unable to send email. Please try again later.",
        },
        { status: 502 }
      );
    }

    // ------------------------------------------------------
    // 18. Check Brevo response
    // ------------------------------------------------------

    if (!brevoResponse.ok) {
      const errorText = await brevoResponse.text();

      console.error(
        "Brevo request failed:",
        brevoResponse.status,
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Email could not be sent. Please try again later.",
        },
        { status: 502 }
      );
    }

    // ------------------------------------------------------
    // 19. Save enquiry AFTER email request succeeds
    // ------------------------------------------------------

    const supabaseResponse = await fetch(
      `${supabaseUrl}/rest/v1/enquiries`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          // Existing anon key
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,

          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          phone: fullPhone,
          product,
          message,
          status: "New",
        }),
        cache: "no-store",
      }
    );

    // ------------------------------------------------------
    // 20. Check Supabase response
    // ------------------------------------------------------

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text();

      console.error(
        "Supabase enquiry insert failed:",
        supabaseResponse.status,
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Email was sent, but the enquiry could not be saved. Please contact us directly.",
          emailSent: true,
          enquirySaved: false,
        },
        { status: 500 }
      );
    }

    // ------------------------------------------------------
    // 21. Final success response
    // ------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        emailSent: true,
        enquirySaved: true,
        message:
          "Your enquiry has been sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Enquiry API error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}