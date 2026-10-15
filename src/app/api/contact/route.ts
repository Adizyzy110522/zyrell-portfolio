
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim() : "";
    const service =
      typeof body.service === "string" ? body.service.trim() : "";
    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    // Validate required fields.
    if (!name || !email || !description) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    // Limit the amount of data accepted.
    if (
      name.length > 120 ||
      email.length > 254 ||
      service.length > 100 ||
      description.length > 5000
    ) {
      return NextResponse.json(
        { error: "One or more fields are too long." },
        { status: 400 }
      );
    }

    // Validate the email address.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Only accept a known service name or an empty selection.
    const allowedServices = [
      "VIDEOGRAPHY",
      "PHOTOGRAPHY",
      "VIDEO EDITS",
      "GRAPHICS DESIGN",
    ];

    if (service && !allowedServices.includes(service)) {
      return NextResponse.json(
        { error: "Please select a valid service." },
        { status: 400 }
      );
    }

    const recipient = process.env.CONTACT_TO_EMAIL;

    if (!process.env.RESEND_API_KEY || !recipient) {
      console.error(
        "Contact form email environment variables are missing."
      );

      return NextResponse.json(
        { error: "The contact form is not configured yet." },
        { status: 500 }
      );
    }

    const { error } = await resend.emails.send({
      from: "CazmireCreates Contact <onboarding@resend.dev>",
      to: [recipient],
      replyTo: email,
      subject: `Portfolio enquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Service: ${service || "Not specified"}`,
        "",
        "Project description:",
        description,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend delivery error:", error);

      return NextResponse.json(
        {
          error:
            "Your message could not be sent. Please try again later.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { message: "Your message has been sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form request failed:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
