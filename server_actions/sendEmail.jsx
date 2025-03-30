"use server";


import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(name, message, email) {
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["srijankulal1010@gmail.com"],
      subject: `New Message from ${name}!`,
      html: `<p>${message}</p>`,
      replyTo: email,
      
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}