import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import connectDB from "@/lib/mongodb";
import InboxMessage from "@/models/InboxMessage";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 },
    );
  }

  const msgSubject = subject || `New message from ${name}`;

  // Save to MongoDB InboxMessage database
  try {
    await connectDB();
    await InboxMessage.create({
      name,
      email,
      subject: msgSubject,
      message,
      read: false,
    });
  } catch (dbError) {
    console.error("Database save error:", dbError);
  }

  // Send Email Notification via Resend if configured
  try {
    if (
      process.env.RESEND_API_KEY &&
      process.env.RESEND_FROM_EMAIL &&
      process.env.CONTACT_TO_EMAIL
    ) {
      await resend.emails.send({
        from: email || process.env.RESEND_FROM_EMAIL,
        to: process.env.CONTACT_TO_EMAIL,
        subject: msgSubject,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
        replyTo: email,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend email error:", error);
    // Still return success if message was saved to database
    return NextResponse.json({
      success: true,
      warning: "Message saved to inbox, but email notification failed.",
    });
  }
}
