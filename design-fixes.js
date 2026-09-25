/* ============================================================================
   design-fixes.js – designová kola (detaily, ne redesign)
   Proč JS: Framer po hydrataci DOM přepisuje podle svého React stromu, takže
   zásahy do struktury (odkazy, fotky, skryté karty) musí být idempotentní a
   znovu se aplikovat. Pevné vizuální věci (skrývány, křížek, bublina) jsou v
   design-fixes.css – ty hydrataci přežijí samy.
   ========================================================================== */
(function () {
  "use strict";

  var CONTACT = "https://www.facebook.com/profile.php?id=61551880232372&locale=cs_CZ";

  /* reálné projekty – data z jakub.github.io, fotky z jejich webů */
  var PROJECTS = [
    {
      name: "Pohádkové Kousky",
      href: "https://pohadkovekousky.cz/",
      img: "./pohadkovekousky.jpg",
      tags: ["Web na míru", "Ruční tvorba", "Živě"]
    },
    {
      name: "Nerez-Speciál",
      href: "https://www.nerezspecial.cz/",
      img: "./nerezspecial.jpg",
      tags: ["Firemní web", "Zakázková výroba", "Živě"]
    },
    {
      name: "Natural Massage",
      href: "https://johny-coding.github.io/message/",
      img: "./naturalmassage.jpg",
      tags: ["Prezentační web", "Wellness & služby", "Živě"]
    }
  ];
  var FAKE = ["Web pro instruktora", "Redesign webu"];
  var TAG_SLOT = /^(custom website|business website|presentation website|handmade goods|custom manufacturing|wellness & services|wellness \/ services|live|development|design & code|from design to launch|website redesign|web design|vývoj webu|web na míru|firemní web|prezentační web|ruční tvorba|wellness \/ služby|wellness & služby|zakázková výroba|redesign|illustration|brand identity|figma|framer builds|photoshop|202[4-7]|3d design|ui\/ux design|od návrhu po spuštění|landing page)$/i;

  var norm = function (s) { return (s || "").replace(/\u00a0/g, " ").trim().toLocaleUpperCase("cs").replace(/\s+/g, " "); };
  var cn = function (e) { return typeof e.className === "string" ? e.className : (e.getAttribute("class") || ""); };
  var leaves = function (root) {
    return [].slice.call((root || document).querySelectorAll("p,span,h1,h2,h3,h4,h5,h6,div"))
      .filter(function (e) { return !e.children.length && (e.textContent || "").trim(); });
  };

  /* karta = nejširší předek, ve kterém je pořád jen tahle karta
     (max 2 obrázky = bílý rám + fotka, jeden název projektu) */
  function namesIn(el) {
    var t = norm(el.textContent);
    return PROJECTS.filter(function (p) { return t.indexOf(norm(p.name)) !== -1; }).length;
  }
  function cardOf(node, maxW) {
    var card = node, limit = maxW || 780;
    for (var i = 0; i < 9; i++) {
      var up = card.parentElement;
      if (!up) break;
      if (up.querySelectorAll("img").length > 2) break;
      if (namesIn(up) > Math.max(1, namesIn(card))) break;
      var r = up.getBoundingClientRect();
      if (r.width > limit || r.width < 60) break;
      card = up;
    }
    return card;
  }

  function setImg(im, src) {
    if (im.getAttribute("data-jb-img") === src) return;
    im.setAttribute("data-jb-img", src);
    im.removeAttribute("srcset");
    im.removeAttribute("sizes");
    im.src = src;
    im.loading = "eager";
    im.decoding = "async";
    var pic = im.parentElement;
    if (pic && pic.tagName === "PICTURE") {
      [].slice.call(pic.querySelectorAll("source")).forEach(function (s) {
        s.setAttribute("srcset", src);
      });
    }
  }


  /* ---- hero: 3 náhledy projektů – každá karta svůj obrázek ----------- */
  var HERO_IMG = { "Card 1": "./naturalmassage.jpg", "Card 2": "./nerezspecial.jpg", "Card 3": "./pohadkovekousky.jpg" };
  function heroCards() {
    Object.keys(HERO_IMG).forEach(function (n) {
      [].slice.call(document.querySelectorAll('[data-framer-name="' + n + '"]')).forEach(function (c) {
        var im = c.querySelector('[data-framer-name="Thumbnail"] img') || c.querySelector("img");
        if (im) setImg(im, HERO_IMG[n]);
      });
    });
  }

  /* ---- karta projektu = odkaz na živý web (nové okno) -------------------
     Šablona karty jako odkaz nezná, proto se přes celou kartu položí
     průhledné <a>. target=_blank = nové okno, rel="noopener noreferrer"
     = bezpečnost (nová stránka nedostane přístup k té naší).         */
  function linkCard(card, pr) {
    /* overlay <a> se polohuje ke kartě – karta proto musí mít nějakou polohu.
       Šablona ji většinou má (absolute/relative), nikdy ji ale nepřebíjíme:
       doplní se jen static, který by jinak odkaz „vytlačil“ mimo kartu. */
    if (getComputedStyle(card).position === "static") {
      card.style.setProperty("position", "relative", "important");
    }
    var a = card.querySelector(":scope > a.jb-link");
    if (!a) {
      a = document.createElement("a");
      a.className = "jb-link";
      card.insertBefore(a, card.firstChild);
    }
    if (a.getAttribute("data-jb-href") !== pr.href) {
      a.setAttribute("data-jb-href", pr.href);
      a.setAttribute("href", pr.href);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    }
    /* popisek umí oba jazyky – přepínač CZ/EN (i18n.js) přepisuje atributy,
       tady se proto při každém běhu znovu dosadí správná varianta */
    var en = document.documentElement.getAttribute("data-lang") === "en";
    var label = en ? "Open the " + pr.name + " project in a new window"
                   : "Otevřít projekt " + pr.name + " v novém okně";
    if (a.getAttribute("aria-label") !== label) {
      a.setAttribute("aria-label", label);
      a.setAttribute("title", label);
    }
    if (card.className.indexOf("jb-card") === -1) card.classList.add("jb-card");
    if (card.style.cursor) card.style.removeProperty("cursor");
  }

  function applyProjects() {
    PROJECTS.forEach(function (pr) {
      var key = norm(pr.name), seen = [];
      leaves(document).forEach(function (e) {
        if (norm(e.textContent) !== key) return;
        var card = cardOf(e);
        if (!card || seen.indexOf(card) !== -1) return;
        seen.push(card);

        /* 1) fotka přímo z toho webu (bílé pozadí karty šablony ponecháme) */
        [].slice.call(card.querySelectorAll("img")).forEach(function (im) {
          var r = im.getBoundingClientRect();
          var shared = im.src.indexOf("OJ32bkpXkfMSCXEAtsY") !== -1; /* bílý rám karty ponecháme */
          if (r.width > 140 && !shared) setImg(im, pr.img);
        });

        /* 2) detaily karty = reálné údaje, ne výplň šablony */
        var slots = [].slice.call(card.querySelectorAll("p,span,h1,h2,h3,h4,h5,h6"))
          .filter(function (p) {
            return !p.children.length && TAG_SLOT.test((p.textContent || "").trim());
          });
        var EN_TAG = { "Web na míru": "Custom website", "Ruční tvorba": "Handmade goods", "Živě": "Live", "Firemní web": "Business website", "Zakázková výroba": "Custom manufacturing", "Prezentační web": "Presentation website", "Wellness & služby": "Wellness & services" };
        var en = document.documentElement.getAttribute("data-lang") === "en";
        for (var i = 0; i < slots.length && i < pr.tags.length; i++) {
          var tg = en ? (EN_TAG[pr.tags[i]] || pr.tags[i]) : pr.tags[i];
          if (slots[i].getAttribute("data-jb-tag") === tg && slots[i].textContent === tg) continue;
          slots[i].setAttribute("data-jb-tag", tg);
          slots[i].textContent = tg;
        }

        /* 3) karta = odkaz na živý web, otevře se do NOVÉHO okna
              (aktuální stránka zůstane otevřená). Overlay <a> se při každém
              běhu znovu přilepí – pro případ, že by ji React zahodil. */
        linkCard(card, pr);
      });
    });
  }

  /* vymyšlený karty: pryč – nejdřív karta, pak prázdný řádek (ať nevznikne díra) */
  function pruneProjects() {
    var real = PROJECTS.map(function (p) { return norm(p.name); });
    [].slice.call(document.querySelectorAll('[data-framer-name="project-row"]')).forEach(function (row) {
      var vis = 0;
      [].slice.call(row.children).forEach(function (card) {
        var t = norm(card.textContent);
        var keep = real.some(function (k) { return t.indexOf(k) !== -1; });
        var isHidden = card.style.getPropertyValue("display") === "none";
        if (keep) { if (isHidden) card.style.removeProperty("display"); vis++; }
        else if (!isHidden) card.style.setProperty("display", "none", "important");
      });
      var rowHidden = row.style.getPropertyValue("display") === "none";
      if (vis === 0 && !rowHidden) row.style.setProperty("display", "none", "important");
      else if (vis > 0 && rowHidden) row.style.removeProperty("display");
    });
    FAKE.forEach(function (name) {
      leaves(document).forEach(function (e) {
        if (norm(e.textContent) !== norm(name)) return;
        var card = cardOf(e, 900);
        if (card) card.style.setProperty("display", "none", "important");
      });
    });
  }

  /* ---- nálepky: ať nesedí přes nadpis --------------------------------- */
  var lastKey = "";
  function setVar(k, v) {
    var root = document.documentElement;
    if (root.style.getPropertyValue(k) !== v) root.style.setProperty(k, v);
  }
  function ink(el, skip) {
    var rects = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    for (var n = w.nextNode(); n; n = w.nextNode()) {
      if (!n.nodeValue || !n.nodeValue.trim()) continue;
      if (skip && n.parentElement && n.parentElement.closest(skip)) continue;
      var rg = document.createRange();
      rg.selectNodeContents(n);
      [].slice.call(rg.getClientRects()).forEach(function (b) { if (b.width > 1 && b.height > 1) rects.push(b); });
    }
    return rects;
  }
  function hit(a, b, pad) {
    pad = pad || 0;
    return !(a.right + pad <= b.left || a.left - pad >= b.right || a.bottom + pad <= b.top || a.top - pad >= b.bottom);
  }
  function nudges() {
    var head = document.querySelector('[data-framer-name="main-heading"]');
    if (!head) { lastKey = ""; return; }
    var chips = [].slice.call(document.querySelectorAll('[data-framer-name^="chip"]'))
      .map(function (c) { return c.closest('[class$="-container"]') || c; })
      .filter(function (c, i, all) { return all.indexOf(c) === i; })
      .filter(function (c) {
        var r = c.getBoundingClientRect();
        return r.width > 8 && r.height > 8 && r.top < innerHeight && r.bottom > 0;
      });
    var hr = head.getBoundingClientRect();
    if (!chips.length || hr.top < -4 || hr.bottom > innerHeight + 4) { lastKey = ""; return; }
    var sc = document.scrollingElement;
    [].forEach.call(document.querySelectorAll("body *"), function (n) {
      if (n.scrollHeight - n.clientHeight > 400 && n.clientHeight > 200 && (!sc || n.scrollHeight > sc.scrollHeight)) sc = n;
    });
    var viewH = sc ? sc.clientHeight : innerHeight;
    var key = innerWidth + "|" + Math.round(hr.y) + "|" + Math.round(hr.height) + "|" + chips.length;
    if (key === lastKey) return;
    lastKey = key;

    var slotOf = function (el) { return /chip-([0-9])/.exec(el.getAttribute("data-framer-name") || ""); };
    var setSlot = function (m, dx, dy) {
      setVar("--jb-c" + m[1] + "-x", dx ? dx + "px" : "0px");
      setVar("--jb-c" + m[1] + "-y", dy ? dy + "px" : "0px");
    };

    chips.forEach(function (c) { var m = slotOf(c); if (m) setSlot(m, 0, 0); });
    head.getBoundingClientRect(); /* force layout, ať měříme pozici šablony */

    var blockers = [].slice.call(ink(head, '[data-framer-name^="chip"]'));
    ['.framer-oto1q', '.framer-mf8wpk', '[data-framer-name="Navbar"]', 'a[class*="framer-"]',
     /* pilulka v hero je o něco širší kvůli kroužku s očima – nálepky se musí vyhnout i jí */
     '.framer-1wnpgu1-container'].forEach(function (sel) {
      [].slice.call(document.querySelectorAll(sel)).forEach(function (e) {
        var r = e.getBoundingClientRect();
        if (r.bottom < 0 || r.top > viewH || r.width < 2) return;
        if (e.tagName === "A") [].slice.call(ink(e)).forEach(function (b) { blockers.push(b); });
        else blockers.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
      });
    });

    function search(b0, minStep) {
      var found = null;
      for (var step = 24; step >= minStep; step -= 8) {
        for (var dy = -336; dy <= 336; dy += step) {
          for (var dx = -456; dx <= 456; dx += step) {
            var moved = { left: b0.left + dx, right: b0.right + dx, top: b0.top + dy, bottom: b0.bottom + dy };
            if (moved.left < 8 || moved.right > innerWidth - 8 || moved.top < 62 || moved.bottom > viewH - 24) continue;
            var bad = false;
            for (var i = 0; i < blockers.length; i++) { if (hit(moved, blockers[i], 10)) { bad = true; break; } }
            if (bad) continue;
            var cost = Math.abs(dx) + Math.abs(dy) * 1.35 + (dx === 0 && dy === 0 ? -1e6 : 0);
            if (!found || cost < found.cost) found = { dx: dx, dy: dy, cost: cost };
          }
        }
        if (found) break; /* hrubý průchad stačí, jen quando nic nenajde, jde se jemněji */
      }
      return found;
    }

    chips.forEach(function (c) {
      var m = slotOf(c), r0 = c.getBoundingClientRect();
      var b0 = { left: r0.left, right: r0.right, top: r0.top, bottom: r0.bottom };
      var best = search(b0, 16);
      if (LOG.length < 24) LOG.push((c.getAttribute("data-framer-name") || "?") + " blockers=" + blockers.length + " -> " + (best ? best.dx + "," + best.dy : "nic"));
      if (m) setSlot(m, best ? best.dx : 0, best ? best.dy : 0);
      var r2 = c.getBoundingClientRect();
      blockers.push({ left: r2.left, right: r2.right, top: r2.top, bottom: r2.bottom });
    });
  }

  /* ---- bublina „Kontaktovat“ místo „Made in Framer“ -------------------- */
  function bubble() {
    if (document.getElementById("jb-contact")) return;
    var a = document.createElement("a");
    a.id = "jb-contact";
    a.href = CONTACT;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", "Kontaktovat – napsat zprávu na Messengeru");
    a.innerHTML =
      '<span class="jb-dot" aria-hidden="true"></span>' +
      '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M12 2.6c5.2 0 9.4 3.8 9.4 8.5S17.2 19.6 12 19.6c-1 0-2-.14-2.9-.4l-4.4 1.5c-.6.2-1.2-.3-1.1-.9l.4-3C2.6 15.5 2.6 12 2.6 11.1 2.6 6.4 6.8 2.6 12 2.6z" fill="#262626"/>' +
      '<path d="M7.6 12.9l2.6-4 2.1 2 1.9-2 2.4 4-2.2-.7-1.9 1.9-2.1-2.1-2.6 1.3z" fill="#fff"/></svg>' +
      "<span>Kontaktovat</span>";
    document.body.appendChild(a);
  }

  /* ---- reference: žádný cizí obličej, jen anonymní značka ------------- */
  function anonymizeReviews() {
    var secs = [].slice.call(document.querySelectorAll('[data-framer-name="Reviews-Section"], [data-framer-name="reviews"]'));
    secs.forEach(function (sec) {
      [].slice.call(sec.querySelectorAll("img")).forEach(function (im) {
        var w = im.parentElement;
        if (!w) return;
        var r = w.getBoundingClientRect();
        if (r.width < 14 || r.width > 96 || r.height < 14) return;
        if (im.className.indexOf("jb-av-hide") === -1) im.classList.add("jb-av-hide");
        if (w.className.indexOf("jb-av") === -1) w.classList.add("jb-av");
      });
    });
  }

  /* ---- kontakty: šablona má ukázkové kanály, ne Jakubovy ------------------
     Instagram→Messenger, X/GitHub/e-mail/telefon schovat – bez GitHub odkazu.
     Glyfy měním jen uvnitř <img>, kolečko a velikost nechává šablona.      */
  var FB_URL = "https://www.facebook.com/profile.php?id=61551880232372&locale=cs_CZ";
  var GLYPH = {
    messenger: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#262626" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2c4.85 0 8.8 3.6 8.8 8s-3.95 8-8.8 8c-1 0-1.97-.14-2.87-.4L5.3 20.1c-.55.18-1.1-.28-1.03-.86l.3-2.4A7.6 7.6 0 0 1 3.2 11.2c0-4.4 3.95-8 8.8-8Z"/><path d="m6.9 15 4.4-4.7 2.2 2.3L17.1 8l-4.4 4.7-2.2-2.3Z"/></svg>`,
    github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="none" stroke="#262626" stroke-width="0.8" stroke-linejoin="round" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A7.995 7.995 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>`
  };
  function glyphUrl(k) { return "data:image/svg+xml," + encodeURIComponent(GLYPH[k]); }

  function links() {
    var ICONS = [
      [/instagram\.com/i, FB_URL, "Messenger", "messenger"]
    ];
    [].slice.call(document.querySelectorAll("a[href]")).forEach(function (a) {
      var h = a.getAttribute("href") || "";
      if (/x\.com|github\.com/i.test(h) || /^mailto:hello@example\.com$/i.test(h) || /^tel:\+10000000000$/.test(h)) {
        if (a.className.indexOf("jb-hidden") === -1) {
          a.classList.add("jb-hidden"); a.setAttribute("aria-hidden", "true"); a.setAttribute("tabindex", "-1");
          a.removeAttribute("href");
        }
        return;
      }
      for (var i = 0; i < ICONS.length; i++) {
        var m = ICONS[i];
        if (!m[0].test(h)) continue;
        if (a.getAttribute("data-jb-link") === m[1]) return;
        a.setAttribute("data-jb-link", m[1]);
        a.setAttribute("href", m[1]);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
        a.setAttribute("aria-label", m[2]);
        a.title = m[2];
        if (a.className.indexOf("jb-icon") === -1) a.classList.add("jb-icon");
        var im = a.querySelector("img");
        if (im) { im.removeAttribute("srcset"); im.src = glyphUrl(m[3]); im.alt = ""; }
        return;
      }
    });

    /* CTA tlačítka v šabloně jsou <a> bez href – nic neudělají; napojíme je */
    var CTA = { "Napsat na Messenger": FB_URL, "Message me on Messenger": FB_URL, "Řekněte mi o projektu": "./#footer", "Tell me about your project": "./#footer" };
    leaves(document).forEach(function (e) {
      var t = (e.textContent || "").replace(/\s+/g, " ").trim();
      var href = CTA[t];
      if (!href) return;
      var a = e.closest("a");
      if (!a || a.getAttribute("data-jb-cta") === href) return;
      a.setAttribute("data-jb-cta", href);
      a.setAttribute("href", href);
      if (a.className.indexOf("jb-cta") === -1) a.classList.add("jb-cta");
      if (href.charAt(0) === "." || href.charAt(0) === "#") { a.removeAttribute("target"); }
      else { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener noreferrer"); }
    });
  }


  /* ---- „Napsat na Messenger“: jen odkaz, bez Framer okna s kontaktem ----
     Šablona na tlačítko váže otevření vyskakovacího okna (formulář). Zachytíme
     klik dřív než React (capture na window) a otevřeme jen Messenger.      */
  function isMsgCta(t) {
    var a = t && t.closest && t.closest("a.jb-cta");
    return a && a.getAttribute("data-jb-cta") === FB_URL ? a : null;
  }
  ["pointerdown", "pointerup", "mousedown", "mouseup", "touchstart", "touchend"].forEach(function (ev) {
    window.addEventListener(ev, function (e) { if (isMsgCta(e.target)) e.stopImmediatePropagation(); }, true);
  });
  window.addEventListener("click", function (e) {
    if (!isMsgCta(e.target)) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    window.open(FB_URL, "_blank", "noopener");
  }, true);

  var LOG = [];
  var queued = false;
  function apply() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      ["bubble", "heroCards", "applyProjects", "pruneProjects", "anonymizeReviews", "links", "nudges", "priceBtn"].forEach(function (fn) {
        try { window.__jb_fns[fn](); } catch (e) { if (LOG.length < 12) LOG.push(fn + ": " + e.message); }
      });
    });
  }

  /* ---- 9) Tlačítko „Zjistit cenu konkurence“ v odpovědi u ceny -------------
     Odpověď existuje až v běžícím webu (ať už ji dá React, nebo fallback),
     proto se tlačítko vkládá sem. Finduje se nejkratší uzel s tou cenou,
     takže se trefí přesně do odstavce odpovědi a nikam dál. -- */
  function priceBtn() {
    var URL = "https://pajskr.cz/cena-webovych-stranek/";
    var cards = [].slice.call(document.querySelectorAll(".framer-6CPrF")).filter(function (c) {
      return /Kolik bude web|How much does a website cost/.test(c.textContent || "");
    });
    cards.forEach(function (card) {
      if (card.querySelector("[data-jb-price]")) return;
      var best = null, bestLen = 1e9;
      /* Odpověď může být gerade skrytá (nulová šířka), proto se velikost neověřuje –
         tlačítko se vloží dovnitř a je vidět ve chvíli, kdy je vidět odpověď. */
      [].slice.call(card.querySelectorAll("p, div, span")).forEach(function (e) {
        var t = (e.textContent || "").trim();
        if (t.indexOf("8 000") === -1 && t.indexOf("$400") === -1) return;
        if (e.querySelector("p, div, span")) return; /* ať sedí co nejblíž textu */
        if (t.length < bestLen) { best = e; bestLen = t.length; }
      });
      if (!best) {
        [].slice.call(card.querySelectorAll("p")).forEach(function (e) {
          var t = (e.textContent || "").trim();
          if ((t.indexOf("8 000") !== -1 || t.indexOf("$400") !== -1) && t.length < bestLen) { best = e; bestLen = t.length; }
        });
      }
      if (!best) return;
      var a = document.createElement("a");
      a.className = "jb-price-btn";
      var en = document.documentElement.getAttribute("data-lang") === "en";
      a.href = en ? "https://www.outerboxdesign.com/articles/web-development/website-pricing-costs/" : URL;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.setAttribute("data-jb-price", "1");
      a.textContent = en ? "See what others charge" : "Zjistit cenu konkurence";
      best.appendChild(a);
    });
    /* Po dohrání Reactu odpovědi vzniknou až otevřením karty – proto se to přepočítá
       i po kliknutí. Volání je idempotentní, karta s tlačítkem se přeskočí. */
    if (!JB_PBL) { JB_PBL = true;
      /* React odpověď při otevření karty vykreslí znovu (a tlačítko zahodí),
         proto se po kliknutí zkouší víckrát + tichá pojistka každých 800 ms */
      document.addEventListener("click", function () {
        [90, 350, 800, 1500].forEach(function (t) { setTimeout(priceBtn, t); });
      }, true);
      setInterval(priceBtn, 800);
      /* klik na tlačítko: jen otevřít web s cenami, kartu nezavírat */
      ["pointerdown", "mousedown", "pointerup", "mouseup"].forEach(function (ev) {
        window.addEventListener(ev, function (e) {
          if (e.target.closest && e.target.closest("[data-jb-price]")) e.stopImmediatePropagation();
        }, true);
      });
      window.addEventListener("click", function (e) {
        var a = e.target.closest && e.target.closest("[data-jb-price]");
        if (!a) return;
        e.stopImmediatePropagation();
        e.preventDefault();
        window.open(a.href, "_blank", "noopener");
      }, true);
    }
    return cards.length;
  }
  var JB_PBL = false;

  window.__jb = { log: LOG, apply: apply, nudges: nudges, projects: applyProjects };
  window.__jb_fns = { bubble: bubble, heroCards: heroCards, applyProjects: applyProjects, pruneProjects: pruneProjects, anonymizeReviews: anonymizeReviews, links: links, nudges: nudges, priceBtn: priceBtn };

  /* React dorazí až po nás – pár pokusů + observer na další render */
  [0, 350, 900, 1800, 3200, 5200].forEach(function (t) { setTimeout(apply, t); });
  window.addEventListener("load", apply);
  window.addEventListener("resize", function () { lastKey = ""; apply(); });
  if (window.MutationObserver) {
    var mo, ticks = [], limit = 0;
    mo = new MutationObserver(function () {
      /* pojistka: kdyby si React a ourky přepínaly DOM donekonečna, přestaň */
      var now = Date.now();
      ticks = ticks.filter(function (t) { return now - t < 2000; });
      if (limit > 60) { mo.disconnect(); return; }
      ticks.push(now);
      if (ticks.length > 24) limit += 10;
      apply();
    });
    mo.observe(document.documentElement, {
      /* data-lang navíc: po přepnutí CZ/EN (i18n.js) se karty znovu projdou
           a popisek odkazu se srovná s právě zvoleným jazykem */
      childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style", "src", "data-lang"]
    });
  }
  apply();
})();
