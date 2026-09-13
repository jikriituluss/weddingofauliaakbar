// Chrome: tombol musik — mulai setelah interaksi user (aturan autoplay browser).
(function () {
  /* ---------- Musik ---------- */
  function initMusic() {
    var btn = document.getElementById("musicBtn");
    var audio = document.getElementById("weddingAudio");
    if (!btn || !audio) return;
    var START_AT = 46; // lagu dimulai di detik ke-46
    var seekDone = false;
    if (window.WEDDING && window.WEDDING.music) {
      audio.src = window.WEDDING.music;
    }

    function seekToStart() {
      if (seekDone) return;
      try {
        // Hanya seek jika durasi sudah tahu & lebih panjang dari START_AT
        if (audio.duration && !isNaN(audio.duration) && audio.duration > START_AT) {
          audio.currentTime = START_AT;
          seekDone = true;
        }
      } catch (e) { /* abaikan, coba lagi saat play */ }
    }

    audio.addEventListener("loadedmetadata", seekToStart);

    function setState(playing) {
      btn.classList.toggle("is-playing", playing);
      btn.setAttribute("aria-pressed", playing ? "true" : "false");
      btn.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
      btn.querySelector(".music-note").textContent = playing ? "♫" : "♪";
    }

    function play() {
      // Pastikan mulai dari detik 46 (khusus awal; jeda/lanjut tidak di-reset)
      seekToStart();
      if (!seekDone) {
        try { audio.currentTime = START_AT; seekDone = true; } catch (e) {}
      }
      audio.play().then(function () {
        // Fallback: sebagian browser baru menerapkan currentTime setelah play
        if (!seekDone) { seekToStart(); }
        setState(true);
      }).catch(function () {
        setState(false); // diblokir browser: tunggu tap tombol
      });
    }

    // Mulai setelah user membuka undangan (gesture sah untuk autoplay)
    var openBtn = document.getElementById("openBtn");
    if (openBtn) {
      openBtn.addEventListener("click", function () {
        setTimeout(play, 2500);
      }, { once: true });
    }

    btn.addEventListener("click", function () {
      if (audio.paused) play();
      else { audio.pause(); setState(false); }
    });

    audio.addEventListener("ended", function () { setState(false); });
  }

  function init() {
    initMusic();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
