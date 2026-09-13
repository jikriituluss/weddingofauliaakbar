// Countdown realtime — membaca tanggal dari js/config.js (window.WEDDING.dateISO)
(function () {
  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function init() {
    var target = window.WEDDING && window.WEDDING.dateISO
      ? new Date(window.WEDDING.dateISO).getTime()
      : NaN;
    var daysEl = document.getElementById("cdDays");
    var hoursEl = document.getElementById("cdHours");
    var minsEl = document.getElementById("cdMins");
    var secsEl = document.getElementById("cdSecs");
    var doneEl = document.getElementById("cdDone");
    var gridEl = document.getElementById("cdGrid");
    if (!daysEl || !hoursEl || !minsEl || !secsEl || isNaN(target)) return;

    // Hormati reduced motion: update tanpa animasi tambahan (angka tetap jalan)
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minsEl.textContent = "00";
        secsEl.textContent = "00";
        if (gridEl) gridEl.setAttribute("aria-hidden", "true");
        if (doneEl) doneEl.hidden = false;
        clearInterval(timer);
        return;
      }
      var d = Math.floor(diff / 864e5);
      var h = Math.floor((diff % 864e5) / 36e5);
      var m = Math.floor((diff % 36e5) / 6e4);
      var s = Math.floor((diff % 6e4) / 1e3);
      daysEl.textContent = pad(d);
      hoursEl.textContent = pad(h);
      minsEl.textContent = pad(m);
      secsEl.textContent = pad(s);
    }

    tick();
    var timer = setInterval(tick, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
