// RSVP + Wishes — mock/local state, siap disambung ke backend.
// Untuk menghubungkan backend: ganti isi submitRSVP() dengan fetch() ke API.
(function () {
  var STORE_KEY = "aulia-akbar-rsvp-v1";

  var MOCK_WISHES = [
    { name: "John Doe", attend: "hadir", text: "Congratulations! Wishing you both a lifetime of happiness.", at: "14 Juni 2026" },
    { name: "Jane Doe", attend: "hadir", text: "May your journey together always be filled with love.", at: "13 Juni 2026" }
  ];

  // Backend-ready: seluruh pengiriman lewat satu fungsi ini
  function submitRSVP(payload) {
    return new Promise(function (resolve) {
      setTimeout(function () { resolve({ ok: true, data: payload }); }, 600);
    });
  }

  function loadLocal() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveLocal(list) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(list.slice(0, 50)));
    } catch (e) { /* abaikan: mode privat */ }
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function wishNode(w) {
    var card = el("article", "wish");
    card.appendChild(el("p", "w-name", w.name));
    card.appendChild(el("p", "w-text", "\u201C" + w.text + "\u201D"));
    var meta = (w.attend === "hadir" ? "Hadir" : "Berhalangan") + (w.at ? " • " + w.at : "");
    card.appendChild(el("p", "w-meta", meta));
    return card;
  }

  function renderWishes(extra) {
    var list = document.getElementById("wishList");
    if (!list) return;
    list.innerHTML = "";
    (extra || []).concat(MOCK_WISHES).forEach(function (w) {
      list.appendChild(wishNode(w));
    });
  }

  function setErr(field, msg) {
    var wrap = field.closest(".field");
    var err = wrap ? wrap.querySelector(".err") : null;
    if (!msg) {
      if (wrap) wrap.classList.remove("invalid");
      if (err) err.hidden = true;
      return true;
    }
    if (wrap) wrap.classList.add("invalid");
    if (err) { err.textContent = msg; err.hidden = false; }
    return false;
  }

  function init() {
    var form = document.getElementById("rsvpForm");
    if (!form) return;
    var nameI = document.getElementById("rsvpName");
    var countI = document.getElementById("rsvpCount");
    var msgI = document.getElementById("rsvpMsg");
    var okMsg = document.getElementById("rsvpOk");
    var thanks = document.getElementById("wishThanks");
    var btn = form.querySelector(".btn-send");

    renderWishes(loadLocal());

    // Jumlah tamu hanya relevan bila hadir
    var attendRadios = form.querySelectorAll('input[name="attend"]');
    function syncCount() {
      var checked = form.querySelector('input[name="attend"]:checked');
      var hadir = checked && checked.value === "hadir";
      countI.disabled = !hadir;
      countI.closest(".field").style.opacity = hadir ? "1" : "0.45";
    }
    attendRadios.forEach(function (r) { r.addEventListener("change", syncCount); });
    syncCount();

    [nameI, countI].forEach(function (i) {
      i.addEventListener("input", function () { setErr(i, null); });
    });
    attendRadios.forEach(function (r) {
      r.addEventListener("change", function () {
        setErr(r, null);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = nameI.value.trim();
      var checked = form.querySelector('input[name="attend"]:checked');
      var count = parseInt(countI.value, 10);
      var message = msgI.value.trim();
      var valid = true;

      if (!name) valid = setErr(nameI, "Mohon isi nama Anda.") && valid;
      if (!checked) {
        valid = setErr(attendRadios[0], "Mohon pilih konfirmasi kehadiran.") && valid;
      }
      if (checked && checked.value === "hadir") {
        if (!count || count < 1) valid = setErr(countI, "Jumlah tamu minimal 1.") && valid;
      }

      if (!valid) {
        var bad = form.querySelector(".field.invalid");
        if (bad) bad.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      var payload = {
        name: name.slice(0, 60),
        attend: checked.value,
        count: checked.value === "hadir" ? Math.min(count || 1, 10) : 0,
        message: message.slice(0, 300),
        at: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
      };

      btn.disabled = true;
      btn.textContent = "Mengirim…";
      submitRSVP(payload).then(function () {
        var local = loadLocal();
        local.unshift(payload);
        saveLocal(local);
        renderWishes(local);
        form.reset();
        syncCount();
        if (okMsg) okMsg.hidden = false;
        if (thanks) thanks.hidden = false;
        if (thanks) thanks.scrollIntoView({ behavior: "smooth", block: "center" });
        btn.disabled = false;
        btn.textContent = "Kirim Konfirmasi";
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
