"use strict";

const loader = document.querySelector(".loader");
const hamIcon = document.querySelectorAll(".ham");
const container = document.querySelector(".container");
const dHidden = document.querySelector(".d-hidden");
const up = document.querySelector(".up");
const chatBox = document.querySelector(".chat");
const input = document.querySelector(".input");
const form = document.querySelector("form");
const heading = document.querySelector(".heading");
const nav = document.querySelector(".nav");
const dull = document.querySelector(".dull");

const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
const apiKey =
  "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";
const random = Math.floor(Math.random() * 11);
const headings = [
  "What are you working on?",
  "Hi there, how can I help you?",
  "What's on the agenda today?",
  "What's on your mind today?",
  "Hey! What’s cooking in your brain today?",
  "Let’s build something amazing!",
  "How can I assist you today?",
  "Need a hand with something?",
  "Time to get things done. What’s first?",
  "What are we coding today?",
  "What's your mission today?",
];

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.style.opacity = "0";
    input.focus();
    heading.textContent = headings[random];
  }, 1000);
});

hamIcon.forEach((e) => {
  e.addEventListener("click", () => {
    container.classList.toggle("jump");
    dHidden.classList.toggle("opacity");
    nav.classList.toggle("padding");
    dull.classList.toggle("opacity2");
  });
});

const getAnswer = async (message, botText) => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sarvamai/sarvam-m:free",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    botText.textContent = reply.replace(/[*\/\\']/g, "").trim();
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    botText.textContent = "404 Error : Something went wrong. Pls try again";
    botText.classList.add("red");
  }
};

const addDiv = () => {
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
    heading.classList.add("hide");

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

up.addEventListener("click", addDiv);

const focus = () => {
  input.focus();
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addDiv();
  input.focus();
});

document.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addDiv();
  } else if (e.key === "/") {
    focus();
  }
});
