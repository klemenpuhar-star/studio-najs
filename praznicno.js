/* NAJS – praznični okraski predlog 5 »Kombinacija 1 + 3« (25. 11. 2026): veje s storži v kotih (predlog 1) + rdeče krogle, smreka, zamet, bordo trak (predlog 3); v4 – veja s storži: fotografija Pexels (licenca Pexels, brez navajanja), izrezana
   En dodatek za najs.si in najsshop.si:  <script src="praznicno.js" defer data-praznicno data-...></script>
   Vse je okras (aria-hidden, brez klikov), ne premika vsebine, sam se izklopi po datumu.
   data-od / data-do     obdobje (LLLL-MM-DD), privzeto 1. 12. – 6. 1.
   data-lucke            element, pod katerim visi niz drobnih toplo belih lučk
   data-kapa             slika logotipa, ki dobi žametno božičkovo kapo (več z vejico)
   data-pot              pot do slik pz-*.webp (npr. »/«)
   data-veje             element, v čigar zgornja kota pridejo prave smrekove veje
   data-veje-krogle      0 = brez krogel pod vejami; data-veje-stran »desno« = samo desna veja; data-veje-sirina px
   data-smreka-samo-ozko smreka samo na telefonu/tablici (do 980 px)
   data-smreka / data-zamet / data-trak (+ data-trak-povezava, data-trak-besedilo, data-trak-kje) iz predloga 3
   data-bunkice          element, s čigar vrha visijo tri bunkice na zlatih nitkah (samo računalnik)
   data-visece           element, kjer desno zgoraj visijo okraski na trakovih (samo računalnik)
   data-sneg             element, v katerem rahlo sneži (mehke snežinke); data-sneg-barva = »R,G,B«
   data-voscilo          element, za katerim je voščilo; data-voscilo-besedilo
   data-vrh              odmik vej in bunkic od vrha elementa (npr. višina pritrjene glave)
   data-odmik            elementom doda prostor zgoraj (da lučke ne prekrijejo naslova)
   ?praznicno=1 v naslovu strani pokaže okraske tudi izven obdobja (predogled). */
(function () {
  'use strict';
  var s = document.currentScript || document.querySelector('script[data-praznicno]');
  if (!s) return;
  var d = function (k, v) { var x = s.getAttribute('data-' + k); return x == null ? v : x; };
  var danes = new Date(), leto = danes.getFullYear();
  var od = new Date(d('od', (danes.getMonth() === 0 ? leto - 1 : leto) + '-12-01') + 'T00:00:00'); /* januarja velja lanski 1. 12. */
  var doo = new Date(d('do', (danes.getMonth() === 0 ? leto : leto + 1) + '-01-06') + 'T23:59:59');
  if (!/[?&]praznicno=1/.test(location.search) && (danes < od || danes > doo)) return;
  var mirno = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vsi = function (sel) { return sel ? [].slice.call(document.querySelectorAll(sel)) : []; };
  var poz = function (e) { if (getComputedStyle(e).position === 'static') e.style.position = 'relative'; };
  var id = 0, uid = function (p) { return 'pz' + p + (++id); };
  function rnd(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

  var css = ''
    + '.pz-lucke{position:absolute;left:0;right:0;top:100%;height:34px;pointer-events:none;z-index:5}'
    + '.pz-lucke svg{display:block;width:100%;height:34px;overflow:visible}'
    + '@keyframes pz-mig{0%,100%{opacity:1}50%{opacity:.45}}'
    + '.pz-mig .pz-led{animation:pz-mig 3.2s ease-in-out infinite}'
    + '.pz-kapa{position:absolute;pointer-events:none;z-index:6;transform:rotate(16deg);transform-origin:25% 85%}'
    + '.pz-veja{position:absolute;top:0;pointer-events:none;z-index:2;height:auto}.pz-visece{position:absolute;pointer-events:none;z-index:2;height:auto;filter:drop-shadow(0 6px 8px rgba(0,0,0,.15))}'
    + '.pz-bunkica{position:absolute;top:0;pointer-events:none;z-index:2;transform-origin:50% 0}'
    + '@keyframes pz-nihaj{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}'
    + '.pz-niha{animation:pz-nihaj 6s ease-in-out infinite}'
    + '.pz-sneg{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:1}'
    + '.pz-voscilo{display:flex;align-items:center;gap:.9em;width:fit-content;margin:.3rem 0 1.4rem;'
    + 'font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-weight:600;font-size:1.55rem;letter-spacing:.03em;color:#8d1f2c;text-shadow:0 0 12px rgba(255,250,240,.9),0 0 3px rgba(255,250,240,.9)}'
    + '.pz-voscilo::before,.pz-voscilo::after{content:"";width:38px;height:1px;background:linear-gradient(90deg,transparent,#c9a56a,transparent)}'
    + '.pz3-girlanda{position:absolute;left:0;right:0;height:0;pointer-events:none;z-index:4}'
    + '.pz3-girlanda img{filter:drop-shadow(0 6px 6px rgba(0,0,0,.18))}'
    + '.pz3-krogla{position:absolute;transform-origin:50% 0;filter:drop-shadow(0 10px 10px rgba(0,0,0,.25))}'
    + '.pz3-drevo{position:absolute;height:auto;pointer-events:none;z-index:3;filter:drop-shadow(0 10px 14px rgba(0,0,0,.25))}'
    + '.pz3-zamet{position:absolute;left:0;right:0;bottom:-1px;height:46px;pointer-events:none;z-index:2}.pz3-zamet svg{width:100%;height:100%;display:block}'
    + '.pz3-trak{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:.4rem 1.2rem;padding:.75rem 16px;text-align:center;'
    + 'background:linear-gradient(180deg,#8d1f2c,#6b1220);color:#f3dfa6;font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-weight:600;font-size:1.15rem;letter-spacing:.03em;box-shadow:inset 0 1px 0 rgba(243,223,166,.35),inset 0 -1px 0 rgba(243,223,166,.35)}'
    + '.pz3-trak a{font-family:Poppins,sans-serif;font-style:normal;font-size:.78rem;font-weight:500;letter-spacing:.06em;color:#6b1220;background:#f3dfa6;border-radius:999px;padding:.45em 1.1em;text-decoration:none}'
    + '.pz3-trak a:hover{background:#fff3cf}'
    + '@media(max-width:980px){.pz-samo-siroko{display:none}}@media(min-width:981px){.pz-samo-ozko{display:none}}';
  var st = document.createElement('style'); st.id = 'praznicno-css'; st.textContent = css; document.head.appendChild(st);
  var dodaj = function (host, html, cls, style) {
    var w = document.createElement('div'); w.innerHTML = html.trim();
    var e = w.firstChild; e.setAttribute('aria-hidden', 'true'); e.setAttribute('focusable', 'false');
    if (cls) e.setAttribute('class', cls); if (style) e.setAttribute('style', style);
    host.appendChild(e); return e;
  };

  /* odmik */
  vsi(d('odmik')).forEach(function (e) { e.style.paddingTop = (parseFloat(getComputedStyle(e).paddingTop) + (+d('odmik-px', 24))) + 'px'; });

  /* ── 1) drobne lučke na bakreni žici ── */
  function lucke(w) {
    var g = uid('g'), r = rnd(7), korak = 26, h = '', zica = 'M0,4';
    var n = Math.ceil(w / 260), raz = w / n;
    for (var i = 0; i < n; i++) zica += ' Q' + (i * raz + raz / 2) + ',' + (16 + r() * 6).toFixed(1) + ' ' + ((i + 1) * raz) + ',4';
    h += '<defs><radialGradient id="' + g + '"><stop offset="0" stop-color="#fff6dc" stop-opacity=".95"/><stop offset=".25" stop-color="#ffd98a" stop-opacity=".55"/>'
      + '<stop offset="1" stop-color="#ffc35c" stop-opacity="0"/></radialGradient></defs>';
    h += '<path d="' + zica + '" fill="none" stroke="#9a7444" stroke-width="1" opacity=".9"/>';
    for (var x = korak / 2; x < w; x += korak) {
      var j = Math.min(n - 1, Math.floor(x / raz)), u = (x - j * raz) / raz;
      var y = 4 + 2 * u * (1 - u) * 14 + 1;
      var zam = (-(r() * 3.2)).toFixed(2), v = 7 + r() * 5;
      h += '<g class="pz-led" style="animation-delay:' + zam + 's"><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + v.toFixed(1) + '" fill="url(#' + g + ')"/>'
        + '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.6" fill="#fffaf0"/></g>';
    }
    return '<svg viewBox="0 0 ' + w + ' 34" preserveAspectRatio="none">' + h + '</svg>';
  }
  vsi(d('lucke')).forEach(function (host) {
    poz(host);
    var box = document.createElement('div'); box.className = 'pz-lucke' + (mirno ? '' : ' pz-mig'); box.setAttribute('aria-hidden', 'true');
    host.appendChild(box);
    var risi = function () { box.innerHTML = lucke(Math.max(320, host.clientWidth)); };
    risi(); var tm; addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(risi, 200); });
  });

  /* ── 2) žametna božičkova kapa ── */
  function kapa() {
    var a = uid('a'), b = uid('b'), f = uid('f'), sh = uid('s'), k = uid('k');
    return '<svg viewBox="0 0 150 120"><defs>'
      + '<linearGradient id="' + a + '" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#6e0f16"/><stop offset=".45" stop-color="#a51d24"/><stop offset=".7" stop-color="#c22a2e"/><stop offset="1" stop-color="#7d1419"/></linearGradient>'
      + '<radialGradient id="' + b + '" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#f3eee6"/><stop offset="1" stop-color="#d9d0c3"/></radialGradient>'
      + '<filter id="' + f + '" x="-20%" y="-30%" width="140%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter>'
      + '<filter id="' + sh + '" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>'
      + '<linearGradient id="' + k + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient>'
      + '</defs>'
      + '<ellipse cx="62" cy="104" rx="50" ry="6" fill="#000" opacity=".18" filter="url(#' + sh + ')"/>'
      + '<path d="M18,92 C26,52 58,16 100,14 C120,13 133,24 131,42 C124,34 112,33 104,42 C92,56 88,76 90,92 Z" fill="url(#' + a + ')"/>'
      + '<path d="M60,40 C76,26 96,22 116,26" fill="none" stroke="#e0484a" stroke-width="7" stroke-linecap="round" opacity=".35"/>'
      + '<path d="M96,44 C92,58 89,74 90,92 L72,92 C74,74 82,58 96,44 Z" fill="#000" opacity=".18"/>'
      + '<rect x="8" y="84" width="92" height="22" rx="11" fill="url(#' + b + ')" filter="url(#' + f + ')"/>'
      + '<rect x="8" y="84" width="92" height="22" rx="11" fill="url(#' + k + ')" opacity=".6"/>'
      + '<circle cx="130" cy="46" r="12" fill="url(#' + b + ')" filter="url(#' + f + ')"/>'
      + '</svg>';
  }
  vsi(d('kapa')).forEach(function (img) {
    var p = img.parentElement; poz(p);
    var e = dodaj(p, kapa(), 'pz-kapa');
    var postavi = function () {
      var w = img.offsetWidth; if (!w) return;
      var kw = Math.round(w * 0.3);
      e.setAttribute('width', kw); e.setAttribute('height', Math.round(kw * 0.8));
      e.style.left = (img.offsetLeft + w * 0.8 - kw * 0.5) + 'px';
      e.style.top = (img.offsetTop + img.offsetHeight * 0.17 - kw * 0.66) + 'px';
    };
    postavi(); img.addEventListener('load', postavi); addEventListener('resize', postavi); addEventListener('load', postavi);
  });

  /* ── 3) girlanda čez ves vrh: borove veje s storži + rdeče steklene krogle ── */
  var POT = d('pot', '');
  vsi(d('girlanda')).forEach(function (host) {
    poz(host);
    var box = document.createElement('div'); box.className = 'pz3-girlanda'; box.setAttribute('aria-hidden', 'true');
    box.style.top = d('vrh', '0px'); box.style.height = '460px'; box.style.overflow = 'hidden'; host.appendChild(box);
    var risi = function () {
      box.innerHTML = '';
      var W = host.clientWidth, mob = W < 700, kos = +d('girlanda-kos', 0) || (mob ? 150 : 235), n = Math.ceil(W / (kos * .62)) + 1;
      var sredina = d('girlanda-sredina', '') === 'prosta' && !mob;
      for (var i = 0; i < n; i++) {
        var cx = i * kos * .62 - kos * .25 + kos / 2;
        if (sredina && cx > W * .37 && cx < W * .63) continue;
        var im = new Image(); im.src = POT + 'pz-veja-storzi.webp'; im.alt = ''; im.decoding = 'async';
        im.style.cssText = 'position:absolute;top:' + (-kos * .1 + (i % 2 ? 4 : -4)) + 'px;left:' + Math.round(i * kos * .62 - kos * .25) + 'px;width:' + kos + 'px;height:auto;'
          + (i % 2 ? 'transform:scaleX(-1)' : '');
        box.appendChild(im);
      }
      if (d('krogle', '1') !== '0') {
        var mesta = mob ? [.07, .93] : [.05, .15, .26, .74, .85, .95], dolz = mob ? [30, 40] : [30, 85, 45, 55, 95, 25];
        mesta.forEach(function (m, j) {
          var k = document.createElement('div'); k.className = 'pz3-krogla' + (mirno ? '' : ' pz-niha');
          var sir = (mob ? 34 : 52) * (j % 3 === 1 ? 1.2 : 1);
          k.style.cssText = 'left:' + (m * 100) + '%;top:' + dolz[j] + 'px;width:' + sir + 'px;margin-left:-' + sir / 2 + 'px;animation-delay:-' + (j * 1.3) + 's';
          k.innerHTML = '<img src="' + POT + 'pz-krogla.webp" alt="" decoding="async" style="width:100%;height:auto;display:block">';
          box.appendChild(k);
        });
      }
    };
    risi(); var tm; addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(risi, 200); });
  });


  /* ── 3b) smrekove veje s storži v zgornjih kotih (predlog 1) + rdeče krogle, ki visijo z vej (predlog 3) ── */
  var vejeStran = d('veje-stran', 'obe');
  vsi(d('veje')).forEach(function (host) {
    poz(host);
    var box = document.createElement('div'); box.setAttribute('aria-hidden', 'true');
    box.style.cssText = 'position:absolute;left:0;right:0;top:' + d('vrh', '0px') + ';height:0;pointer-events:none;z-index:4';
    host.appendChild(box);
    var risi = function () {
      box.innerHTML = '';
      var W = host.clientWidth, mob = W < 700;
      var sir = +d('veje-sirina', 0) || (mob ? 150 : (W < 1100 ? 270 : 340)), vis = sir * 380 / 659;
      if (vejeStran === 'desno' && W < 980) return; /* samo desna veja (trgovina): na ozkem zaslonu bi prekrila naslov */
      var strani = vejeStran === 'desno' ? ['right'] : ['left', 'right'];
      var kr = d('veje-krogle', '1') !== '0' ? (mob ? [[.5, .42, 30]] : (vejeStran === 'desno' ? [[.3, .28, 38], [.72, .36, 44]] : [[.24, .34, 46], [.58, .5, 58], [.86, .22, 40]])) : [];
      strani.forEach(function (st, si) {
        kr.forEach(function (k, j) {
          var e = document.createElement('div'); e.className = 'pz3-krogla' + (mirno ? '' : ' pz-niha');
          var w = mob ? k[2] * .75 : k[2];
          e.style.cssText = st + ':' + Math.round(sir * k[0] - w / 2) + 'px;top:' + Math.round(vis * k[1]) + 'px;width:' + w + 'px;z-index:1;animation-delay:-' + (j * 1.4 + si * .7) + 's';
          e.innerHTML = '<img src="' + POT + 'pz-krogla.webp" alt="" decoding="async" style="width:100%;height:auto;display:block">';
          box.appendChild(e);
        });
        var im = new Image(); im.src = POT + 'pz-veja-storzi.webp'; im.alt = ''; im.decoding = 'async';
        im.style.cssText = 'position:absolute;top:0;' + st + ':0;width:' + sir + 'px;height:auto;z-index:2;filter:drop-shadow(0 6px 6px rgba(0,0,0,.16))' + (st === 'right' ? ';transform:scaleX(-1)' : '');
        box.appendChild(im);
      });
    };
    risi(); var tm; addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(risi, 200); });
  });

  /* ── 4) okrašena smreka v spodnjem kotu (fotografija, Pixabay) ── */
  vsi(d('smreka')).forEach(function (host) {
    poz(host);
    var mob = host.clientWidth < 700;
    var im = new Image(); im.src = POT + 'pz-drevo.webp'; im.alt = ''; im.decoding = 'async'; im.setAttribute('aria-hidden', 'true');
    im.className = 'pz3-drevo' + (d('smreka-samo-siroko', '') ? ' pz-samo-siroko' : '') + (d('smreka-samo-ozko', '') ? ' pz-samo-ozko' : '');
    im.style.cssText = 'right:' + (mob ? '2%' : '4%') + ';bottom:' + (mob ? '6px' : '14px') + ';width:' + (mob ? 120 : 230) + 'px';
    host.appendChild(im);
  });

  /* ── 4b) snežni zamet na dnu ── */
  vsi(d('zamet')).forEach(function (host) {
    poz(host);
    var e = document.createElement('div'); e.className = 'pz3-zamet'; e.setAttribute('aria-hidden', 'true');
    e.innerHTML = '<svg viewBox="0 0 1200 60" preserveAspectRatio="none"><defs><linearGradient id="pz3z" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#eef2f5"/></linearGradient></defs>'
      + '<path d="M0,38 C80,22 150,30 230,24 C330,16 390,34 480,28 C580,20 640,10 740,22 C840,34 900,18 1000,20 C1080,22 1140,30 1200,26 L1200,60 L0,60 Z" fill="url(#pz3z)"/>'
      + '<path d="M0,38 C80,22 150,30 230,24 C330,16 390,34 480,28 C580,20 640,10 740,22 C840,34 900,18 1000,20 C1080,22 1140,30 1200,26" fill="none" stroke="#dfe7ec" stroke-width="2"/></svg>';
    host.appendChild(e);
  });

  /* ── 4c) praznični trak (bordo) za elementom ── */
  vsi(d('trak')).forEach(function (h) {
    var t = document.createElement('div'); t.className = 'pz3-trak';
    t.innerHTML = '<span>✦ ' + d('trak-besedilo', 'Vesele božične praznike in srečno novo leto 2027').replace(/[<&]/g, '') + ' ✦</span>'
      + (d('trak-povezava', '') ? ' <a href="' + d('trak-povezava') + '">' + d('trak-gumb', 'Prosti termini v decembru →').replace(/[<&]/g, '') + '</a>' : '');
    h.insertAdjacentElement(d('trak-kje', 'afterend'), t);
  });

  /* ── 5) mehko sneženje ── */
  vsi(mirno ? '' : d('sneg')).forEach(function (host) {
    poz(host);
    var c = document.createElement('canvas'); c.className = 'pz-sneg'; c.setAttribute('aria-hidden', 'true'); host.appendChild(c);
    var x = c.getContext('2d'), barva = d('sneg-barva', '255,255,255'), f = [], W, H, dpr = Math.min(2, devicePixelRatio || 1);
    function vel() { W = host.clientWidth; H = host.clientHeight; c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); }
    vel(); addEventListener('resize', vel);
    var n = W < 700 ? 30 : 60;
    for (var i = 0; i < n; i++) f.push({ x: Math.random() * W, y: Math.random() * H, r: 1.2 + Math.random() * 3.2, v: .2 + Math.random() * .45, a: Math.random() * 6, o: .35 + Math.random() * .5 });
    var vidno = true;
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { vidno = e[0].isIntersecting; }).observe(host);
    (function korak() {
      if (vidno && !document.hidden) {
        x.clearRect(0, 0, W, H);
        f.forEach(function (p) {
          p.y += p.v; p.a += .008; p.x += Math.sin(p.a) * .25;
          if (p.y > H + 6) { p.y = -6; p.x = Math.random() * W; }
          var g = x.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
          g.addColorStop(0, 'rgba(' + barva + ',' + p.o + ')'); g.addColorStop(.45, 'rgba(' + barva + ',' + (p.o * .6) + ')'); g.addColorStop(1, 'rgba(' + barva + ',0)');
          x.fillStyle = g; x.beginPath(); x.arc(p.x, p.y, p.r * 2, 0, 6.283); x.fill();
        });
      }
      requestAnimationFrame(korak);
    })();
  });

  /* ── 6) voščilo ── */
  vsi(d('voscilo')).forEach(function (h) {
    var v = document.createElement('p'); v.className = 'pz-voscilo';
    v.textContent = d('voscilo-besedilo', 'Vesele praznike');
    if (getComputedStyle(h).textAlign === 'center') { v.style.marginLeft = 'auto'; v.style.marginRight = 'auto'; }
    h.insertAdjacentElement('afterend', v);
  });
})();
