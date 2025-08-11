// script.js
// Responsible for:
//  - populating links
//  - lazy-loading & blur-up background image
//  - small progressive-loading / ARIA-friendly behavior

// ========== Profile data (edit as needed) ==========
const profile = {
  username: "BRA1NER",
  tagline: "DeGods member",
  links: [
    { name: "DeGods", url: "https://degods.com/u/brainer", color: "bg-[#000000]", icon: "images/degods.png" },
    { name: "Twitter", url: "https://x.com/bra1ner_com", color: "bg-[#000000]", icon: "images/twitter.png" },
    { name: "Instagram", url: "https://instagram.com/bra1ner_com", color: "bg-[#000000]", icon: "images/instagram.png" },
    { name: "TikTok", url: "https://www.tiktok.com/@bra1ner.com", color: "bg-[#000000]", icon: "images/tik.png" }
  ]
};

// ========== Populate UI ==========
document.getElementById("username").innerText = profile.username;
document.getElementById("tagline").innerText = profile.tagline;

const linksContainer = document.getElementById("links");
profile.links.forEach(link => {
  const a = document.createElement("a");
  a.href = link.url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.className = `link-btn ${link.color} text-white px-4 py-3 rounded-xl`;
  a.innerHTML = `
    <img src="${link.icon}" alt="" aria-hidden="true">
    <span>${link.name}</span>
  `;
  linksContainer.appendChild(a);
});

// ========== Lazy load background (blur-up) ==========
(function lazyLoadBackground() {
  const bgImg = document.getElementById("bg-img");
  const picture = document.getElementById("bg-picture");
  if (!bgImg) return;

  // Small helper to swap in data-src / data-srcset
  function loadImage() {
    // If picture has <source> elements with data-srcset, set srcset
    const sources = picture.querySelectorAll("source");
    sources.forEach(src => {
      const ds = src.getAttribute("data-srcset");
      if (ds) src.setAttribute("srcset", ds);
    });

    // Set img srcset and src
    const dataSrcset = bgImg.getAttribute("data-srcset");
    const dataSrc = bgImg.getAttribute("data-src");
    if (dataSrcset) bgImg.setAttribute("srcset", dataSrcset);
    if (dataSrc) bgImg.setAttribute("src", dataSrc);

    // Listen for load
    if (bgImg.complete && bgImg.naturalWidth !== 0) {
      // already cached
      bgImg.classList.add("loaded");
    } else {
      bgImg.addEventListener("load", () => {
        bgImg.classList.add("loaded");
      }, { once: true });
    }
  }

  // Use IntersectionObserver to avoid loading until the page is near viewport
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage();
          observer.disconnect();
        }
      });
    }, { rootMargin: "200px" });
    io.observe(bgImg);
  } else {
    // fallback: load immediately
    loadImage();
  }
})();
