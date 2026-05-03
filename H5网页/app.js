(function () {

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function bindFallback(img) {
    if (!img) return;
    img.addEventListener("error", function onErr() {
      img.removeEventListener("error", onErr);
      img.style.opacity = "0";
      var box = img.parentElement;
      if (box) {
        box.style.background = "linear-gradient(135deg,#2d4a35,#1a2f22)";
        box.setAttribute("aria-label", "图片暂不可用");
      }
    });
  }

  function initReveal() {
    var items = qsa(".reveal");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("show"); });
      return;
    }
    var ob = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    }, { threshold: 0.16 });
    items.forEach(function (el) { ob.observe(el); });
  }

  function setActiveNav() {
    var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    qsa(".chip[data-page]").forEach(function (a) {
      if (a.getAttribute("data-page") === file) a.classList.add("active");
    });
  }

  function fillHero() {
    var img = qs("[data-role='hero']");
    if (!img || !window.H5Data) return;
    img.src = window.H5Data.images.hero;
    bindFallback(img);
  }

  function toast(msg) {
    var el = qs("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.remove("hide");
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { el.classList.add("hide"); }, 2200);
  }

  function initCommon() {
    setActiveNav();
    fillHero();
    initReveal();
    qsa("img").forEach(bindFallback);
    var share = qs("[data-action='share']");
    if (share) {
      share.addEventListener("click", function () {
        var url = location.href;
        if (navigator.share) {
          navigator.share({ title: document.title, text: "植物基食品互动H5", url: url }).catch(function () {});
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () { toast("链接已复制"); }, function () { toast(url); });
        } else {
          toast(url);
        }
      });
    }
  }

  window.H5Common = { qs: qs, qsa: qsa, toast: toast, initCommon: initCommon };
})();
