// static/account_admin/il_ilce.js
document.addEventListener("DOMContentLoaded", function () {
  var il = document.getElementById("id_il");
  var ilce = document.getElementById("id_ilce");
  if (!il || !ilce) return;

  function clearAndFill(options) {
    while (ilce.options.length) ilce.remove(0);
    ilce.add(new Option("---------", ""));
    (options || []).forEach(function (name) {
      ilce.add(new Option(name, name));
    });
  }

  // /admin/account/user/add/ veya /admin/account/user/123/change/ ikisinde de
  // tabanı /admin/account/user/ olacak şekilde çıkar.
  var base = window.location.pathname.replace(/(add|change\/[^\/]+)\/?$/, "");
  var url = base + "il-ilce.json";

  fetch(url, { credentials: "same-origin" })
    .then(function (r) { return r.json(); })
    .then(function (map) {
      // İlk yüklemede doldur
      clearAndFill(map[il.value] || []);
      // İl değişince doldur
      il.addEventListener("change", function () {
        clearAndFill(map[il.value] || []);
      });
    })
    .catch(function (err) {
      console.warn("il-ilce.json yüklenemedi:", err);
    });
});
