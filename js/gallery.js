// Gallery editorial + Lightbox — foto asli tinggal taruh sebagai
// public/gallery/gallery-01.jpg … gallery-06.jpg (tanpa ubah kode).
// Selama file asli belum ada, placeholder SVG tampil otomatis.
(function () {
  var ITEMS = [
    { file: "gallery-01", orientation: "landscape", caption: "Momen Bahagia Satu" },
    { file: "gallery-02", orientation: "portrait", caption: "Momen Bahagia Dua" },
    { file: "gallery-03", orientation: "portrait", caption: "Momen Bahagia Tiga" },
    { file: "gallery-04", orientation: "landscape", caption: "Momen Bahagia Empat" },
    { file: "gallery-05", orientation: "portrait", caption: "Momen Bahagia Lima" },
    { file: "gallery-06", orientation: "portrait", caption: "Momen Bahagia Enam" }
  ];

  var PLACEHOLDER = {
    portrait: "public/gallery/placeholder-p.svg",
    landscape: "public/gallery/placeholder-l.svg"
  };

  var current = 0;
  var lb, lbImg, lbCap;

  function photoSrc(item) {
    return "public/gallery/" + item.file + ".jpg";
  }

  function renderGallery() {
    var grid = document.getElementById("galleryGrid");
    if (!grid) return;
    ITEMS.forEach(function (item, i) {
      var fig = document.createElement("figure");
      fig.className = "g-item g-" + item.orientation + " reveal";
      fig.setAttribute("data-index", i);

      var img = document.createElement("img");
      img.src = photoSrc(item);
      img.alt = item.caption + " — Aulia dan Akbar";
      img.loading = "lazy";
      img.setAttribute("data-fallback", "0");
      img.addEventListener("error", function handler() {
        // Sekali saja: jpg hilang → placeholder SVG sesuai orientasi
        img.src = PLACEHOLDER[item.orientation] || PLACEHOLDER.portrait;
        img.removeEventListener("error", handler);
      });

      var cap = document.createElement("figcaption");
      cap.textContent = item.caption;

      fig.appendChild(img);
      fig.appendChild(cap);
      fig.addEventListener("click", function () { open(i); });
      fig.setAttribute("tabindex", "0");
      fig.setAttribute("role", "button");
      fig.setAttribute("aria-label", "Buka foto: " + item.caption);
      fig.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(i);
        }
      });
      grid.appendChild(fig);
    });
  }

  function buildLightbox() {
    lb = document.createElement("div");
    lb.className = "lightbox";
    lb.hidden = true;
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Pratinjau foto galeri");
    lb.innerHTML =
      '<div class="lb-backdrop" data-close></div>' +
      '<figure class="lb-figure">' +
        '<img class="lb-img" alt="" />' +
        '<figcaption class="lb-cap"></figcaption>' +
      '</figure>' +
      '<button class="lb-btn lb-close" type="button" aria-label="Tutup pratinjau">✕</button>' +
      '<button class="lb-btn lb-prev" type="button" aria-label="Foto sebelumnya">‹</button>' +
      '<button class="lb-btn lb-next" type="button" aria-label="Foto berikutnya">›</button>';
    document.body.appendChild(lb);
    lbImg = lb.querySelector(".lb-img");
    lbCap = lb.querySelector(".lb-cap");

    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", function () { step(-1); });
    lb.querySelector(".lb-next").addEventListener("click", function () { step(1); });
    lb.querySelector("[data-close]").addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    });
  }

  function show(i) {
    current = (i + ITEMS.length) % ITEMS.length;
    var item = ITEMS[current];
    lbImg.alt = item.caption + " — Aulia dan Akbar";
    lbCap.textContent = (current + 1) + " / " + ITEMS.length + " — " + item.caption;
    // Pakai foto asli bila ada, jika tidak placeholder (samakan dgn grid)
    var probe = new Image();
    probe.onload = function () { lbImg.src = photoSrc(item); };
    probe.onerror = function () { lbImg.src = PLACEHOLDER[item.orientation]; };
    probe.src = photoSrc(item);
  }

  function open(i) {
    show(i);
    lb.hidden = false;
    // restart transisi
    lb.classList.remove("is-open");
    void lb.offsetWidth;
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  }

  function close() {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(function () { lb.hidden = true; }, 350);
  }

  function step(d) { show(current + d); }

  function init() {
    renderGallery();
    buildLightbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
