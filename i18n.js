/* ============================================================================
   i18n.js – přepínání CZ / EN (vlaječka vpravo nahoře)
   Jak to funguje: web je česky (content-override.js). Tady je slovník
   čeština → angličtina. Při přepnutí se projdou všechny texty na stránce a
   vymění se; MutationObserver hlídá, když Framer něco překreslí (FAQ, karty).
   Volba jazyka se pamatuje (localStorage), jde vynutit i odkazem ?lang=en.

   CENY pro EN (USA): kurz ČNB 23. 9. 2026 – 1 USD = 21,369 Kč, + 1 000 USD
     5 000 Kč → 234 USD + 1 000 = $280
     8 000 Kč → 374 USD + 1 000 = $400
   Při změně kurzu stačí upravit čísla níž (hledej „$280“ a „$400“).
   ========================================================================== */
(function () {
  "use strict";

  var EN = {
    /* hlavička, hero */
    "Jakub®": "Jakub®",
    "K dispozici pro nové projekty": "Available for new projects",
    "Jakub Procházka, design a vývoj": "Jakub Procházka, design & dev",
    "Web, který": "A website",
    "si lidé": "people will",
    "rozhodně": "definitely",
    "pamatují.": "remember.",
    "Web, který si lidé pamatují": "A website people remember",
    "Web design": "Web design",
    "Vývoj webu": "Development",
    "Design i kód": "Design & code",
    "Nejen hezké.": "Not just pretty.",
    "Ale i funkční, čitelné a přesné": "Functional, readable and precise too",
    "Živě": "Live",
    "Otevřít projekt": "Open project",

    /* typy projektů / štítky */
    "Web na míru": "Custom website",
    "Firemní web": "Business website",
    "Prezentační web": "Presentation website",
    "Ruční tvorba": "Handmade goods",
    "Zakázková výroba": "Custom manufacturing",
    "Wellness & služby": "Wellness & services",
    "Wellness / služby": "Wellness / services",
    "Web pro instruktora": "Website for an instructor",
    "Redesign webu": "Website redesign",
    "Redesign": "Redesign",
    "Landing page": "Landing page",
    "Od návrhu po spuštění": "From design to launch",

    /* o mně */
    "TVOŘÍM WEBY,": "I BUILD WEBSITES,",
    "OD TEXTŮ PO KÓD": "FROM COPY TO CODE",
    "Jsem Jakub Procházka, weby navrhuji,": "I'm Jakub Procházka. I design,",
    "programuji i spouštím. Od struktury": "code and launch websites. From structure",
    "a textů až po spuštění.": "and copy all the way to launch.",
    "a textů až po spuštění. Žádné šablony, každý web dělám na míru.": "and copy all the way to launch. No templates, every website is custom-made.",
    "Řekněte mi o projektu": "Tell me about your project",
    "O mně": "About",
    "0 Kč": "$0",
    "První návrh zdarma": "First draft for free",
    "Bez poplatku a bez závazku. Landing page od 5 000 Kč, menší firemní web od 8 000 Kč.":
      "No fee, no commitment. Landing page from $280, small business website from $400.",
    "3": "3",
    "obory z praxe": "industries so far",
    "Řemeslná výroba, ruční tvorba i wellness. Každý web má jiný úkol.":
      "Crafts, handmade goods and wellness. Every website has a different job.",
    "6 dní": "6 days",
    "u menších webů": "for smaller websites",
    "Od schválení směru a dodání podkladů k hotovému výsledku.":
      "From approved direction and delivered materials to the finished result.",
    "1": "1",
    "člověk, se kterým to vyřešíte": "person to deal with",
    "Design, kód i úpravy řešíte přímo se mnou, bez technických detailů.":
      "Design, code and changes, all directly with me, no tech jargon.",

    /* projekty */
    "Weby, které si můžete otevřít": "Websites you can actually open",
    "Projekty": "Projects",
    "PROJEKTY": "PROJECTS",

    /* služby */
    "Kde vám": "Where I",
    "mohu pomoci": "can help you",
    "Služby": "Services",
    "SLUŽBY": "SERVICES",

    /* reference */
    "CO ŘÍKAJÍ": "WHAT CLIENTS",
    "KLIENTI": "SAY",
    "Reference": "Reviews",
    "REFERENCE": "REVIEWS",
    "Pohádkové Kousky, ruční tvorba": "Pohádkové Kousky, handmade goods",
    "Nerez-Speciál, zakázková výroba": "Nerez-Speciál, custom manufacturing",
    "Natural Massage, wellness": "Natural Massage, wellness",
    "„Konečně mě lidé najdou na internetu a mám více zákazníků.“":
      "“People can finally find me online and I have more customers.”",
    "„Méně dotazů navíc, prodej je rychlejší.“": "“Fewer extra questions, faster sales.”",
    "„Zvedla se mi poptávka.“": "“My bookings went up.”",
    "Fotky, ceny i objednávky mají svoje místo a zákazník se v nich vyzná i na mobilu. Texty i strukturu jsem připravil, aby web rovnou prodával.":
      "Photos, prices and orders all have their place and customers find their way even on mobile. I prepared the copy and structure so the site sells from day one.",
    "Urovnal strukturu, popsal materiály i zakázkovou výrobu. Ušetřilo nám to spoustu zbytečných telefonátů.":
      "He sorted out the structure and described our materials and custom work. It saved us a lot of unnecessary phone calls.",
    "Termíny, ceny i to, co která masáž obnáší, je všude na očích. Web je rychlý, čitelný a působí jako místo, kam se dá jít.":
      "Availability, prices and what each massage involves are all easy to see. The site is fast, readable and feels like a place you want to visit.",

    /* FAQ */
    "NEŽ": "BEFORE",
    "ZAČNEME": "WE START",
    "FAQ": "FAQ",
    "Co všechno umíte udělat?": "What can you do?",
    "Web na míru, landing page i oživení stávajícího webu. Texty, design, kód i responzivní spuštění dělám sám.":
      "Custom websites, landing pages and refreshes of existing sites. I handle copy, design, code and responsive launch myself.",
    "Žádné šablony, každý web dělám na míru. Landing page i oživení stávajícího webu. Texty, design, kód i responzivní spuštění dělám sám.":
      "No templates, every website is custom-made. Landing pages and refreshes of existing sites too. I handle copy, design, code and responsive launch myself.",
    "Děláte jenom grafiku?": "Do you only do visuals?",
    "Ne. Texty, design, kód i spuštění dostanete od jedné osoby, bez předávání mezi dodavateli.":
      "No. Copy, design, code and launch all come from one person, no passing work between vendors.",
    "Kolik bude web stát?": "How much does a website cost?",
    "Jednoduchý landing page od 5 000 Kč, menší firemní web od 8 000 Kč, větší projekty po domluvě. Ceny jsou jen orientační, ne pevně dané – o finální částce se domluvíme osobně.":
      "A simple landing page from $280, a small business website from $400, larger projects by agreement. Prices are a guide, not fixed – we'll agree the final price together.",
    "Co od mě budete potřebovat?": "What will you need from me?",
    "Stačí krátké zadání a informace o tom, co nabízíte. Zbytek, texty i strukturu, dotáhnu za vás.":
      "Just a short brief and info about what you offer. I'll take care of the rest, including copy and structure.",
    "Jak rychle můžete web dodat?": "How fast can you deliver?",
    "Menší web spustím obvykle do šesti dnů od schválení směru a dodání podkladů.":
      "A smaller website usually goes live within six days of approving the direction and receiving materials.",
    "Zjistit cenu konkurence": "See what others charge",

    /* kontakt / patička */
    "Pojďme": "Let's",
    "postavit": "build",
    "web, který sedí": "a website that fits",
    "Pojďme postavit web, který sedí": "Let's build a website that fits",
    "Máte nápad?": "Have an idea?",
    "Napište, co nabízíte a komu má web pomoci.": "Tell me what you offer and who the website should help.",
    "Napsat na Messenger": "Message me on Messenger",
    "O MNĚ": "ABOUT",
    "KONTAKT": "CONTACT",
    "Kontakt": "Contact",
    "Kontaktovat": "Contact me",
    "Nové projekty i úpravy stávajících webů.": "New projects and updates to existing websites.",

    /* méně viditelné texty ze šablony (vyskakovací okna, varianty) */
    "Navrhuji přehledné weby, landing pages i rozhraní, které působí čistě, dají se číst a vedou lidi k akci.":
      "I design clear websites, landing pages and interfaces that feel clean, read easily and lead people to act.",
    "Ano. Texty si po spuštění upravíte sami, web tak zůstane aktuální.":
      "Yes. You can edit the copy yourself after launch, so the site stays up to date.",
    "Navrhuji weby na míru, píšu texty, programuji a nasazuji. Vše od prvního nápadu po spuštění.":
      "I design custom websites, write copy, code and deploy. Everything from the first idea to launch.",
    "Stačí krátké zadání, informace o službě a vše, co už máte. S texty i strukturou pomůžu.":
      "A short brief, info about your service and anything you already have. I'll help with copy and structure.",
    "Ano. Web stavím tak, aby se dal upravit i bez programátora.":
      "Yes. I build websites you can edit without a developer.",
    "Ne. Řeším strukturu, texty, vizuál, programování, responzivitu i spuštění.":
      "No. I handle structure, copy, visuals, coding, responsiveness and launch.",
    "Obvykle do týdne od schválení zadání.": "Usually within a week of approving the brief."
  };

  /* atributy (aria-label, title, placeholder) */
  var EN_ATTR = {
    "Kontaktovat – napsat zprávu na Messengeru": "Contact me – send a message on Messenger",
    /* karty projektů – popisek odkazu (viz design-fixes.js → linkCard) */
    "Otevřít projekt Pohádkové Kousky v novém okně": "Open the Pohádkové Kousky project in a new window",
    "Otevřít projekt Nerez-Speciál v novém okně": "Open the Nerez-Speciál project in a new window",
    "Otevřít projekt Natural Massage v novém okně": "Open the Natural Massage project in a new window"
  };


  /* texty šablony, které jsou anglicky i v CZ verzi (skryté kontaktní okno,
     popisek Frameru) – mají svůj CZ i EN tvar. Okno se aktuálně neotevírá
     (Messenger jde napřímo), ale kdyby se někdy zapnulo, bude přeložené. */
  var TPL = {
    "Get In Touch:": ["Napište mi:", "Get in touch:"],
    "Get In Touch": ["Napište mi", "Get in touch"],
    "Name *": ["Jméno *", "Name *"],
    "Name": ["Jméno", "Name"],
    "Email *": ["E-mail *", "Email *"],
    "Email:": ["E-mail:", "Email:"],
    "Email": ["E-mail", "Email"],
    "Message": ["Zpráva", "Message"],
    "Phone Number": ["Telefon", "Phone number"],
    "Phone": ["Telefon", "Phone"],
    "Submit": ["Odeslat", "Send"],
    "Enter your name": ["Vaše jméno", "Your name"],
    "Enter you email": ["Váš e-mail", "Your email"],
    "Enter your email": ["Váš e-mail", "Your email"],
    "Enter your message": ["Vaše zpráva", "Your message"],
    "Create a free website with Framer, the website builder loved by startups, designers and agencies.": ["Jakub Procházka – tvorba webů na míru", "Jakub Procházka – custom websites"]
  };

  var HEAD_EN = {
    siteName: "Jakub Procházka, custom websites",
    imgAlt: "A website people will definitely remember – Jakub Procházka",
    title: "Custom websites, copy & code | Jakub Procházka",
    desc: "Custom websites by Jakub Procházka, no templates. Design, copy, coding and launch. First draft for free, no commitment.",
    ogTitle: "Jakub Procházka, custom websites"
  };

  /* ---- slovníky oběma směry (+ původní texty šablony rovnou do EN) ------ */
  var TO_EN = {}, TO_CS = {};
  var n = function (s) { return (s || "").replace(/[\u00a0\s]+/g, " ").trim(); };
  Object.keys(EN).forEach(function (cs) { TO_EN[n(cs)] = EN[cs]; if (!TO_CS[n(EN[cs])]) TO_CS[n(EN[cs])] = cs; });
  var MAP = window.__csMap || {};
  /* původní texty šablony (anglická výplň Frameru) → rovnou EN, resp. vlastní
     jméno (asaf sdag → Jakub Procházka, Sunoma → Pohádkové Kousky…).
     Klíč, který je zároveň naším EN textem (About, Projects…), se nepřepisuje. */
  Object.keys(MAP).forEach(function (tpl) {
    var t = n(tpl), cs = n(MAP[tpl]);
    if (TO_EN[t] || TO_CS[t]) return;
    TO_EN[t] = TO_EN[cs] !== undefined ? TO_EN[cs] : cs;
  });
  Object.keys(EN_ATTR).forEach(function (cs) { TO_EN[n(cs)] = EN_ATTR[cs]; TO_CS[n(EN_ATTR[cs])] = cs; });
  Object.keys(TPL).forEach(function (k) {
    var cs = TPL[k][0], en = TPL[k][1];
    TO_EN[n(k)] = en; TO_EN[n(cs)] = en;
    if (!TO_CS[n(en)]) TO_CS[n(en)] = cs;
    if (!TO_CS[n(k)]) TO_CS[n(k)] = cs;
  });
  /* čísla (3, 1) a jména se nepřekládají – vynech je z reverse mapy */
  ["3", "1", "Jakub®", "FAQ", "Web design", "Landing page", "Redesign", "Natural Massage, wellness"].forEach(function (k) { delete TO_CS[k]; });

  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1 };
  var lang = "cs";
  var root = document.documentElement;

  function translateNode(t, dict) {
    var raw = t.nodeValue, cur = n(raw);
    if (!cur || cur.length > 500) return;
    var rep = dict[cur];
    if (rep === undefined || rep === cur) return;
    t.nodeValue = (raw.match(/^\s*/)[0] || "") + rep + (raw.match(/\s*$/)[0] || "");
  }
  function walk(el) {
    var dict = lang === "en" ? TO_EN : TO_CS;
    if (!el) return;
    if (el.nodeType === 3) { if (el.parentElement && !SKIP[el.parentElement.tagName]) translateNode(el, dict); return; }
    var tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), t;
    while ((t = tw.nextNode())) {
      var p = t.parentElement;
      if (!p || SKIP[p.tagName] || p.closest("#jb-lang")) continue;
      translateNode(t, dict);
    }
    if (el.querySelectorAll) {
      [].forEach.call(el.querySelectorAll("[aria-label],[title],[placeholder]"), function (e) {
        ["aria-label", "title", "placeholder"].forEach(function (a) {
          var v = e.getAttribute(a); if (!v) return;
          var r = dict[n(v)]; if (r && r !== v) e.setAttribute(a, r);
        });
      });
    }
  }

  function setMeta(sel, v) { var m = document.querySelector(sel); if (m && v && m.getAttribute("content") !== v) m.setAttribute("content", v); }
  function head() {
    if (lang !== "en") return; /* CZ hlavičku řeší content-override.js */
    if (document.title !== HEAD_EN.title) document.title = HEAD_EN.title;
    setMeta('meta[name="description"]', HEAD_EN.desc);
    setMeta('meta[property="og:description"]', HEAD_EN.desc);
    setMeta('meta[name="twitter:description"]', HEAD_EN.desc);
    setMeta('meta[property="og:title"]', HEAD_EN.ogTitle);
    setMeta('meta[name="twitter:title"]', HEAD_EN.ogTitle);
    setMeta('meta[property="og:locale"]', "en_US");
    setMeta('meta[property="og:site_name"]', HEAD_EN.siteName);
    setMeta('meta[property="og:image:alt"]', HEAD_EN.imgAlt);
  }

  /* tlačítko „cena konkurence“ má jiný odkaz pro EN → přegenerovat */
  function resetPriceBtn() {
    [].forEach.call(document.querySelectorAll("[data-jb-price]"), function (a) { a.remove(); });
    try { window.__jb_fns && window.__jb_fns.priceBtn(); } catch (e) {}
  }

  /* ---- vlaječky -------------------------------------------------------- */
  var FLAG_CZ = '<svg viewBox="0 0 30 20" width="22" height="15" aria-hidden="true"><rect width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#d7141a"/><path d="M0 0 15 10 0 20z" fill="#11457e"/></svg>';
  var FLAG_US = '<svg viewBox="0 0 38 20" width="22" height="15" aria-hidden="true" preserveAspectRatio="none"><rect width="38" height="20" fill="#fff"/><g fill="#b22234">' +
    [0, 2, 4, 6, 8, 10, 12].map(function (i) { return '<rect y="' + (i * 20 / 13) + '" width="38" height="' + (20 / 13) + '"/>'; }).join("") +
    '</g><rect width="15.2" height="10.77" fill="#3c3b6e"/></svg>';

  function ui() {
    if (document.getElementById("jb-lang") || !document.body) return;
    var box = document.createElement("div");
    box.id = "jb-lang";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Jazyk / Language");
    box.innerHTML =
      '<button type="button" data-l="cs" title="Čeština" aria-label="Čeština">' + FLAG_CZ + '<span>CZ</span></button>' +
      '<button type="button" data-l="en" title="English" aria-label="English">' + FLAG_US + '<span>EN</span></button>';
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-l]");
      if (b) setLang(b.getAttribute("data-l"));
    });
    document.body.appendChild(box);
    mark();
  }
  function mark() {
    [].forEach.call(document.querySelectorAll("#jb-lang button"), function (b) {
      var on = b.getAttribute("data-l") === lang;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function setLang(l, silent) {
    l = l === "en" ? "en" : "cs";
    lang = l;
    root.setAttribute("data-lang", l);
    root.setAttribute("lang", l);
    try { localStorage.setItem("jb-lang", l); } catch (e) {}
    walk(document.body);
    head();
    mark();
    if (!silent) resetPriceBtn();
    if (l === "cs" && window.__jb_cs_run) window.__jb_cs_run();
  }

  /* ---- start ----------------------------------------------------------- */
  var start = "cs";
  try {
    var q = /[?&]lang=(en|cs)\b/.exec(location.search);
    start = q ? q[1] : (localStorage.getItem("jb-lang") || "cs");
  } catch (e) {}
  lang = start;
  root.setAttribute("data-lang", start);
  root.setAttribute("lang", start);

  /* Překládat až PO hydrataci Reactu (jinak React hlásí chybu #425 a stránku
     překreslí). Do té doby je EN verze na zlomek vteřiny skrytá, aby neproblikla čeština. */
  var ready = false;
  if (start === "en") root.classList.add("jb-i18n-wait");
  function go() {
    if (ready) return;
    ready = true;
    ui(); setLang(lang, true); resetPriceBtn();
    root.classList.remove("jb-i18n-wait");
  }
  /* hydratace hotová = React má „fiber“ na prvcích stránky a pak chvíli klid */
  function hydrated() {
    var el = document.querySelector('[data-framer-name="main-heading"]') || document.querySelector("#main *");
    if (!el) return false;
    for (var k in el) if (k.indexOf("__reactFiber") === 0) return true;
    return false;
  }
  var t0 = Date.now();
  (function wait() {
    if (hydrated() || Date.now() - t0 > 8000) setTimeout(go, 400);
    else setTimeout(wait, 100);
  })();

  var queued = false, pending = [];
  new MutationObserver(function (ms) {
    for (var i = 0; i < ms.length; i++) {
      var m = ms[i];
      if (m.type === "characterData") pending.push(m.target);
      else for (var j = 0; j < m.addedNodes.length; j++) pending.push(m.addedNodes[j]);
    }
    if (!ready) { pending = []; return; }
    if (queued || !pending.length) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      var list = pending; pending = [];
      list.forEach(function (nd) { if (nd.isConnected) walk(nd); });
      if (lang === "en") head();
      ui();
    });
  }).observe(root, { childList: true, subtree: true, characterData: true });

  window.__jbLang = { set: setLang, get: function () { return lang; } };
})();
