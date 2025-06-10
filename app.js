"use strict";

const loader = document.querySelector(".loader");
const hamIcon = document.querySelectorAll(".ham");
const container = document.querySelector(".container");
const dHidden = document.querySelector(".d-hidden");
const up = document.querySelector(".up");
const to = document.querySelectorAll(".to");
const chatBox = document.querySelector(".chat");
const history = document.querySelector(".history");
const chatScroll = document.querySelector(".chat-box");
const input = document.querySelector(".input");
const form = document.querySelector("form");
const heading = document.querySelector(".heading");
const nav = document.querySelector(".nav");
const dull = document.querySelector(".dull");
const del = document.querySelector(".main-del");
const fake = document.querySelectorAll(".del");
const windowBox = document.querySelector(".window");
const can = document.querySelector(".can");
const newChatBtn = document.querySelector(".new");
const openBox = document.querySelector(".open-box");

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
  hamIcon[0]?.click();
});

newChatBtn.addEventListener("click", () => {
  chatBox.innerHTML = "";
  input.value = "";
  const newHeading = headings[Math.floor(Math.random() * headings.length)];
  heading.textContent = newHeading;
  heading.classList.remove("hide");
  input.focus();
});

let hisBoxToDelete = null;

history.addEventListener("mouseover", (e) => {
  const box = e.target.closest(".his-box");
  const transitionEl = box?.querySelector(".transition");
  if (transitionEl) transitionEl.classList.add("hidden");
});

history.addEventListener("mouseout", (e) => {
  const box = e.target.closest(".his-box");
  const transitionEl = box?.querySelector(".transition");
  if (transitionEl) transitionEl.classList.remove("hidden");
});

history.addEventListener("click", (e) => {
  if (e.target.closest(".del")) {
    hisBoxToDelete = e.target.closest(".his-box");
    windowBox.style.opacity = "1";
    windowBox.style.pointerEvents = "auto";
    container.style.opacity = "0.1";
    container.style.pointerEvents = "none";
    container.style.userSelect = "none";
  } else if (e.target.closest(".to")) {
    if (window.innerWidth <= 860) {
      classToggle();
    }
    const hisBox = e.target.closest(".his-box");
    const hisText = hisBox?.querySelector(".his-text");
    const message = hisText?.textContent.trim();
    if (message) {
      openBox.style.display = "none";
      input.value = message;
      addDiv();
    }
  }
});

del.addEventListener("click", () => {
  if (hisBoxToDelete) {
    hisBoxToDelete.remove();
    hisBoxToDelete = null;
  }
  windowBox.style.opacity = "0";
  container.style.opacity = "1";
  container.style.pointerEvents = "auto";
  container.style.userSelect = "none";
});

can.addEventListener("click", () => {
  hisBoxToDelete = null;
  windowBox.style.opacity = "0";
  container.style.opacity = "1";
  container.style.pointerEvents = "auto";
  container.style.userSelect = "auto";
});

const classToggle = () => {
  container.classList.toggle("jump");
  dHidden.classList.toggle("opacity");
  nav.classList.toggle("padding");
  dull.classList.toggle("opacity2");
};

hamIcon.forEach((e) => {
  e.addEventListener("click", () => {
    classToggle();
  });
});

dull.addEventListener("click", () => {
  classToggle();
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
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    botText.textContent = reply.replace(/[*\/\\']/g, "").trim();
    chatScroll.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    botText.textContent = "404 Error : Something went wrong. Pls try again";
    botText.classList.add("red");
    chatScroll.scrollTop = chatBox.scrollHeight;
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
    chatScroll.scrollTop = chatBox.scrollHeight;

    getAnswer(message, botText);

    if (chatBox.children.length === 2) {
      history.innerHTML += `
        <div class="his-box">
          <p class="his-text">${message}</p>
          <div class="mini-ham">
            <img alt="more" src="icons/mini-ham.svg" />
          </div>
          <div class="transition">
            <span class="to"><img alt="to-btn" src="icons/to.svg" />Run</span>
            <span class="del">
              <img alt="del-btn" src="icons/del.svg" />
              <font color="#ddd">Delete</font>
            </span>
          </div>
        </div>`;
    }
  }
};

up.addEventListener("click", addDiv);

const focus = () => {
  input.focus();
};

form.addEventListener("click", (e) => {
  e.preventDefault();
  addDiv();
  input.focus();
});

document.addEventListener("keyup", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "n") {
    e.preventDefault();
    newChatBtn.click();
  } else if (e.key === "Enter") {
    addDiv();
  } else if (e.key === "/") {
    focus();
  } else if (e.ctrlKey && e.key.toLowerCase() === "b") {
    classToggle();
  } else if (e.ctrlKey && e.key.toLowerCase() === "m") {
    newChatBtn.click();
  }
});
