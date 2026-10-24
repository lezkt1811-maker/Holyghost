// Holy Ghost Plumbing Services — site behavior
(function () {
  const PHONE = "+18168799346";
  const PHONE_PRETTY = "816-879-9346";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  $("#year").textContent = new Date().getFullYear();

  /* ---------- Glowing spirit particles ---------- */
  const canvas = $("#spirits");
  const ctx = canvas.getContext("2d");
  let W, H, orbs = [];
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * dpr;
    H = canvas.height = innerHeight * dpr;
    const count = Math.round(Math.min(70, (innerWidth * innerHeight) / 22000));
    orbs = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: (Math.random() * 1.8 + 0.4) * dpr,
      vy: -(Math.random() * 0.25 + 0.05) * dpr,
      vx: (Math.random() - 0.5) * 0.15 * dpr,
      a: Math.random() * 0.6 + 0.2, t: Math.random() * Math.PI * 2,
      c: ["255,255,255", "63,216,255", "47,107,255", "47,255,168", "125,255,92", "63,216,255", "47,255,168"][Math.floor(Math.random() * 7)],
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const o of orbs) {
      o.t += 0.02; o.x += o.vx + Math.sin(o.t) * 0.15; o.y += o.vy;
      if (o.y < -10) { o.y = H + 10; o.x = Math.random() * W; }
      const alpha = o.a * (0.6 + 0.4 * Math.sin(o.t * 1.3));
      ctx.beginPath();
      ctx.fillStyle = `rgba(${o.c},${alpha})`;
      ctx.shadowColor = `rgba(${o.c},0.95)`;
      ctx.shadowBlur = o.r * 8;
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  }
  resize(); draw();
  addEventListener("resize", resize);

  /* ---------- Cursor glow + logo tilt ---------- */
  const glow = $(".cursor-glow");
  const mascotSvg = $(".mascot");
  addEventListener("pointermove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
    if (reduceMotion) return;
    const r = mascotSvg.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth;
    const dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
    mascotSvg.style.transform = `perspective(800px) rotateY(${(dx * 18).toFixed(2)}deg) rotateX(${(-dy * 18).toFixed(2)}deg)`;
  });

  /* ---------- Mascot tips ---------- */
  const tips = [
    "Know where your main shutoff valve is — before you need it. 🔧",
    "Never pour grease down the drain. Let it cool and toss it in the trash.",
    "Flush only the 3 P's: pee, poop, and paper. 🕊️",
    "Flushing your water heater once a year helps it last longer.",
    "KC freeze warning? Open cabinet doors under sinks on outside walls.",
    "A running toilet can waste hundreds of gallons a day. Call us! 816-879-9346",
    "Hair catchers in the shower = fewer clogs.",
    "Boo! Your plumbing problems are scared of us.",
  ];
  let tipIdx = -1;
  const mascotBtn = $("#mascot"), bubble = $("#bubble");
  mascotBtn.addEventListener("click", () => {
    tipIdx = (tipIdx + 1) % tips.length;
    bubble.textContent = tips[tipIdx];
    bubble.classList.remove("pop"); void bubble.offsetWidth; bubble.classList.add("pop");
    mascotBtn.classList.remove("boo"); void mascotBtn.offsetWidth; mascotBtn.classList.add("boo");
  });

  /* ---------- Scroll reveal + count-up ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      const num = en.target.querySelector("[data-count]");
      if (num) countUp(num);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + "ms"; io.observe(el); });
  function countUp(el) {
    const target = +el.dataset.count; let n = 0;
    const step = () => { n++; el.textContent = n; if (n < target) setTimeout(step, 900 / target); };
    step();
  }

  /* ---------- Card spotlight ---------- */
  $$(".service").forEach((c) => c.addEventListener("pointermove", (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - r.left + "px");
    c.style.setProperty("--my", e.clientY - r.top + "px");
  }));

  /* ---------- Mobile nav ---------- */
  const toggle = $(".nav-toggle"), nav = $("#nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("a", nav).forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false");
  }));

  /* ---------- Service cards -> booking form ---------- */
  const serviceSelect = $("#serviceSelect");
  $$(".service").forEach((card) => card.addEventListener("click", () => {
    const opt = [...serviceSelect.options].find((o) => o.value === card.dataset.service);
    if (opt) serviceSelect.value = opt.value;
    $("#quote").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => $('#quoteForm [name="name"]').focus({ preventScroll: true }), 700);
  }));

  /* ---------- Emergency triage ---------- */
  const triage = [
    { q: "Is water actively leaking, spraying, or flooding right now?", yes: "urgent" },
    { q: "Do you smell gas near the water heater or stove?", yes: "gas" },
    { q: "Is sewage backing up into a tub, shower, or toilet?", yes: "urgent" },
    { q: "Are you completely without water or hot water?", yes: "soon" },
  ];
  const outcomes = {
    gas: { cls: "urgent", title: "⚠️ Leave the house now", text: "Don't flip switches or use flames. Once you're outside, call 911 or your gas company. Call us after it's safe." , call: false },
    urgent: { cls: "urgent", title: "🚨 Yes — this is an emergency", text: "Shut off the main water valve if you can, then call us right away.", call: true },
    soon: { cls: "urgent", title: "⏱️ Needs attention today", text: "Not a flood, but you shouldn't wait. Call or text us to get on the schedule.", call: true },
    fine: { cls: "calm", title: "😌 Not an emergency", text: "Good news! Book a visit at a time that works for you.", call: false, book: true },
  };
  const tb = $("#triageBody");
  function renderQ(i) {
    if (i >= triage.length) return renderResult("fine");
    const dots = triage.map((_, k) => `<span class="${k <= i ? "on" : ""}"></span>`).join("");
    tb.innerHTML = `<div class="triage-dots">${dots}</div><p class="triage-q">${triage[i].q}</p>
      <div class="triage-opts"><button class="btn btn-primary btn-small" data-a="yes">Yes</button>
      <button class="btn btn-ghost btn-small" data-a="no">No</button></div>`;
    $$("button", tb).forEach((b) => b.addEventListener("click", () =>
      b.dataset.a === "yes" ? renderResult(triage[i].yes) : renderQ(i + 1)));
  }
  function renderResult(key) {
    const o = outcomes[key];
    tb.innerHTML = `<div class="triage-result ${o.cls}"><strong>${o.title}</strong>${o.text}</div>
      ${o.call ? `<a class="btn btn-primary btn-small" href="tel:${PHONE}">📞 Call ${PHONE_PRETTY}</a>` : ""}
      ${o.book ? `<a class="btn btn-primary btn-small" href="#quote">Book a visit</a>` : ""}
      <button class="link-btn" type="button" id="triageAgain">Start over</button>`;
    $("#triageAgain").addEventListener("click", () => renderQ(0));
  }
  renderQ(0);

  /* ---------- Drip calculator (USGS: ~15,140 drips per gallon) ---------- */
  const dripRange = $("#dripRange"), fixRange = $("#fixRange");
  const fmt = (n) => n.toLocaleString(undefined, { maximumFractionDigits: n < 10 ? 1 : 0 });
  function calcDrip() {
    const dpm = +dripRange.value, fx = +fixRange.value;
    $("#dripOut").textContent = dpm; $("#fixOut").textContent = fx;
    const galDay = (dpm * 1440 / 15140) * fx;
    $("#galDay").textContent = fmt(galDay);
    $("#galYear").textContent = fmt(galDay * 365);
    $("#tubs").textContent = fmt(galDay * 365 / 40);
    $(".falling").style.setProperty("--drip", Math.max(0.35, Math.min(3, 60 / dpm)) + "s");
  }
  dripRange.addEventListener("input", calcDrip);
  fixRange.addEventListener("input", calcDrip);
  calcDrip();

  /* ---------- Burst pipe checklist ---------- */
  const KEY = "hg-checklist";
  const checks = $$("#checklist button");
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch {}
  function updateBar() {
    const done = checks.filter((b) => b.classList.contains("done")).length;
    $("#checkBar").style.width = (done / checks.length) * 100 + "%";
    try { localStorage.setItem(KEY, JSON.stringify(checks.map((b) => b.classList.contains("done")))); } catch {}
  }
  checks.forEach((b, i) => {
    if (saved[i]) b.classList.add("done");
    b.setAttribute("aria-pressed", String(!!saved[i]));
    b.addEventListener("click", () => {
      const on = b.classList.toggle("done");
      b.setAttribute("aria-pressed", String(on));
      updateBar();
    });
  });
  $("#checkReset").addEventListener("click", () => {
    checks.forEach((b) => { b.classList.remove("done"); b.setAttribute("aria-pressed", "false"); });
    updateBar();
  });
  updateBar();

  /* ---------- Service area checker: 10-mile radius around Gladstone, MO ---------- */
  const HOME = { lat: 39.2039, lon: -94.5547 }; // Gladstone, MO
  const RADIUS_MI = 10;
  // [display name, approx. miles from Gladstone, extra search names]
  const AREAS = [
    ["Gladstone", 0, []],
    ["Oakview", 1.5, ["oaks", "oakwood", "oakwoodpark"]],
    ["Kansas City Northland", 2.8, ["northland", "kcnorth", "northkc", "kansascitynorth"]],
    ["Northmoor", 2.9, []],
    ["Claycomo", 3.3, []],
    ["Avondale", 3.4, []],
    ["Riverside", 3.6, []],
    ["Pleasant Valley", 3.9, []],
    ["Houston Lake", 4.4, []],
    ["Randolph", 4.4, []],
    ["Lake Waukomis", 4.5, []],
    ["North Kansas City", 5.1, ["nkc", "northkansascity"]],
    ["Birmingham", 5.6, []],
    ["Platte Woods", 6.2, []],
    ["Parkville", 6.9, []],
    ["Downtown Kansas City, MO", 7.3, ["kansascity", "kansascitymo", "kcmo", "downtownkc", "downtown"]],
    ["Kansas City, KS (east side)", 7.3, ["kansascityks", "kck", "kckansas"]],
    ["Liberty", 7.8, []],
    ["Weatherby Lake", 7.9, []],
    ["Sugar Creek", 8.8, []],
    ["Ferrelview", 9.9, []],
  ];
  // Close by but outside the 10-mile line — ask them to call
  const NEARBY = [
    ["Westport / Midtown KC", 10.6, ["westport", "midtown", "midtownkc"]],
    ["Independence", 10.8, []],
    ["Smithville", 12.7, []],
    ["Raytown", 14.4, []],
    ["Kearney", 15.3, []],
    ["Platte City", 16.7, []],
  ];
  const norm = (s) => s.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z]/g, "");
  const keys = (row) => [norm(row[0]), ...row[2]];
  const exact = (row, q) => keys(row).includes(q);
  const partial = (row, q) => q.length >= 4 && keys(row).some((k) => k.startsWith(q));
  const findIn = (rows, q) => rows.find((r) => exact(r, q)) || rows.find((r) => partial(r, q));
  // Farther KC-metro cities, so visitors get a clear answer
  const OUTSIDE = ["Overland Park", "Olathe", "Lenexa", "Shawnee", "Merriam", "Mission", "Prairie Village",
    "Leawood", "Lee's Summit", "Blue Springs", "Grandview", "Belton", "Raymore", "Grain Valley",
    "Bonner Springs", "Lansing", "Leavenworth", "Excelsior Springs", "Peculiar", "Lawrence"];

  const list = $("#areaList");
  AREAS.forEach(([name, mi]) => {
    const li = document.createElement("li");
    li.innerHTML = `${name} <small>${mi ? mi + " mi" : "home base"}</small>`;
    li.dataset.name = name;
    list.appendChild(li);
  });
  const result = $("#areaResult");
  const setResult = (cls, text) => { result.className = "area-result " + cls; result.textContent = text; };

  $("#areaForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = norm($("#areaInput").value);
    $$("li", list).forEach((li) => li.classList.remove("hit"));
    if (!q) return;
    const hit = findIn(AREAS, q);
    if (hit) {
      $(`li[data-name="${hit[0]}"]`, list).classList.add("hit");
      setResult("yes", `Yes! ${hit[0]} is ${hit[1] ? "about " + hit[1] + " miles" : "our home base"} — inside our 10-mile area. Call or text ${PHONE_PRETTY}.`);
      return;
    }
    const near = findIn(NEARBY, q);
    if (near) {
      setResult("no", `${near[0]} is about ${near[1]} miles out — just past our 10-mile area. Call ${PHONE_PRETTY} and ask; we may still be able to help.`);
      return;
    }
    const far = OUTSIDE.find((n) => norm(n) === q || (q.length >= 4 && norm(n).startsWith(q)));
    if (far) {
      setResult("no", `${far} is outside our 10-mile area around Gladstone. Sorry about that!`);
      return;
    }
    setResult("no", `We couldn't find that city. Try "Use my location", or call ${PHONE_PRETTY} and we'll tell you if we cover it.`);
  });

  // Real distance check with the visitor's location (never stored or sent anywhere)
  function milesBetween(a, b) {
    const R = 3958.8, toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(b.lat - a.lat), dLon = toRad(b.lon - a.lon);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  const locBtn = $("#locBtn");
  locBtn.addEventListener("click", () => {
    if (!("geolocation" in navigator)) return setResult("no", `Your browser can't share location. Type your city instead, or call ${PHONE_PRETTY}.`);
    locBtn.disabled = true;
    setResult("", "Finding you…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        locBtn.disabled = false;
        const mi = milesBetween(HOME, { lat: pos.coords.latitude, lon: pos.coords.longitude });
        const rounded = mi < 1 ? "less than 1" : mi.toFixed(1);
        if (mi <= RADIUS_MI) setResult("yes", `You're ${rounded} miles from Gladstone — you're in our service area! Call or text ${PHONE_PRETTY}.`);
        else if (mi <= RADIUS_MI + 5) setResult("no", `You're ${rounded} miles from Gladstone — just past our 10-mile area. Call ${PHONE_PRETTY} and ask; we may still make the trip.`);
        else setResult("no", `You're ${rounded} miles from Gladstone, outside our 10-mile service area. Sorry about that!`);
      },
      () => { locBtn.disabled = false; setResult("no", `Couldn't get your location. Type your city instead, or call ${PHONE_PRETTY}.`); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );
  });

  /* ---------- Booking form -> pre-filled text message ---------- */
  const form = $("#quoteForm"), errorEl = $("#formError"), noteEl = $("#formNote");
  const dateInput = $("#dateInput");
  const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dateInput.min = today.toISOString().slice(0, 10);

  function niceDate(v) {
    if (!v) return "Flexible";
    const [y, m, d] = v.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }
  function buildMessage() {
    const d = new FormData(form);
    const g = (k) => (d.get(k) || "").toString().trim();
    const lines = [
      "Holy Ghost Plumbing — Service Request",
      `Name: ${g("name")}`,
      `Phone: ${g("phone")}`,
      `Address: ${g("address")}, ${g("city")}`,
      `Property: ${g("property")}`,
      `Service: ${g("service")}`,
      `Urgency: ${g("urgency")}`,
      `Preferred: ${niceDate(g("date"))} — ${g("window")}`,
      `Reach me by: ${g("contact")}`,
    ];
    if (g("details")) lines.push(`Details: ${g("details")}`);
    return lines.join("\n");
  }
  function validate() {
    let ok = true;
    $$("[required]", form).forEach((el) => {
      const bad = !el.value.trim();
      el.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    const phone = form.elements.phone;
    if (phone.value && phone.value.replace(/\D/g, "").length < 10) { phone.classList.add("invalid"); ok = false; }
    errorEl.textContent = ok ? "" : "Please fill in the highlighted fields (phone needs 10 digits).";
    if (!ok) $(".invalid", form)?.focus();
    return ok;
  }
  form.addEventListener("input", (e) => e.target.classList.remove("invalid"));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    noteEl.textContent = "";
    if (!validate()) return;
    window.location.href = `sms:${PHONE}?&body=${encodeURIComponent(buildMessage())}`;
    noteEl.textContent = `Opening your messages app… If nothing opened, tap Copy Message and text it to ${PHONE_PRETTY}.`;
  });
  $("#copyBtn").addEventListener("click", async () => {
    noteEl.textContent = "";
    if (!validate()) return;
    const msg = buildMessage();
    try { await navigator.clipboard.writeText(msg); noteEl.textContent = `Copied! Paste it into a text to ${PHONE_PRETTY}.`; }
    catch { window.prompt("Copy this message:", msg); }
  });
})();
