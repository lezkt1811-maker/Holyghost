// Holy Ghost Plumbing Services — site behavior
(function () {
  const PHONE = "+18168799346";

  // Year in footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  // Service cards -> preselect service in quote form
  const serviceSelect = document.getElementById("serviceSelect");
  document.querySelectorAll(".service").forEach((card) => {
    card.addEventListener("click", () => {
      const value = card.dataset.service;
      const match = [...serviceSelect.options].find((o) => o.value === value);
      if (match) serviceSelect.value = value;
      document.getElementById("quote").scrollIntoView({ behavior: "smooth" });
      setTimeout(() => document.querySelector('#quoteForm [name="name"]').focus({ preventScroll: true }), 600);
    });
  });

  // Service area checker
  const AREAS = [
    "Kansas City, MO", "Kansas City, KS", "North Kansas City", "Overland Park", "Olathe",
    "Lenexa", "Shawnee", "Merriam", "Mission", "Prairie Village", "Leawood", "Lee's Summit",
    "Independence", "Blue Springs", "Raytown", "Grandview", "Belton", "Raymore",
    "Gladstone", "Liberty", "Parkville", "Riverside", "Grain Valley", "Bonner Springs"
  ];
  const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, "").replace(/(mo|ks)$/, "");
  const list = document.getElementById("areaList");
  AREAS.forEach((a) => {
    const li = document.createElement("li");
    li.textContent = a;
    list.appendChild(li);
  });
  const result = document.getElementById("areaResult");
  document.getElementById("areaForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = norm(document.getElementById("areaInput").value);
    list.querySelectorAll("li").forEach((li) => li.classList.remove("hit"));
    if (!q) return;
    let found = null;
    list.querySelectorAll("li").forEach((li) => {
      const n = norm(li.textContent);
      if (n === q || (q.length >= 4 && n.startsWith(q))) {
        li.classList.add("hit");
        found = found || li.textContent;
      }
    });
    if (found) {
      result.className = "area-result yes";
      result.textContent = `Yes! We serve ${found}. Call or text 816-879-9346.`;
    } else {
      result.className = "area-result no";
      result.textContent = "Not on our list yet — call 816-879-9346 and we'll let you know if we can make the trip.";
    }
  });

  // Quote form -> pre-filled text message
  const form = document.getElementById("quoteForm");
  const errorEl = document.getElementById("formError");
  const noteEl = document.getElementById("formNote");

  function buildMessage() {
    const d = new FormData(form);
    const lines = [
      "Holy Ghost Plumbing — Quote Request",
      `Name: ${d.get("name").trim()}`,
      `Phone: ${d.get("phone").trim()}`,
      `City: ${d.get("city").trim()}`,
      `Service: ${d.get("service")}`,
      `Urgency: ${d.get("urgency")}`,
    ];
    const details = (d.get("details") || "").trim();
    if (details) lines.push(`Details: ${details}`);
    return lines.join("\n");
  }

  function validate() {
    let ok = true;
    form.querySelectorAll("[required]").forEach((el) => {
      const bad = !el.value.trim();
      el.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    const phone = form.elements.phone;
    if (phone.value && phone.value.replace(/\D/g, "").length < 10) {
      phone.classList.add("invalid");
      ok = false;
    }
    errorEl.textContent = ok ? "" : "Please fill in the highlighted fields (phone needs 10 digits).";
    return ok;
  }

  form.addEventListener("input", (e) => e.target.classList.remove("invalid"));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    noteEl.textContent = "";
    if (!validate()) return;
    const body = encodeURIComponent(buildMessage());
    // "?&body=" works on both iOS and Android messaging apps
    window.location.href = `sms:${PHONE}?&body=${body}`;
    noteEl.textContent = "Opening your messages app… If nothing opened, use Copy Message and text it to 816-879-9346.";
  });

  document.getElementById("copyBtn").addEventListener("click", async () => {
    noteEl.textContent = "";
    if (!validate()) return;
    const msg = buildMessage();
    try {
      await navigator.clipboard.writeText(msg);
      noteEl.textContent = "Copied! Paste it into a text to 816-879-9346.";
    } catch {
      window.prompt("Copy this message:", msg);
    }
  });
})();
