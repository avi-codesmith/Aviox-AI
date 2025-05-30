"use strict";

const loader = document.querySelector(".loader");
const hamIcon = document.querySelectorAll(".ham");
const container = document.querySelector(".container");
const dHidden = document.querySelector(".d-hidden");
const up = document.querySelector(".up");
const chatBox = document.querySelector(".chat-box");
const input = document.querySelector(".input");
const form = document.querySelector("form");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.style.opacity = "0";
    input.focus();
  }, 1000);
});

hamIcon.forEach((e) => {
  e.addEventListener("click", () => {
    container.classList.toggle("jump");
    dHidden.classList.toggle("opacity");
  });
});

const addDiv = () => {
  const message = input.value.trim(); // remove extra spaces

  if (message !== "") {
    const user = document.createElement("div");
    chatBox.appendChild(user);

    const text = document.createElement("div");
    user.appendChild(text);

    user.classList.add("message", "user");
    text.classList.add("text", "bg");
    text.textContent = message;

    input.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;
  }
};

const focus = () => {
  input.focus();
};

form.addEventListener("click", focus);
up.addEventListener("click", addDiv);
document.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addDiv();
  }
});
