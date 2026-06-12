(function () {
  "use strict";

  /* ============================================================
     Config — the only places to edit when going live.
     `buyUrl: null` falls back to the Instagram DM link below.
     Keep this data in sync with wiki/02-product/templates-catalog.md
     ============================================================ */
  var IG_DM = "https://ig.me/m/jrlly0_0";
  var PRICE = "₱99";

  var TEMPLATES = [
    {
      id: "barong-portrait-collage",
      title: "Barong Portrait — BAR Agustin",
      category: "portrait",
      vibe: "Filipiniana formal portrait collage with torn-paper edges and a playful camera-UI strip.",
      img: "./assets/barong-portrait-collage.jpg",
      wide: false,
      buyUrl: null,
    },
    {
      id: "mayon-atv-adventure-collage",
      title: "Mayon ATV Adventure",
      category: "travel",
      vibe: "Volcano ATV day-trip collage — family and solo shots layered over Mayon.",
      img: "./assets/mayon-atv-adventure-collage.jpg",
      wide: false,
      buyUrl: null,
    },
    {
      id: "mariner-graduation-collage",
      title: "Mariner Graduation — Thoreau",
      category: "graduation",
      vibe: "Maritime cadet graduation tribute with polaroids and a Thoreau quote.",
      img: "./assets/mariner-graduation-collage.jpg",
      wide: false,
      buyUrl: null,
    },
    {
      id: "june-2026-friendship-board",
      title: "June 6 2026 — Friendship Board",
      category: "friendship",
      vibe: "Dense memory board: polaroids, film strips, sunset and a cut-out title.",
      img: "./assets/june-2026-friendship-board.jpg",
      wide: false,
      buyUrl: null,
    },
    {
      id: "explore-albay-story",
      title: "Explore Albay — Cagsawa Story",
      category: "travel",
      vibe: "Ultra-wide cinematic story strip with soft quote overlays. Great for Stories & Reels covers.",
      img: "./assets/explore-albay-story.jpg",
      wide: true,
      buyUrl: null,
    },
  ];

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============ Render gallery cards ============ */
  var grid = document.getElementById("gallery-grid");

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function cardHtml(t) {
    var buy = t.buyUrl || IG_DM;
    var buyLabel = t.buyUrl ? "Get template" : "Get via DM";
    return (
      '<article class="gallery-card reveal' + (t.wide ? " is-wide" : "") + '" data-category="' + t.category + '">' +
        '<div class="card-media" data-img="' + t.img + '" data-caption="' + escapeHtml(t.title) + '">' +
          '<img src="' + t.img + '" alt="' + escapeHtml(t.title) + ' Canva template preview" loading="lazy" />' +
          '<span class="card-cat">' + t.category + "</span>" +
          '<span class="card-zoom">⤢ Preview</span>' +
        "</div>" +
        '<div class="card-body">' +
          '<h3 class="card-title">' + escapeHtml(t.title) + "</h3>" +
          '<p class="card-vibe">' + escapeHtml(t.vibe) + "</p>" +
          '<div class="card-foot">' +
            '<span class="card-price">' + PRICE + " <small>/ template</small></span>" +
            '<a class="btn btn-primary card-buy" href="' + buy + '"' +
              (t.buyUrl ? "" : ' target="_blank" rel="noopener"') + ">" + buyLabel + "</a>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  grid.innerHTML = TEMPLATES.map(cardHtml).join("");

  var galleryCards = Array.prototype.slice.call(document.querySelectorAll(".gallery-card"));

  /* ============ Header condense on scroll ============ */
  var header = document.getElementById("site-header");
  window.addEventListener(
    "scroll",
    function () {
      header.classList.toggle("is-condensed", window.scrollY > 40);
    },
    { passive: true }
  );

  /* ============ Mobile nav ============ */
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");
  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ============ Scroll reveal ============ */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { obs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ============ Gallery filters ============ */
  var filterChips = document.querySelectorAll(".filter-chip");
  filterChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      filterChips.forEach(function (c) {
        var active = c === chip;
        c.classList.toggle("is-active", active);
        c.setAttribute("aria-selected", active ? "true" : "false");
      });
      var filter = chip.dataset.filter;
      galleryCards.forEach(function (card) {
        var show = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* ============ Lightbox ============ */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxClose = lightbox.querySelector(".lightbox-close");
  var lightboxPrev = lightbox.querySelector(".lightbox-prev");
  var lightboxNext = lightbox.querySelector(".lightbox-next");

  var group = [];
  var idx = 0;
  var lastFocused = null;

  function render() {
    var item = group[idx];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.caption;
    lightboxCaption.textContent = item.caption + "  ·  " + (idx + 1) + " / " + group.length;
  }
  function open(g, i) {
    group = g; idx = i; lastFocused = document.activeElement;
    render();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }
  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }
  function step(d) { idx = (idx + d + group.length) % group.length; render(); }

  function visibleGroup() {
    return galleryCards
      .filter(function (card) { return !card.classList.contains("is-hidden"); })
      .map(function (card) {
        var media = card.querySelector(".card-media");
        return { src: media.dataset.img, caption: media.dataset.caption, el: card };
      });
  }

  galleryCards.forEach(function (card) {
    card.querySelector(".card-media").addEventListener("click", function () {
      var g = visibleGroup();
      var i = 0;
      g.forEach(function (item, n) { if (item.el === card) i = n; });
      open(g, i);
    });
  });

  lightboxClose.addEventListener("click", close);
  lightboxPrev.addEventListener("click", function () { step(-1); });
  lightboxNext.addEventListener("click", function () { step(1); });
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* ============ Year ============ */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
