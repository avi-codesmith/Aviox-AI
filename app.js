"use strict";

const loader = document.querySelector(".loader");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.style.opacity = "0";
  }, 1000);
});
