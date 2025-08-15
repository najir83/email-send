import express from "express";
import { Queue } from "bullmq";
import { configDotenv } from "dotenv";
configDotenv();

const app = express();
app.use(express.json());
const connection = { url: process.env.REDIS_URL };
console.log(process.env.PORT);
const PORT = process.env.PORT || 3000;
const emailQueue = new Queue("email-queue", { connection });

app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;
  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const job = await emailQueue.add("sendEmail", { to, subject, text });
  res.json({ message: "Email job queued", jobId: job.id });
});
app.get("/", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});
