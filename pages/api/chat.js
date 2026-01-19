import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body ?? {};
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Message is required" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "OPENAI_API_KEY is not configured" });
  }

  const client = new OpenAI({ apiKey });

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: message,
  });

  const reply = response.output_text ?? "";

  return res.status(200).json({ reply });
}
