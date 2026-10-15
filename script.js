(function () {
  var root = document.documentElement;
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var views = Array.prototype.slice.call(document.querySelectorAll('.view'));
  var ids = views.map(function (v) { return v.id; });

  function show(id, focusTab) {
    if (ids.indexOf(id) === -1) id = 'accueil';
    views.forEach(function (v) { v.hidden = v.id !== id; });
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-view') === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focusTab) t.focus();
    });
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(t.getAttribute('data-view')); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      if (n !== null) { e.preventDefault(); show(tabs[n].getAttribute('data-view'), true); }
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-go]'), function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); show(el.getAttribute('data-go')); });
  });

  show((location.hash || '').replace('#', '') || 'accueil');

  document.getElementById('theme-toggle').addEventListener('click', function () {
    var current = root.getAttribute('data-theme');
    if (!current) current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  var mail = document.getElementById('mail');
  var note = document.getElementById('copied');
  function selectMail() {
    var r = document.createRange();
    r.selectNodeContents(mail);
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
  }
  document.getElementById('copy-mail').addEventListener('click', function () {
    var text = mail.textContent.trim();
    var done = function () { note.textContent = 'Adresse copiée.'; };
    var fail = function () { selectMail(); note.textContent = 'Adresse sélectionnée, copiez-la avec Ctrl+C.'; };
    try { navigator.clipboard.writeText(text).then(done, fail); } catch (e) { fail(); }
  });
})();
