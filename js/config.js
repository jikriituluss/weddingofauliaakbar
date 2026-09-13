// Konfigurasi terpusat — SATU-SATUNYA file yang perlu diubah untuk data acara
// Tanggal, lokasi, maps, musik, dan galeri diganti dari sini saja.
window.WEDDING = {
  bride: "Aulia",
  groom: "Akbar",

  // Format ISO dengan zona waktu — dipakai countdown & acuan tanggal
  dateISO: "2026-10-10T08:00:00+07:00",
  dateLabel: "Sabtu, 10 Oktober 2026",

  akad: {
    title: "Akad Nikah",
    date: "Sabtu, 10 Oktober 2026",
    time: "08.00 WIB",
    place: "Khatulistiwa Ballroom, Transera Hotel Pontianak",
    address: "Jl. Gajah Mada N0. 21, Kota Pontianak",
    maps: "https://share.google/rr6SAagjE7ScIgLwn"
  },

  resepsi: {
    title: "Resepsi",
    date: "Sabtu, 10 Oktober 2026",
    time: "14.00 WIB",
    place: "Khatulistiwa Ballroom, Transera Hotel Pontianak",
    address: "Jl. Gajah Mada N0. 21, Kota Pontianak",
    maps: "https://share.google/rr6SAagjE7ScIgLwn"
  },

  music: "public/backsound/vow-alternate-version.mp3"
};

// Isi otomatis elemen [data-wedding] dari config di atas
(function () {
  function apply() {
    if (!window.WEDDING) return;
    document.querySelectorAll("[data-wedding]").forEach(function (el) {
      var key = el.getAttribute("data-wedding");
      var parts = key.split(".");
      var val = window.WEDDING;
      for (var i = 0; i < parts.length; i++) {
        val = val ? val[parts[i]] : undefined;
      }
      if (typeof val === "string") {
        if (el.tagName === "A" && (key === "akad.maps" || key === "resepsi.maps")) {
          el.setAttribute("href", val);
        } else {
          el.textContent = val;
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
