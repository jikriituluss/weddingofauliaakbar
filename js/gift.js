// Wedding Gift — tombol salin nomor rekening (dengan fallback browser lama)
(function () {
  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      try {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        done(ok);
      } catch (e) {
        done(false);
      }
    }
  }

  function init() {
    document.querySelectorAll(".btn-copy[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = document.getElementById(btn.getAttribute("data-copy"));
        if (!target) return;
        var number = target.textContent.replace(/\s+/g, "");
        var original = btn.textContent;
        copyText(number, function (ok) {
          btn.textContent = ok ? "✓ Tersalin" : "Salin manual: " + target.textContent;
          btn.classList.add("is-copied");
          setTimeout(function () {
            btn.textContent = original;
            btn.classList.remove("is-copied");
          }, 2200);
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
