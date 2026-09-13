// Timeline animasi amplop fisik — tanpa bounce
(function () {
  var OPENING_MS = 2550; // flap selesai + letter keluar penuh
  var LIFT_MS = 650;     // letter maju ke depan
  var FADE_MS = 950;     // cover fade out

  function wait(ms) {
    return new Promise(function (res) { setTimeout(res, ms); });
  }

  function init() {
    var btn = document.getElementById("openBtn");
    var cover = document.getElementById("cover");
    var envelope = document.getElementById("envelope");
    var main = document.getElementById("main") || document.getElementById("mainPlaceholder");
    if (!btn || !cover || !envelope) return;

    var opened = false;

    btn.addEventListener("click", function () {
      if (opened) return;
      opened = true;

      // 1. tombol menghilang halus
      btn.classList.add("is-hidden");
      btn.setAttribute("disabled", "true");

      // 2-4. seal + flap + letter (via CSS .is-opening)
      envelope.classList.add("is-opening");

      wait(OPENING_MS)
        .then(function () {
          // 5. kartu maju sedikit
          envelope.classList.add("is-lifted");
          return wait(LIFT_MS);
        })
        .then(function () {
          // 6. cover fade out
          cover.classList.add("is-fading");
          document.body.classList.remove("locked");
          return wait(FADE_MS);
        })
        .then(function () {
          // 7. tampilkan main invitation + buka akses scroll
          cover.style.display = "none";
          if (main) {
            main.classList.add("is-visible");
            main.setAttribute("aria-hidden", "false");
          }
          document.body.classList.add("opened");
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
