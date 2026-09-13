// Entry point tahap 1
(function () {
  document.body.classList.add("locked");
})();

// Sembunyikan otomatis ornamen yang file-nya tidak ada
// (folder public/ornaments & public/textures belum ada → <img> rusak tampil sebagai kotak).
// Foto mempelai (public/images) tidak disentuh.
(function () {
  function hideBroken(img) {
    img.style.display = "none";
  }

  function guard(img) {
    if (img.dataset.ornamentGuard) return;
    img.dataset.ornamentGuard = "1";
    img.addEventListener("error", function () { hideBroken(img); });
    // Sudah gagal sebelum listener dipasang (cache) → cek manual
    if (img.complete && img.naturalWidth === 0 && img.src) hideBroken(img);
  }

  function init() {
    document.querySelectorAll('img[src*="ornaments"], img[src*="textures"]').forEach(guard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
