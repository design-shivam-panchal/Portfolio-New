/* Shivam Panchal portfolio — plain JS (no framework). Menu, showreel, filters, contact. */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Mobile menu (header ke andar khulta hai, page push hota hai)
  var btn = $(".menu-btn"), nav = $("#site-nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("nav--open");
      btn.setAttribute("aria-expanded", open);
      btn.textContent = open ? "Close" : "Menu";
    });
  }

  // Showreel play
  var reel = $(".reel");
  if (reel) {
    var play = $(".reel__play", reel);
    if (play) play.addEventListener("click", function () {
      var v = document.createElement("video");
      v.src = reel.getAttribute("data-src");
      v.poster = reel.getAttribute("data-poster");
      v.controls = true; v.playsInline = true; v.autoplay = true;
      var screen = $(".reel__screen", reel);
      screen.innerHTML = ""; screen.appendChild(v);
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    });
  }

  // Chhote loop clips: muted autoplay
  $$("video[loop]").forEach(function (v) {
    v.muted = true;
    var p = v.play(); if (p && p.catch) p.catch(function () {});
  });

  // Work filters (?category=design)
  var chips = $$("[data-filter]");
  if (chips.length) {
    var cells = $$("[data-cat]"), count = $("[data-count]");
    var apply = function (id, push) {
      if (!chips.some(function (c) { return c.getAttribute("data-filter") === id; })) id = "all";
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c.getAttribute("data-filter") === id); });
      var n = 0;
      cells.forEach(function (el) {
        var show = id === "all" || el.getAttribute("data-cat") === id;
        el.hidden = !show; if (show) n++;
      });
      if (count) count.textContent = n;
      if (push && history.replaceState) {
        try { history.replaceState(null, "", id === "all" ? location.pathname : "?category=" + id); } catch (e) {}
      }
    };
    chips.forEach(function (c) {
      c.addEventListener("click", function () { apply(c.getAttribute("data-filter"), true); });
    });
    var m = /[?&]category=([^&]+)/.exec(location.search);
    apply(m ? decodeURIComponent(m[1]) : "all", false);
  }

  // Contact form → email / WhatsApp
  var form = $("form.form");
  if (form) {
    var EMAIL = "svmpanchal99@gmail.com", WA = "916378853658";
    var text = function () {
      return "Hi Shivam, I'm " + ($("#name").value || "—") + ".\nProject: " + $("#type").value + "\n\n" + $("#message").value;
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Project enquiry — " + $("#type").value) +
        "&body=" + encodeURIComponent(text());
    });
    var wa = $('a[href*="wa.me"]', form);
    if (wa) wa.addEventListener("click", function () { wa.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(text()); });
  }
})();
