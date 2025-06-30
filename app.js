"use strict";

const loader = document.querySelector(".loader");
const hamIcon = document.querySelectorAll(".ham");
const container = document.querySelector(".container");
const dHidden = document.querySelector(".d-hidden");
const up = document.querySelector(".up");
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
const fileWrapper = document.querySelector(".file-input");
const fileButton = document.querySelector(".link");
const fileDiv = document.querySelector(".file");
const emojiBtn = document.getElementById("inputContainer");
const imageGenerator = document.querySelectorAll(".image-generator");
const randomButton = document.querySelector(".random-btn");
const main = document.querySelector(".main");

let allowed = true;
let firstMessageAdded = false;
let hisBoxToDelete = null;
let deleteTextContent = "";
let isImageGenerator = false;

const headings = [
  "What’s up? Aviox here!",
  "Need help? Aviox is here!",
  "What are we building today?",
  "What's on your mind? tell Aviox",
  "Hey! Let’s create with Aviox.",
  "Aviox is ready. You?",
  "How can Aviox help You?",
  "Let’s start something cool with Aviox!",
  "What’s today’s mission?",
  "Coding with Aviox today?",
  "Let’s do this! Aviox here.",
];

const imageGeneratorHeadings = [
  "Ready to imagine? Aviox here!",
  "Let’s make some art with Aviox!",
  "Describe your image with Aviox!",
  "Got an idea? Let’s draw it!",
  "Image time! share with Aviox.",
  "Let’s create your vision with Aviox!",
  "Write a prompt with Aviox!",
];

function showSparkles() {
  const sparkleContainer = document.querySelector(".sparkle-container");
  sparkleContainer.innerHTML = "";

  const img = document.createElement("img");
  img.src = "icons/sparkle.svg";
  img.alt = "sparkle";
  img.classList.add("sparkle");

  img.style.top = "100px";
  img.style.left = "180px";

  sparkleContainer.appendChild(img);
}

imageGenerator.forEach((e) => {
  e.addEventListener("click", () => {
    isImageGenerator = true;
    newChatBtn.click();
    heading.classList.add("gradient");
    up.classList.add("gradientBg");
    if (fileButton && emojiBtn && input && randomButton) {
      fileButton.style.display = "none";
      emojiBtn.style.display = "none";
      randomButton.style.display = "flex";
      input.placeholder = "Describe the image you want";
    }
    heading.textContent =
      imageGeneratorHeadings[
        Math.floor(Math.random() * imageGeneratorHeadings.length)
      ];
    showSparkles();
  });
});
const error = () => {
  botText.textContent = "503 Error: Something went wrong! Pls try again.";
  botText.classList.add("red");
};

const apiKey =
  "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";

const loadHistory = () => {
  let saved = JSON.parse(localStorage.getItem("chatHistory") || "[]");

  if (saved?.length > 0) {
    history.innerHTML = "";

    saved = saved.filter((msg) => msg?.text && typeof msg.text === "string");

    saved.forEach((msg) => {
      history.innerHTML += createHistoryBox(msg.id, msg.text);
    });

    localStorage.setItem("chatHistory", JSON.stringify(saved));
    toggleOpenBoxVisibility();
  }
};

picker.style.height = "0";
picker.style.scale = "0";
picker.style.opacity = "0";

let isPickerOpen = false;

toggleButton.addEventListener("click", () => {
  isPickerOpen = !isPickerOpen;

  if (isPickerOpen) {
    picker.style.height = "30rem";
    picker.style.scale = "1";
    picker.style.opacity = "1";
  } else {
    picker.style.height = "0";
    picker.style.scale = "0.5";
    picker.style.opacity = "0";
  }
});

picker.addEventListener("emoji-click", (event) => {
  input.value += event.detail.unicode;
});

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.style.opacity = "0";

    heading.textContent = (
      isImageGenerator ? imageGeneratorHeadings : headings
    )[Math.floor(Math.random() * imageGeneratorHeadings.length)];

    container.style.pointerEvents = "auto";
  }, 1000);

  input.focus();
  loadHistory();
});

let base64Image = null;

fileWrapper.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    if (!file.type.match("image.*")) {
      alert("Please select an image file");
    } else {
      reader.onload = function (e) {
        base64Image = e.target.result;
        const imgElement = document.createElement("img");
        imgElement.classList.add("selectedImage");
        imgElement.src = base64Image;
        fileDiv.appendChild(imgElement);
      };

      reader.readAsDataURL(file);
    }
  }
});

fileButton.addEventListener("click", (e) => {
  e.preventDefault();
  fileWrapper.click();
});

const toggleOpenBoxVisibility = () => {
  const boxes = document.querySelectorAll(".his-box");
  console.log("🚀 ~ toggleOpenBoxVisibility ~ boxes:", boxes);

  if (boxes.length == 0) {
    openBox.style.opacity = "1";
  } else {
    openBox.style.opacity = "0";
  }
};

newChatBtn.addEventListener("click", () => {
  chatBox.innerHTML = "";
  input.value = "";
  form.style.transform = " translateY(-280%)";
  heading.textContent = (isImageGenerator ? imageGeneratorHeadings : headings)[
    Math.floor(Math.random() * imageGeneratorHeadings.length)
  ];

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
  hisBoxToDelete = e.target.closest(".his-box");
  const box = e.target.closest(".his-box");
  const inputBox = hisBoxToDelete.querySelector(".his-text");
  const transitionEl = box?.querySelector(".transition");

  if (e.target.closest(".del")) {
    if (transitionEl) transitionEl.classList.remove("hidden");

    container.style.pointerEvents = "none";
    deleteTextContent = inputBox?.value.trim();
    windowBox.style.opacity = "1";
    windowBox.style.pointerEvents = "auto";
    container.style.filter = "brightness(0.1)";
    container.style.opacity = "0.9";
    container.style.userSelect = "none";
  } else if (e.target.closest(".to")) {
    allowed = false;
    inputBox.removeAttribute("disabled");
    inputBox.focus();
    inputBox.select();
    const saveEdit = () => {
      inputBox.setAttribute("disabled", "true");
      document.removeEventListener("keyup", handleEnter);
      document.removeEventListener("click", handleClickAway, true);

      const updatedText = inputBox.value.trim();
      const id = hisBoxToDelete.dataset.id;

      let saved = JSON.parse(localStorage.getItem("chatHistory") || "[]");
      saved = saved.map((msg) =>
        msg.id === id ? { ...msg, text: updatedText } : msg
      );
      localStorage.setItem("chatHistory", JSON.stringify(saved));
    };
    const handleEnter = (event) => {
      if (event.key === "Enter") {
        saveEdit();
      }
    };
    const handleClickAway = (event) => {
      if (!inputBox.contains(event.target)) {
        saveEdit();
      }
    };

    document.addEventListener("keyup", handleEnter);
    document.addEventListener("click", handleClickAway, true);
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

async function getAnswer({ message, base64Image, botText, bot }) {
  try {
    const content = [{ type: "text", text: message }];
    if (base64Image) {
      content.push({
        type: "image_url",
        image_url: { url: base64Image },
      });
    }

    const payload = {
      model: "tngtech/deepseek-r1t-chimera:free",
      messages: [{ role: "user", content }],
    };

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    bot.classList.add("stop");
    if (res.ok) {
      if (data.choices?.[0]?.message?.content) {
        botText.textContent = data.choices[0].message.content;
      } else {
        error;
      }
    } else {
      error;
    }
    chatScroll.scrollTop = chatBox.scrollHeight;
  } catch (e) {
    error;
  }
  base64Image = null;
}

const createHistoryBox = (id, text) => {
  return `
    <div class="his-box box" data-id="${id}">
      <input disabled class="his-text" value="${text}">
      <div class="mini-ham">
        <img alt="more" src="icons/mini-ham.svg" />
      </div>
      <div class="transition box">
        <span class="to"><img alt="to-btn" src="icons/to.svg" />Edit</span>
        <span class="del">
          <img alt="del-btn" src="icons/del.svg" />
          <font color="#ddd">Delete</font>
        </span>
      </div>
    </div>`;
};

const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substring(2);
};
showSparkles;
const addDiv = () => {
  const message = input.value.trim();

  if (message !== "" || base64Image) {
    const user = document.createElement("div");
    user.classList.add("message", "user");

    if (message !== "") {
      const text = document.createElement("div");
      text.classList.add("text", "bg");
      text.textContent = message;
      user.appendChild(text);
    }

    if (base64Image) {
      const img = document.createElement("img");
      img.src = base64Image;
      img.alt = "Uploaded Image";
      img.classList.add("chatImage");
      user.style.backgroundColor = "transparent";
      user.appendChild(img);
    }

    chatBox.appendChild(user);
    form.style.transform = "translateY(0)";
    input.value = "";
    heading.classList.add("hide");

    const bot = document.createElement("div");
    bot.classList.add("message", "bot");

    const botText = document.createElement("div");
    botText.classList.add("text", "bg2");
    botText.textContent = "Thinking...";

    bot.appendChild(botText);
    chatBox.appendChild(bot);

    chatScroll.scrollTop = chatBox.scrollHeight;

    getAnswer({ message, base64Image, botText, bot });

    if (!firstMessageAdded && message && allowed === true) {
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

    base64Image = null;
  }
};

up.addEventListener("click", (e) => {
  e.preventDefault();

  picker.style.height = "0";
  picker.style.opacity = "0";
  picker.style.scale = "0";

  addDiv();

  const selectedImage = document.querySelector(".selectedImage");
  selectedImage.remove();

  base64Image = null;

  input.focus();
});

form.addEventListener("click", () => {
  input.focus();
});

document.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addDiv();
    picker.style.height = "0";
    picker.style.opacity = "0";
    picker.style.scale = "0";
  } else if (e.key === "/") {
    input.focus();
  } else if (e.ctrlKey && e.key.toLowerCase() === "b") {
    classToggle();
  } else if (e.ctrlKey && e.key.toLowerCase() === "m") {
    newChatBtn.click();
  }
});
