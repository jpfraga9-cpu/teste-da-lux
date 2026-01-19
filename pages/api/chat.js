import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ reply: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res
      .status(500)
      .json({ reply: "Configuração da API ausente." });
  }

  const message =
    typeof req.body?.message === "string" ? req.body.message.trim() : "";

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
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro OpenAI:", errorMessage);
    return res
      .status(500)
      .json({ reply: "Erro ao consultar a IA. Tente novamente." });
  }
}
