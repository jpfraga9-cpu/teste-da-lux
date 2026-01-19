import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Mensagem vazia." });
  }

  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "Você é a Lux, uma assistente virtual de compras que ajuda usuários a escolher produtos com base em necessidade, orçamento e custo-benefício.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const text =
      response.output_text ||
      "Não consegui gerar uma resposta agora.";

    return res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Erro OpenAI:", error);
    return res
      .status(500)
      .json({ reply: "Erro ao consultar a IA. Tente novamente." });
  }
}
