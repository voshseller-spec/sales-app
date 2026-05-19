// Conversation state. `messages` is the API-shaped history:
// salesperson = "user", buyer = "assistant".
let product = null;
let messages = [];
let gameOver = false;

const els = {
  name: document.getElementById("product-name"),
  tagline: document.getElementById("product-tagline"),
  price: document.getElementById("product-price"),
  points: document.getElementById("product-points"),
  buyerLine: document.getElementById("buyer-line"),
  messages: document.getElementById("messages"),
  outcome: document.getElementById("outcome"),
  form: document.getElementById("chat-form"),
  input: document.getElementById("chat-input"),
  sendBtn: document.getElementById("send-btn"),
  restartBtn: document.getElementById("restart-btn"),
};

async function loadProduct() {
  const res = await fetch("/api/product");
  product = await res.json();

  els.name.textContent = product.name;
  els.tagline.textContent = product.tagline;
  els.price.textContent = product.price;
  els.points.innerHTML = "";
  for (const point of product.sellingPoints) {
    const li = document.createElement("li");
    li.textContent = point;
    els.points.appendChild(li);
  }
  els.buyerLine.textContent = `On the line: ${product.buyer.name}, ${product.buyer.role}.`;

  addSystemNote(
    `You're cold-calling ${product.buyer.name}. Open with your pitch.`
  );
}

function addSystemNote(text) {
  const div = document.createElement("div");
  div.className = "msg buyer typing";
  div.textContent = text;
  els.messages.appendChild(div);
  scrollDown();
}

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `msg ${role === "user" ? "you" : "buyer"}`;
  const who = document.createElement("span");
  who.className = "who";
  who.textContent = role === "user" ? "You" : product.buyer.name;
  div.appendChild(who);
  div.appendChild(document.createTextNode(text));
  els.messages.appendChild(div);
  scrollDown();
}

function scrollDown() {
  els.messages.scrollTop = els.messages.scrollHeight;
}

function setBusy(busy) {
  els.input.disabled = busy || gameOver;
  els.sendBtn.disabled = busy || gameOver;
}

function showTyping() {
  const div = document.createElement("div");
  div.className = "msg buyer typing";
  div.id = "typing";
  div.textContent = `${product.buyer.name} is thinking…`;
  els.messages.appendChild(div);
  scrollDown();
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

function endGame(outcome) {
  gameOver = true;
  els.outcome.classList.remove("hidden", "deal", "no_deal");
  els.outcome.classList.add(outcome);
  els.outcome.textContent =
    outcome === "deal"
      ? `Deal closed! ${product.buyer.name} bought ${product.name}.`
      : `No deal. ${product.buyer.name} ended the call.`;
  els.form.classList.add("hidden");
  els.restartBtn.classList.remove("hidden");
}

els.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = els.input.value.trim();
  if (!text || gameOver) return;

  addMessage("user", text);
  messages.push({ role: "user", content: text });
  els.input.value = "";
  setBusy(true);
  showTyping();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, messages }),
    });
    const data = await res.json();
    removeTyping();

    if (!res.ok) {
      addSystemNote(data.error || "Something went wrong. Try again.");
      setBusy(false);
      return;
    }

    addMessage("assistant", data.reply);
    messages.push({ role: "assistant", content: data.reply });

    if (data.outcome) {
      endGame(data.outcome);
    } else {
      setBusy(false);
      els.input.focus();
    }
  } catch (err) {
    removeTyping();
    addSystemNote("Network error. Try again.");
    setBusy(false);
  }
});

els.restartBtn.addEventListener("click", () => {
  messages = [];
  gameOver = false;
  els.messages.innerHTML = "";
  els.outcome.classList.add("hidden");
  els.form.classList.remove("hidden");
  els.restartBtn.classList.add("hidden");
  setBusy(false);
  loadProduct();
  els.input.focus();
});

loadProduct();
