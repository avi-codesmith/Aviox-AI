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

const apiUrl = "http://localhost:3000/ask";

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
    heading.textContent = headings[Math.floor(Math.random() * headings.length)];
  }, 1000);
  hamIcon[0]?.click();
  loadHistory();
});

const toggleOpenBoxVisibility = () => {
  const openBox = document.querySelector(".open-box");
  const hisBoxes = document.querySelectorAll(".his-box");
  if (openBox) openBox.style.display = hisBoxes.length > 0 ? "none" : "";
};

newChatBtn.addEventListener("click", () => {
  chatBox.innerHTML = "";
  input.value = "";
  heading.textContent = headings[Math.floor(Math.random() * headings.length)];
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
    if (window.innerWidth <= 860) classToggle();
    const hisBox = e.target.closest(".his-box");
    const hisText = hisBox?.querySelector(".his-text");
    const message = hisText?.textContent.trim();
    if (message) {
      input.value = message;
      addDiv();
    }
  }
});

del.addEventListener("click", () => {
  if (hisBoxToDelete) {
    const text = hisBoxToDelete.querySelector(".his-text")?.textContent.trim();
    hisBoxToDelete.remove();
    hisBoxToDelete = null;
    let saved = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    saved = saved.filter((msg) => msg !== text);
    localStorage.setItem("chatHistory", JSON.stringify(saved));
  }
  windowBox.style.opacity = "0";
  container.style.opacity = "1";
  container.style.pointerEvents = "auto";
  container.style.userSelect = "none";
  toggleOpenBoxVisibility();
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

hamIcon.forEach((e) => e.addEventListener("click", classToggle));
dull.addEventListener("click", classToggle);

const getAnswer = async (message, botText) => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    const reply = data.choices[0].message.content;
    botText.textContent = reply.replace(/[*\/\\']/g, "").trim();
    chatScroll.scrollTop = chatBox.scrollHeight;
  } catch {
    botText.textContent = "404 Error : Something went wrong. Pls try again";
    botText.classList.add("red");
    chatScroll.scrollTop = chatBox.scrollHeight;
  }
};

const createHistoryBox = (message) => {
  return `
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
    history.innerHTML += createHistoryBox(message);
    const oldHistory = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    oldHistory.push(message);
    localStorage.setItem("chatHistory", JSON.stringify(oldHistory));
    toggleOpenBoxVisibility();
  }
};

up.addEventListener("click", addDiv);

const focus = () => input.focus();

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

const loadHistory = () => {
  const saved = JSON.parse(localStorage.getItem("chatHistory") || "[]");
  if (saved.length > 0) {
    saved.forEach((msg) => {
      history.innerHTML += createHistoryBox(msg);
    });
  }
  toggleOpenBoxVisibility();
};
