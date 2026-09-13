// Sistem nama tamu dinamis: ?to=Nama%20Tamu
(function () {
  function capSegment(seg) {
    // Kapital depan, sisanya kecil: s.pd -> S.Pd, BUDI -> Budi
    if (!seg) return seg;
    return seg.charAt(0).toUpperCase() + seg.slice(1).toLowerCase();
  }

  function toTitleCase(name) {
    // Tiap kata huruf depan besar; tiap bagian bertitik juga (gelar: S.Pd, M.Si, H.)
    return name
      .split(/(\s+)/)
      .map(function (word) {
        if (/^\s*$/.test(word)) return word;
        // pisahkan tapi simpan pembatas agar Hj. / D'Angelo / S.Pd / Jikri/Sekeluarga rapi
        return word
          .split(/([-'.\\/])/)
          .map(function (part, i) {
            if (i % 2 === 1) return part; // pembatas, biarkan
            return capSegment(part);
          })
          .join("");
      })
      .join("");
  }

  function getGuestName() {
    try {
      var raw = window.location.search || "";
      var params = new URLSearchParams(raw);
      var to = null;
      // Cari key case-insensitive + alias umum (?to=, ?To=, ?tamu=, ?nama=, ?guest=)
      var keys = ["to", "tamu", "nama", "guest", "kepada"];
      params.forEach(function (value, key) {
        if (to) return;
        if (keys.indexOf(String(key).toLowerCase()) !== -1 && value && value.trim()) {
          to = value;
        }
      });
      // Fallback: query tanpa key, mis. ?Budi%20Santoso
      if (!to && raw.length > 1 && raw.indexOf("=") === -1) {
        try {
          var decoded = decodeURIComponent(raw.slice(1).replace(/\+/g, " ")).trim();
          if (decoded) to = decoded;
        } catch (e) { /* abaikan */ }
      }
      if (to && to.trim()) return toTitleCase(to.trim().slice(0, 60));
      return "Tamu Undangan";
    } catch (e) {
      return "Tamu Undangan";
    }
  }

  function init() {
    var el = document.getElementById("guestName");
    if (!el) return;
    el.textContent = getGuestName();
    // Animasi muncul perlahan setelah cover render
    window.requestAnimationFrame(function () {
      setTimeout(function () {
        el.classList.add("is-shown");
      }, 650);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
