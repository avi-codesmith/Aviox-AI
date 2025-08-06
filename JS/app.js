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
const imageGenerator = document.querySelector(".image-generator");
const randomButton = document.querySelector(".random-btn");
const main = document.querySelector(".main");
const chatBot = document.querySelector(".chatbot");
const loaderIcon = document.querySelector(".loader img");

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

const enhancedWidth = () => {
  input.addEventListener("input", () => {
    console.log(input.value);
    console.log(input.scrollHeight);
    if (input.value.trim() !== "") {
      console.log(input.scrollWidth);
      if (input.scrollHeight * 2 > input.scrollWidth / 8) {
        input.style.height = "10rem";
      } else {
        input.style.height = "2.4rem";
      }
    }
  });
};

enhancedWidth();

function showSparkles(event) {
  const sparkleContainer = document.querySelector(".sparkle-container");
  sparkleContainer.innerHTML = "";

  const img = document.createElement("img");
  img.src = "icons/sparkle.svg";
  img.alt = "sparkle";
  img.classList.add("sparkle");

  img.style.position = "absolute";
  img.style.top = `${event.clientY}px`;
  img.style.left = `${event.clientX}px`;

  sparkleContainer.appendChild(img);
}

chatBot.addEventListener("click", (e) => {
  e.preventDefault();
  isImageGenerator = false;
  loader.style.opacity = "1";
  loader.style.pointerEvents = "auto";
  loaderIcon.classList.add("round");
  if (isImageGenerator === false) {
    setTimeout(() => {
      loader.style.opacity = "0";
      loaderIcon.classList.remove("round");
      loader.style.pointerEvents = "none";
    }, 1000);
    input.style.height = "2.4rem";
    newChatBtn.click();
    heading.classList.remove("gradient");
    up.classList.remove("gradientBg");
    history.style.display = "block";
    fileButton.style.display = "block";
    emojiBtn.style.display = "flex";
    randomButton.style.display = "none";
    input.placeholder = "Ask anything";
    heading.textContent = headings[Math.floor(Math.random() * headings.length)];
  }
});

imageGenerator.addEventListener("click", () => {
  isImageGenerator = true;
  console.log(isImageGenerator);
  if (isImageGenerator) {
    input.style.height = "2.4rem";

    newChatBtn.click();
    heading.classList.add("gradient");
    up.classList.add("gradientBg");
    if (fileButton && emojiBtn && input && randomButton && history) {
      history.style.display = "none";
      fileButton.style.display = "none";
      emojiBtn.style.display = "none";
      randomButton.style.display = "flex";
      input.placeholder = "Describe the image you want";
    }
    heading.textContent =
      imageGeneratorHeadings[
        Math.floor(Math.random() * imageGeneratorHeadings.length)
      ];

    randomButton.addEventListener("click", () => {
      for (let i = 0; i < imagePrompt.length; i++) {
        if (!imagePrompt[i].includes(".")) {
          imagePrompt[i] += ".";
        }
      }
      const random = Math.floor(Math.random() * imagePrompt.length);
      input.value = imagePrompt[random];
    });
  }
  showSparkles(event);
});

const error = (botText) => {
  botText.textContent = "503 Error: Something went wrong! Pls try again.";
  botText.classList.add("red");
};
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
  loaderIcon.classList.add("round");
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
  if (boxes.length == 0) {
    openBox.style.opacity = "1";
  } else {
    openBox.style.opacity = "0";
  }
};

newChatBtn.addEventListener("click", () => {
  chatBox.innerHTML = "";
  input.value = "";
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
  if (isImageGenerator === true) {
    const getImage = async () => {
      const apiUrl = "https://clipdrop-api.co/text-to-image/v1";

      try {
        const form = new FormData();
        form.append("prompt", message);

        console.log(imgAPI);
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "x-api-key": imgAPI,
          },
          body: form,
        });

        if (!response.ok) {
          const err = await response.json();
          console.error("API error response", err);
          botText.textContent = "Failed to generate image";
          return;
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);

        botText.textContent = "";
        const img = `
          <img src="${imageUrl}" class="generated-img" alt="generated Image">
          <a href="${imageUrl}" download="img.jpeg">
          <svg width="20" height="20" class="download-icon" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="icon"><path d="M2.66821 12.6663V12.5003C2.66821 12.1331 2.96598 11.8353 3.33325 11.8353C3.70052 11.8353 3.99829 12.1331 3.99829 12.5003V12.6663C3.99829 13.3772 3.9992 13.8707 4.03052 14.2542C4.0612 14.6298 4.11803 14.8413 4.19849 14.9993L4.2688 15.1263C4.44511 15.4137 4.69813 15.6481 5.00024 15.8021L5.13013 15.8577C5.2739 15.9092 5.46341 15.947 5.74536 15.97C6.12888 16.0014 6.62221 16.0013 7.33325 16.0013H12.6663C13.3771 16.0013 13.8707 16.0014 14.2542 15.97C14.6295 15.9394 14.8413 15.8825 14.9993 15.8021L15.1262 15.7308C15.4136 15.5545 15.6481 15.3014 15.802 14.9993L15.8577 14.8695C15.9091 14.7257 15.9469 14.536 15.97 14.2542C16.0013 13.8707 16.0012 13.3772 16.0012 12.6663V12.5003C16.0012 12.1332 16.2991 11.8355 16.6663 11.8353C17.0335 11.8353 17.3313 12.1331 17.3313 12.5003V12.6663C17.3313 13.3553 17.3319 13.9124 17.2952 14.3626C17.2624 14.7636 17.1974 15.1247 17.053 15.4613L16.9866 15.6038C16.7211 16.1248 16.3172 16.5605 15.8215 16.8646L15.6038 16.9866C15.227 17.1786 14.8206 17.2578 14.3625 17.2952C13.9123 17.332 13.3553 17.3314 12.6663 17.3314H7.33325C6.64416 17.3314 6.0872 17.332 5.63696 17.2952C5.23642 17.2625 4.87552 17.1982 4.53931 17.054L4.39673 16.9866C3.87561 16.7211 3.43911 16.3174 3.13501 15.8216L3.01294 15.6038C2.82097 15.2271 2.74177 14.8206 2.70435 14.3626C2.66758 13.9124 2.66821 13.3553 2.66821 12.6663ZM9.33521 3.33333C9.33521 2.96606 9.63298 2.66829 10.0002 2.66829C10.3674 2.66847 10.6653 2.96617 10.6653 3.33333V10.8939L12.8625 8.69661L12.967 8.61165C13.2252 8.44092 13.5766 8.46925 13.804 8.69661C14.0633 8.95628 14.0634 9.37744 13.804 9.63704L10.47 12.97C10.3453 13.0947 10.1765 13.1653 10.0002 13.1654C9.82388 13.1654 9.65425 13.0948 9.52954 12.97L6.19653 9.63704L6.11157 9.53255C5.94101 9.27441 5.96924 8.9239 6.19653 8.69661C6.42382 8.46932 6.77433 8.44109 7.03247 8.61165L7.13696 8.69661L9.33521 10.8949V3.33333Z"></path></svg>
          </a>
        `;
        botText.innerHTML = img;
        bot.classList.add("stop");
        botText.addEventListener("click", () => {
          botText.innerHTML = `<img src="${imageUrl}" class="generated-img big" alt="generated Image">
          <a href="${imageUrl}" download="img.jpeg">
          <svg width="16" height="16" class="download-icon" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="icon"><path d="M2.66821 12.6663V12.5003C2.66821 12.1331 2.96598 11.8353 3.33325 11.8353C3.70052 11.8353 3.99829 12.1331 3.99829 12.5003V12.6663C3.99829 13.3772 3.9992 13.8707 4.03052 14.2542C4.0612 14.6298 4.11803 14.8413 4.19849 14.9993L4.2688 15.1263C4.44511 15.4137 4.69813 15.6481 5.00024 15.8021L5.13013 15.8577C5.2739 15.9092 5.46341 15.947 5.74536 15.97C6.12888 16.0014 6.62221 16.0013 7.33325 16.0013H12.6663C13.3771 16.0013 13.8707 16.0014 14.2542 15.97C14.6295 15.9394 14.8413 15.8825 14.9993 15.8021L15.1262 15.7308C15.4136 15.5545 15.6481 15.3014 15.802 14.9993L15.8577 14.8695C15.9091 14.7257 15.9469 14.536 15.97 14.2542C16.0013 13.8707 16.0012 13.3772 16.0012 12.6663V12.5003C16.0012 12.1332 16.2991 11.8355 16.6663 11.8353C17.0335 11.8353 17.3313 12.1331 17.3313 12.5003V12.6663C17.3313 13.3553 17.3319 13.9124 17.2952 14.3626C17.2624 14.7636 17.1974 15.1247 17.053 15.4613L16.9866 15.6038C16.7211 16.1248 16.3172 16.5605 15.8215 16.8646L15.6038 16.9866C15.227 17.1786 14.8206 17.2578 14.3625 17.2952C13.9123 17.332 13.3553 17.3314 12.6663 17.3314H7.33325C6.64416 17.3314 6.0872 17.332 5.63696 17.2952C5.23642 17.2625 4.87552 17.1982 4.53931 17.054L4.39673 16.9866C3.87561 16.7211 3.43911 16.3174 3.13501 15.8216L3.01294 15.6038C2.82097 15.2271 2.74177 14.8206 2.70435 14.3626C2.66758 13.9124 2.66821 13.3553 2.66821 12.6663ZM9.33521 3.33333C9.33521 2.96606 9.63298 2.66829 10.0002 2.66829C10.3674 2.66847 10.6653 2.96617 10.6653 3.33333V10.8939L12.8625 8.69661L12.967 8.61165C13.2252 8.44092 13.5766 8.46925 13.804 8.69661C14.0633 8.95628 14.0634 9.37744 13.804 9.63704L10.47 12.97C10.3453 13.0947 10.1765 13.1653 10.0002 13.1654C9.82388 13.1654 9.65425 13.0948 9.52954 12.97L6.19653 9.63704L6.11157 9.53255C5.94101 9.27441 5.96924 8.9239 6.19653 8.69661C6.42382 8.46932 6.77433 8.44109 7.03247 8.61165L7.13696 8.69661L9.33521 10.8949V3.33333Z"></path></svg>
          </a>`;
        });
      } catch (error) {
        console.error("Image generation failed:", error);
        botText.textContent = "Error generating image";
      }
    };

    getImage();
    return;
  }

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
        error(botText);
      }
    } else {
      error(botText);
    }

    chatScroll.scrollTop = chatBox.scrollHeight;
  } catch (e) {
    error(botText);
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

const addDiv = () => {
  const message = input.value.trim();
  input.style.height = "2.4rem";

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
    input.value = "";
    heading.classList.add("hide");

    const bot = document.createElement("div");
    bot.classList.add("message", "bot");

    const botText = document.createElement("div");
    botText.classList.add("text", "bg2");
    if (isImageGenerator === false) {
      botText.textContent = "Thinking...";
    } else {
      botText.textContent = "Generating an Image...";
    }

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

      const chatsNameArr = [
        "New Chat",
        "User input clarification",
        "User input Check",
        "Random Text Check",
      ];

      const random = Math.floor(Math.random() * chatsNameArr.length);

      const RandomChats = chatsNameArr[random];

      const textForHistory = isRandom(message) ? RandomChats : message;

      if (isImageGenerator === false) {
        history.innerHTML += createHistoryBox(id, textForHistory);
      }

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

const upEvents = (e) => {
  e.preventDefault();
  picker.style.height = "0";
  picker.style.opacity = "0";
  picker.style.scale = "0";

  addDiv();

  const selectedImage = document.querySelector(".selectedImage");
  if (selectedImage) {
    selectedImage.remove();
  }

  base64Image = null;

  input.focus();
};

form.addEventListener("click", () => {
  input.focus();
});

up.addEventListener("click", upEvents);

document.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addDiv();
    upEvents;
  } else if (e.key === "/") {
    input.focus();
  } else if (e.ctrlKey && e.key.toLowerCase() === "b") {
    classToggle();
  } else if (e.ctrlKey && e.key.toLowerCase() === "m") {
    newChatBtn.click();
  }
});
