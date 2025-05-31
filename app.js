"use strict";

const loader = document.querySelector(".loader");
const hamIcon = document.querySelectorAll(".ham");
const container = document.querySelector(".container");
const dHidden = document.querySelector(".d-hidden");
const up = document.querySelector(".up");
const chatBox = document.querySelector(".chat-box");
const input = document.querySelector(".input");
const form = document.querySelector("form");

const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
const apiKey =
  "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";

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.style.opacity = "0";
    input.focus();
  }, 1000);
  hamIcon[0].click();
});

hamIcon.forEach((e) => {
  e.addEventListener("click", () => {
    container.classList.toggle("jump");
    dHidden.classList.toggle("opacity");
  });
});

const getAnswer = async (message, botText) => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://yourdomain.com",
        "X-Title": "My Chatbot App",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    const reply = data.choices[0].message.content;
    botText.textContent = reply.replace(/[*\/\\'`]/g, "").trim();
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    botText.textContent = "404 Error : Something went wrong. Pls try again";
    botText.classList.add("red");
  }
};

const addDiv = () => {
  chatBox.classList.add("hide");

  const message = input.value.trim();

  if (message !== "") {
    const user = document.createElement("div");
    chatBox.appendChild(user);
    const text = document.createElement("div");
    user.appendChild(text);
    user.classList.add("message", "user");
    text.classList.add("text", "bg");
    text.textContent = message;

    input.value = "";

    const bot = document.createElement("div");
    chatBox.appendChild(bot);
    const botText = document.createElement("div");
    bot.appendChild(botText);
    bot.classList.add("message", "bot");
    botText.classList.add("text", "bg2");
    botText.textContent = "Thinking...";

    chatBox.scrollTop = chatBox.scrollHeight;

    getAnswer(message, botText);
  }
};

const focus = () => {
  input.focus();
};

form.addEventListener("click", (e) => {
  e.preventDefault();
  addDiv();
  input.focus();
});

up.addEventListener("click", addDiv);

document.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addDiv();
  } else if (e.key === "/") {
    focus();
  }
});
