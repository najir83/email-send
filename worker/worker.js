import { Worker } from "bullmq";
import { configDotenv } from "dotenv";
import nodemailer from "nodemailer";
configDotenv();
const connection = {
  url: process.env.REDIS_URL,
};
async function sendEmail({ to, subject, text }) {
  console.log(`📧 Sending email to ${to}...`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_APP_PASSWORD, 
    },
  });

  let info = await transporter.sendMail({
    from: '"Queue System" <no-reply@example.com>',
    to,
    subject,
    text,
  });

  console.log("✅ Email sent:", info.messageId);
}

new Worker(
  "email-queue",
  async (job) => {
    console.log(`⚙️ Processing job ${job.id}`);
    await sendEmail(job.data);
    console.log("job completed");
  },
  { connection, concurrency: 10 }
);

console.log("👷 Worker started...");
