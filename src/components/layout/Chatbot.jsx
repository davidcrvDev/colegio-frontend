// src/components/layout/Chatbot.jsx
import { useState } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // función para enviar mensaje al backend
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("http://localhost:8000/chatbot/ask", {
        // 👆 corregido: antes estaba "/ask"
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`);
      }

      const data = await res.json();

      const botMessage = {
        role: "bot",
        content: data.answer || "Lo siento, no encontré información.",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error en sendMessage:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error al conectar con el servidor." },
      ]);
    }

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 20,
            width: 320,
            height: 360,
            zIndex: 9999,
            borderRadius: 8,
            overflow: "hidden",
            boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
            background: "#ffffff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: 10,
              fontWeight: 700,
            }}
          >
            Chatbot Colegio
          </div>

          {/* Área de mensajes */}
          <div
            style={{
              flex: 1,
              padding: 8,
              overflowY: "auto",
              fontSize: 14,
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  margin: "6px 0",
                  textAlign: msg.role === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 10px",
                    borderRadius: 12,
                    background: msg.role === "user" ? "#2563eb" : "#f3f4f6",
                    color: msg.role === "user" ? "#fff" : "#111",
                    maxWidth: "80%",
                    wordWrap: "break-word",
                  }}
                >
                  {msg.content}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: "flex", borderTop: "1px solid #eee" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                flex: 1,
                padding: 10,
                border: "none",
                outline: "none",
              }}
              placeholder="Escribe tu mensaje..."
            />
            <button
              onClick={sendMessage}
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "0 14px",
                cursor: "pointer",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setOpen((s) => !s)}
        style={{
          position: "fixed",
          right: 28,
          bottom: 12,
          zIndex: 10000,
          background: "#2563eb",
          color: "#fff",
          border: "none",
          padding: "10px 14px",
          borderRadius: 999,
          boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
          cursor: "pointer",
        }}
      >
        💬
      </button>
    </>
  );
}
