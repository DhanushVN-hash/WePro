import { NextResponse } from "next/server";

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cleanText(value: unknown, maxLength: number): string {
  return String(value ?? "").trim().slice(0, maxLength);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^[0-9+\-\s()]{7,20}$/.test(phone);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = cleanText(body.name, 100);
    const email = cleanText(body.email, 150);
    const phone = cleanText(body.phone, 20);
    const product = cleanText(body.product, 150);
    const message = cleanText(body.message, 2000);

    // Server-side required field validation
    if (!name || !email || !phone || !product || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Server-side email validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Server-side phone validation
    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    // Escape values before inserting them into HTML email
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeProduct = escapeHtml(product);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

    const brevoApiKey = process.env.BREVO_API_KEY;

    if (!brevoApiKey) {
      console.error("BREVO_API_KEY is missing");

      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(
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
            email: "weproindustrial@gmail.com",
          },
          to: [
            {
              email: "weproindustrial@gmail.com",
            },
          ],
          subject: `New Enquiry - ${safeProduct}`,
          htmlContent: `
            <h2>New Product Enquiry</h2>

            <p><strong>Name:</strong> ${safeName}</p>

            <p><strong>Email:</strong> ${safeEmail}</p>

            <p><strong>Phone:</strong> ${safePhone}</p>

            <p><strong>Product:</strong> ${safeProduct}</p>

            <p><strong>Message:</strong></p>

            <p>${safeMessage}</p>
          `,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Brevo error:", error);

      return NextResponse.json(
        { error: "Unable to send enquiry. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Enquiry API error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}