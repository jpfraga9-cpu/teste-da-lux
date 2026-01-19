import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }

    setMessages((prev) => [...prev, { author: "user", text: trimmed }]);
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { author: "lux", text: data.reply ?? "Sem resposta no momento." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { author: "lux", text: "Não consegui responder agora. Tente novamente." },
      ]);
    }
  };

  return (
    <main
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "3rem 1.5rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "640px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <header style={{ textAlign: "center" }}>
          <h1 style={{ marginBottom: "0.4rem", fontSize: "2.25rem" }}>Lux</h1>
          <p style={{ margin: 0, color: "#555" }}>
            Assistente virtual de compras
          </p>
        </header>

        <div
          style={{
            backgroundColor: "#f7f7f9",
            borderRadius: "12px",
            padding: "1.25rem",
            minHeight: "240px",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            overflowY: "auto",
          }}
        >
          {messages.length === 0 ? (
            <p style={{ color: "#777", textAlign: "center", margin: "auto 0" }}>
              Comece a conversa com a Lux.
            </p>
          ) : (
            messages.map((item, index) => (
              <div
                key={`${item.author}-${index}`}
                style={{
                  alignSelf: item.author === "user" ? "flex-end" : "flex-start",
                  backgroundColor:
                    item.author === "user" ? "#1b5ef5" : "#ffffff",
                  color: item.author === "user" ? "#ffffff" : "#222",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  maxWidth: "80%",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                }}
              >
                {item.text}
              </div>
            ))
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: "0.75rem" }}
        >
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              border: "1px solid #d0d5dd",
              fontSize: "1rem",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#1b5ef5",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              padding: "0 1.5rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Enviar
          </button>
        </form>
      </section>
    </main>
  );
}
