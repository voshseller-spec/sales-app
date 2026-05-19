import "dotenv/config";
import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import { products } from "./products.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const client = new Anthropic();

function buildSystemPrompt(product) {
  const { buyer } = product;
  return `You are ${buyer.name}, ${buyer.role}.

A salesperson is cold-calling you to sell "${product.name}" (${product.tagline}), priced at ${product.price}.

Your character: ${buyer.persona}

Rules for this roleplay:
- Stay fully in character as ${buyer.name}. Never mention that you are an AI.
- Be somewhat skeptical. Raise realistic objections about price, switching costs, or whether you even need this.
- Keep every reply short and conversational — 2 to 4 sentences, like a real phone call.
- Don't be a pushover, but don't be impossible either. If the salesperson genuinely addresses your concerns and makes a compelling case, you can be persuaded.
- When you make a FINAL decision to buy, end that reply with the exact token [DEAL].
- When you firmly decide not to buy and want to end the call, end that reply with the exact token [NO_DEAL].
- Otherwise, do not include either token — just continue the conversation.`;
}

app.get("/api/product", (req, res) => {
  const product = products[Math.floor(Math.random() * products.length)];
  // Omit buyer.persona — it's the buyer's hidden brief, not for the player.
  res.json({
    id: product.id,
    name: product.name,
    tagline: product.tagline,
    price: product.price,
    sellingPoints: product.sellingPoints,
    buyer: { name: product.buyer.name, role: product.buyer.role },
  });
});

app.post("/api/chat", async (req, res) => {
  const { productId, messages } = req.body;

  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(400).json({ error: "Unknown product." });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "No messages provided." });
  }

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      system: buildSystemPrompt(product),
      messages,
    });

    let text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    let outcome = null;
    if (text.includes("[DEAL]")) {
      outcome = "deal";
      text = text.replace("[DEAL]", "").trim();
    } else if (text.includes("[NO_DEAL]")) {
      outcome = "no_deal";
      text = text.replace("[NO_DEAL]", "").trim();
    }

    res.json({ reply: text, outcome });
  } catch (error) {
    console.error("Anthropic API error:", error);
    res.status(500).json({ error: "Something went wrong talking to the buyer." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sales trainer running on http://localhost:${PORT}`);
});
