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
const windowBox = document.querySelector(".window");
const can = document.querySelector(".can");
const newChatBtn = document.querySelector(".new");
const openBox = document.querySelector(".open-box");
const picker = document.getElementById("picker");
const toggleButton = document.getElementById("toggleButton");

let firstMessageAdded = false;
let hisBoxToDelete = null;
let deleteTextContent = "";

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
const loadHistory = () => {
  history.innerHTML = "";
  let saved = JSON.parse(localStorage.getItem("chatHistory") || "[]");

  saved = saved.filter(
    (msg) => msg && msg.text && typeof msg.text === "string"
  );

  saved.forEach((msg) => {
    history.innerHTML += createHistoryBox(msg.id, msg.text);
  });

  localStorage.setItem("chatHistory", JSON.stringify(saved));
  toggleOpenBoxVisibility();
};

picker.style.height = "0";

let isPickerOpen = false;

toggleButton.addEventListener("click", () => {
  isPickerOpen = !isPickerOpen;

  if (isPickerOpen) {
    picker.style.height = "30rem";
  } else {
    picker.style.height = "0";
  }

  form.classList.toggle("border");
});

picker.addEventListener("emoji-click", (event) => {
  input.value += event.detail.unicode;
});

picker.addEventListener("emoji-click", (event) => {
  input.value += event.detail.unicode;
});

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.style.opacity = "0";
    heading.textContent = headings[Math.floor(Math.random() * headings.length)];
    container.style.pointerEvents = "auto";
  }, 1000);
  hamIcon[0]?.click();
  input.focus();
  loadHistory();
});

const toggleOpenBoxVisibility = () => {
  const boxes = document.querySelectorAll(".his-box");
  console.log("his-box count:", boxes.length);

  if (boxes.length == 0) {
    openBox.style.opacity = "1";
    console.log("No his-boxes → Showing openBox");
  } else {
    openBox.style.opacity = "0";
    console.log("his-boxes exist → Hiding openBox");
  }
};

setTimeout(toggleOpenBoxVisibility, 100);
toggleOpenBoxVisibility();

newChatBtn.addEventListener("click", () => {
  chatBox.innerHTML = "";
  input.value = "";
  heading.textContent = headings[Math.floor(Math.random() * headings.length)];
  heading.classList.remove("hide");
  input.focus();
  firstMessageAdded = false;
});

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
    container.style.pointerEvents = "none";
    hisBoxToDelete = e.target.closest(".his-box");
    const inputBox = hisBoxToDelete.querySelector(".his-text");
    deleteTextContent = inputBox?.value.trim();
    windowBox.style.opacity = "1";
    windowBox.style.pointerEvents = "auto";
    container.style.filter = "brightness(0.1)";
    container.style.opacity = "0.9";
    container.style.userSelect = "none";
  } else if (e.target.closest(".to")) {
    if (window.innerWidth <= 860) classToggle();
    const hisBox = e.target.closest(".his-box");
    const hisText = hisBox?.querySelector(".his-text");
    const message = hisText?.value.trim();
    if (message) {
      input.value = message;
      addDiv();
    }
  }
});

del.addEventListener("click", () => {
  if (hisBoxToDelete) {
    const id = hisBoxToDelete.dataset.id;
    hisBoxToDelete.remove();
    let saved = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    saved = saved.filter((msg) => msg.id !== id);
    localStorage.setItem("chatHistory", JSON.stringify(saved));
    deleteTextContent = "";
    hisBoxToDelete = null;
  }

  toggleOpenBoxVisibility();
  windowBox.style.opacity = "0";
  windowBox.style.pointerEvents = "none";
  container.style.filter = "brightness(1)";
  container.style.opacity = "1";
  container.style.pointerEvents = "auto";
  container.style.userSelect = "auto";
});

can.addEventListener("click", () => {
  hisBoxToDelete = null;
  deleteTextContent = "";
  windowBox.style.opacity = "0";
  windowBox.style.pointerEvents = "none";

  container.style.pointerEvents = "auto";
  container.style.filter = "brightness(1)";
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
    botText.textContent = "505 Error : Something went wrong. Pls try again";
    botText.classList.add("red");
    chatScroll.scrollTop = chatBox.scrollHeight;
  }
};

const createHistoryBox = (id, text) => {
  return `
    <div class="his-box" data-id="${id}">
      <input disabled class="his-text" value="${text}">
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

const generateId = () =>
  Date.now().toString() + Math.random().toString(36).substring(2);

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

    if (!firstMessageAdded && message) {
      const id = generateId();

      const isRandom = (msg) => {
        const cleaned = msg.trim().toLowerCase();
        if (cleaned.length < 4) return true;
        if (!cleaned.includes(" ") && !/[aeiou]/.test(cleaned)) return true;
        const uniqueChars = [...new Set(cleaned)].length;
        if (uniqueChars < cleaned.length / 2) return true;
        return false;
      };

      const textForHistory = isRandom(message) ? "New Chat" : message;

      history.innerHTML += createHistoryBox(id, textForHistory);

      const oldHistory = JSON.parse(
        localStorage.getItem("chatHistory") || "[]"
      );
      oldHistory.push({ id, text: textForHistory });
      localStorage.setItem("chatHistory", JSON.stringify(oldHistory));
      toggleOpenBoxVisibility();
      firstMessageAdded = true;
    }
  }
};

up.addEventListener("click", (e) => {
  e.preventDefault();
  addDiv();
  input.focus();
});

form.addEventListener("click", () => {
  input.focus();
});

document.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addDiv();
  } else if (e.key === "/") {
    input.focus();
  } else if (e.ctrlKey && e.key.toLowerCase() === "b") {
    classToggle();
  } else if (e.ctrlKey && e.key.toLowerCase() === "m") {
    newChatBtn.click();
  }
});
