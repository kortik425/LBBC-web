import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema"; // Assuming this is correct import for Zod
import nodemailer from "nodemailer";
import { RateLimiterMemory } from 'rate-limiter-flexible';

// --- Rate Limiter Setup ---
// Limit each unique IP address to 5 requests every 5 minutes (300 seconds)
const limiter = new RateLimiterMemory({
  points: 5,        // 5 requests allowed
  duration: 60 * 10,    // per 10 minutes 
  blockDuration: 60 * 30, // Optional: Block for 30 minutes if limit is exceeded
});

export const submitPrayerRequest = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(4, "Name is required"),
    email: z.string().email("Invalid email format"),
    message: z.string().min(10, "Prayer Request must be at least 10 characters"),
    'hp-email': z.string().optional(), 
  }),

  handler: async (dataForm, context) => {
    const { name, email, message, 'hp-email': honeypotValue } = dataForm;
  
    if (honeypotValue) {
      console.log(`[BOT] Honeypot activated for IP: ${context.clientAddress}`);
      return { success: true, message: "OK" };
    }

    const ipAddress = context.clientAddress; 
    try {
      await limiter.consume(ipAddress);
    } catch (rateLimiterRes) {
      // Limit exceeded (429 Too Many Requests)
      console.log(`[BLOCKED] Rate limit exceeded for IP: ${ipAddress}`);
      throw new ActionError({code: 'TOO_MANY_REQUESTS', message: "Too many requests. Please wait a few minutes and try again."});
    }

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: import.meta.env.EMAIL_USER,
          pass: import.meta.env.EMAIL_PASS,
        },
      });

      import.meta.env.PROD && await transporter.sendMail({
        from: `"Prayer Request" <${import.meta.env.EMAIL_USER}>`,
        to: import.meta.env.EMAIL_TO,
        subject: `Prayer Request from ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          "",
          "Message:",
          message,
        ].join("\n"),
        replyTo: email,
      });

      return {success: true};
    } catch (error) {
      console.error("Email sending failed:", error);
      throw new ActionError({code: 'BAD_REQUEST', message: "Failed to send prayer request. Please try again later."});
    }
  },
});