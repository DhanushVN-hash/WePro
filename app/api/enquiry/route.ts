import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, phone, product, message } = await req.json();
   
    const response = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY!,
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
          subject: `New Enquiry - ${product}`,
          htmlContent: `
            <h2>New Product Enquiry</h2>

            <p><strong>Name:</strong> ${name}</p>

            <p><strong>Email:</strong> ${email}</p>

            <p><strong>Phone:</strong> ${phone}</p>

            <p><strong>Product:</strong> ${product}</p>

            <p><strong>Message:</strong></p>

            <p>${message}</p>
          `,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error(error);

      return NextResponse.json(
        { error: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}