/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";

export async function POST(req: any) {
  try {
    const { user_name, user_email, phone, message } = await req.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${user_name}" <${process.env.EMAIL_USER}>`,
      to: "dropandshipping@gmail.com",
      subject: `New Contact Form Submission from ${user_name}`,
      html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <table style="width: 100%; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-collapse: collapse; background-color: #f9f9f9;">
      <thead style="background-color: #4CAF50; color: #fff;">
        <tr>
          <th colspan="2" style="padding: 15px; text-align: center; font-size: 18px;">Contact Form Submission</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px; font-weight: bold; width: 30%;">Name:</td>
          <td style="padding: 10px;">${user_name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px; font-weight: bold;">Email:</td>
          <td style="padding: 10px;">${user_email}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px; font-weight: bold;">Phone:</td>
          <td style="padding: 10px;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message:</td>
          <td style="padding: 10px;">${message}</td>
        </tr>
      </tbody>
    </table>
    <footer style="margin-top: 20px; text-align: center; color: #777; font-size: 12px;">
      <p>&copy; ${new Date().getFullYear()} Your Drop And Shipping. All rights reserved.</p>
    </footer>
  </div>
`,
    });

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ message: "Failed to send email" }), {
      status: 500,
    });
  }
}