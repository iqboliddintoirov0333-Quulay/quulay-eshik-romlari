/**
 * Quulay eshik romlari — Interaktiv 3D, Qatlamlar va 6-bosqichli Zamer Filtri
 */
(function () {
  "use strict";

  const CFG = window.QUULAY_CONFIG || {};

  /* ==================== 1. APPLY CONFIG ==================== */
  function applyConfig() {
    const phoneDisplay = CFG.phoneDisplay || "+998 94 479 25 21";
    const phoneHref = CFG.phoneHref || "tel:+998944792521";

    const headerPhone = document.getElementById("headerPhone");
    const headerPhoneText = document.getElementById("headerPhoneText");
    const footerPhone = document.getElementById("footerPhone");
    const footerHours = document.getElementById("footerHours");
    const dockCallBtn = document.getElementById("dockCallBtn");
    const successCallBtn = document.getElementById("successCallBtn");
    const unsupportedCallLink = document.getElementById("unsupportedCallLink");
    const unsupportedTitle = document.getElementById("unsupportedTitle");
    const unsupportedDesc = document.getElementById("unsupportedDesc");

    if (headerPhone) headerPhone.href = phoneHref;
    if (headerPhoneText) headerPhoneText.textContent = phoneDisplay;
    if (footerPhone) {
      footerPhone.href = phoneHref;
      footerPhone.textContent = phoneDisplay;
    }
    if (footerHours && CFG.workHours) footerHours.textContent = CFG.workHours;
    if (dockCallBtn) dockCallBtn.href = phoneHref;
    if (successCallBtn) successCallBtn.href = phoneHref;
    if (unsupportedCallLink) unsupportedCallLink.href = phoneHref;
    if (unsupportedTitle && CFG.unsupportedAreaTitle) {
      unsupportedTitle.textContent = CFG.unsupportedAreaTitle;
    }
    if (unsupportedDesc && CFG.unsupportedAreaDesc) {
      unsupportedDesc.textContent = CFG.unsupportedAreaDesc;
    }

    // Hide real video buttons if disabled in config
    if (CFG.showRealVideos === false) {
      document.querySelectorAll(".work-video-btn").forEach((btn) => {
        btn.classList.add("hidden");
      });
    }
  }

  /* ==================== 2. HERO 3D CAROUSEL + TILT ==================== */
  const HERO_SLIDES = [
    {
      img: "assets/images/hero-window-3d.jpg",
      alt: "Ekopen panorama PVX oyna 3D",
      badge: "EKOPEN 3D",
      brand: "EKOPEN",
      model: "Panorama oyna • Kalyonniy 2 qavat"
    },
    {
      img: "assets/images/hero-door-3d.jpg",
      alt: "Ekopen jigarrang kirish eshigi 3D",
      badge: "YANGI",
      brand: "EKOPEN",
      model: "Jigarrang eshik • 6 mm oyna"
    },
    {
      img: "assets/images/hero-balcony-3d.jpg",
      alt: "Ekopen balkon va ayvon tizimi 3D",
      badge: "TERMO HIMOYA",
      brand: "EKOPEN",
      model: "Balkon tizimi • Shovqin izolyatsiyasi"
    },
    {
      img: "assets/images/layers-cutaway-3d.jpg",
      alt: "Ekopen 5 kamerali profil qatlamlari 3D",
      badge: "5 KAMERA",
      brand: "EKOPEN 70",
      model: "Qatlamli kesma • 1.5 mm po'lat armatura"
    }
  ];

  let currentSlide = 0;
  let slideTimer = null;

  function initHero3D() {
    const imgEl = document.getElementById("stageProductImg");
    const badgeEl = document.getElementById("stageBadge");
    const brandEl = document.getElementById("stageBrand");
    const modelEl = document.getElementById("stageModel");
    const dots = Array.from(document.querySelectorAll(".stage-dot"));
    const prevBtn = document.getElementById("prevSlideBtn");
    const nextBtn = document.getElementById("nextSlideBtn");
    const viewport = document.getElementById("stageViewport");
    const tiltBox = document.getElementById("stageTilt");

    function goToSlide(index) {
      currentSlide = (index + HERO_SLIDES.length) % HERO_SLIDES.length;
      const slide = HERO_SLIDES[currentSlide];

      imgEl.classList.add("switching");
      setTimeout(() => {
        imgEl.src = slide.img;
        imgEl.alt = slide.alt;
        badgeEl.textContent = slide.badge;
        brandEl.textContent = slide.brand;
        modelEl.textContent = slide.model;
        imgEl.classList.remove("switching");
      }, 160);

      dots.forEach((dot, i) => {
        const active = i === currentSlide;
        dot.classList.toggle("active", active);
        dot.setAttribute("aria-selected", String(active));
      });
    }

    function resetAutoRotate() {
      clearInterval(slideTimer);
      slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5200);
    }

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        goToSlide(Number(dot.dataset.slide));
        resetAutoRotate();
      });
    });

    prevBtn?.addEventListener("click", () => {
      goToSlide(currentSlide - 1);
      resetAutoRotate();
    });

    nextBtn?.addEventListener("click", () => {
      goToSlide(currentSlide + 1);
      resetAutoRotate();
    });

    // Touch swipe + interactive 3D pointer tilt
    let startX = 0;
    let isDragging = false;

    viewport.addEventListener("pointerdown", (e) => {
      startX = e.clientX;
      isDragging = true;
      clearInterval(slideTimer);
    });

    viewport.addEventListener("pointermove", (e) => {
      const rect = viewport.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      tiltBox.style.transform = `rotateY(${nx * 16}deg) rotateX(${-ny * 10}deg)`;
    });

    const endInteraction = (e) => {
      tiltBox.style.transform = "rotateY(0deg) rotateX(0deg)";
      if (!isDragging) return;
      isDragging = false;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 42) {
        goToSlide(dx < 0 ? currentSlide + 1 : currentSlide - 1);
      }
      resetAutoRotate();
    };

    viewport.addEventListener("pointerup", endInteraction);
    viewport.addEventListener("pointerleave", () => {
      tiltBox.style.transform = "rotateY(0deg) rotateX(0deg)";
      isDragging = false;
    });

    resetAutoRotate();
  }

  /* ==================== 3. 6-STEP FILTER QUIZ ==================== */
  const quizState = {
    step: 1,
    product: "",
    objectType: "",
    district: "",
    timeline: "",
    name: "",
    phone: ""
  };

  function initQuiz() {
    const districts = CFG.serviceDistricts || [
      "Andijon shahri",
      "Andijon tumani",
      "Asaka tumani",
      "Izboskan tumani",
      "Paxtaobod tumani",
      "Shahrixon tumani",
      "Oltinko'l tumani",
      "Xo'jaobod tumani"
    ];

    const districtContainer = document.getElementById("districtOptions");
    const servedChips = document.getElementById("servedAreasChips");

    // Render service district buttons
    districts.forEach((d) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "district-btn";
      btn.textContent = d;
      btn.dataset.district = d;
      btn.addEventListener("click", () => {
        quizState.district = d;
        districtContainer.querySelectorAll(".district-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        setTimeout(() => showQuizStep(4), 190);
      });
      districtContainer.appendChild(btn);

      // Add chip to unsupported screen
      const chip = document.createElement("span");
      chip.className = "served-chip";
      chip.textContent = d;
      servedChips.appendChild(chip);
    });

    // Add "Boshqa tuman / viloyat" trigger for unsupported area screen
    const otherBtn = document.createElement("button");
    otherBtn.type = "button";
    otherBtn.className = "district-btn other-area";
    otherBtn.textContent = "Boshqa tuman / viloyat";
    otherBtn.addEventListener("click", () => {
      quizState.district = "Boshqa hudud";
      showQuizStep("unsupported");
    });
    districtContainer.appendChild(otherBtn);

    // Step 1, 2, 4 option buttons
    document.querySelectorAll("[data-field]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const field = btn.dataset.field;
        const val = btn.dataset.value;
        quizState[field] = val;

        // Visual selected feedback within current step
        const parentStep = btn.closest(".quiz-step");
        parentStep.querySelectorAll("[data-field]").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");

        const currentStepNum = Number(parentStep.dataset.step);
        setTimeout(() => showQuizStep(currentStepNum + 1), 190);
      });
    });

    // Back button
    const backBtn = document.getElementById("quizBackBtn");
    backBtn.addEventListener("click", () => {
      if (quizState.step === "unsupported") {
        showQuizStep(3);
      } else if (typeof quizState.step === "number" && quizState.step > 1) {
        showQuizStep(quizState.step - 1);
      }
    });

    // Retry district button inside unsupported screen
    document.getElementById("retryDistrictBtn").addEventListener("click", () => {
      showQuizStep(3);
    });

    // Step 5: Name input
    const nameInput = document.getElementById("leadNameInput");
    const nameError = document.getElementById("nameError");
    const nameNextBtn = document.getElementById("nameNextBtn");

    function handleNameNext() {
      const val = nameInput.value.trim();
      if (val.length < 2) {
        nameError.classList.remove("hidden");
        nameInput.focus();
        return;
      }
      nameError.classList.add("hidden");
      quizState.name = val;
      renderSelectionSummary();
      showQuizStep(6);
      setTimeout(() => document.getElementById("leadPhoneInput")?.focus(), 120);
    }

    nameNextBtn.addEventListener("click", handleNameNext);
    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleNameNext();
      }
    });
    nameInput.addEventListener("input", () => nameError.classList.add("hidden"));

    // Step 6: Uzbekistan phone formatting (+998 (XX) XXX-XX-XX)
    const phoneInput = document.getElementById("leadPhoneInput");
    const phoneError = document.getElementById("phoneError");
    const submitBtn = document.getElementById("submitLeadBtn");

    function formatUzPhone(rawDigits) {
      let d = rawDigits.replace(/\D/g, "");
      if (d.startsWith("998") && d.length > 9) d = d.slice(3);
      d = d.slice(0, 9);

      let out = "";
      if (d.length > 0) out += "(" + d.slice(0, 2);
      if (d.length >= 2) out += ") ";
      if (d.length > 2) out += d.slice(2, 5);
      if (d.length > 5) out += "-" + d.slice(5, 7);
      if (d.length > 7) out += "-" + d.slice(7, 9);
      return { formatted: out, digits: d };
    }

    phoneInput.addEventListener("input", () => {
      const { formatted } = formatUzPhone(phoneInput.value);
      phoneInput.value = formatted;
      phoneError.classList.add("hidden");
    });

    phoneInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitBtn.click();
      }
    });

    submitBtn.addEventListener("click", async () => {
      const { formatted, digits } = formatUzPhone(phoneInput.value);
      if (digits.length < 9) {
        phoneError.classList.remove("hidden");
        phoneInput.focus();
        return;
      }

      quizState.phone = `+998 ${formatted}`;
      submitBtn.disabled = true;
      submitBtn.textContent = "Yuborilmoqda...";

      await dispatchLead({ ...quizState, submittedAt: new Date().toISOString() });

      submitBtn.disabled = false;
      submitBtn.textContent = "Bepul zamerga yozilish";
      renderSuccessScreen();
      showQuizStep("success");
    });

    // Reset quiz
    document.getElementById("resetQuizBtn").addEventListener("click", () => {
      quizState.product = "";
      quizState.objectType = "";
      quizState.district = "";
      quizState.timeline = "";
      quizState.name = "";
      quizState.phone = "";
      nameInput.value = "";
      phoneInput.value = "";
      document.querySelectorAll(".selected").forEach((el) => el.classList.remove("selected"));
      showQuizStep(1);
    });

    // Focus Quiz CTA banner button
    const focusQuizBtn = document.getElementById("focusQuizBtn");
    const quizCard = document.querySelector(".quiz-card");
    focusQuizBtn.addEventListener("click", () => {
      quizCard.scrollIntoView({ behavior: "smooth", block: "center" });
      quizCard.classList.remove("pulse-highlight");
      void quizCard.offsetWidth;
      quizCard.classList.add("pulse-highlight");
    });

    // Quick prefill links from 3D Works cards
    document.querySelectorAll("[data-prefill-product]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const prod = btn.dataset.prefillProduct;
        quizState.product = prod;
        document.querySelectorAll('[data-field="product"]').forEach((opt) => {
          opt.classList.toggle("selected", opt.dataset.value === prod);
        });
        showQuizStep(2);
        quizCard.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }

  function showQuizStep(stepKey) {
    quizState.step = stepKey;
    const steps = document.querySelectorAll(".quiz-step");
    steps.forEach((el) => {
      el.classList.toggle("active", el.dataset.step === String(stepKey));
    });

    const progressWrap = document.getElementById("quizProgressWrap");
    const backBtn = document.getElementById("quizBackBtn");
    const stepLabel = document.getElementById("quizStepLabel");
    const progressFill = document.getElementById("quizProgressFill");

    if (stepKey === "success") {
      progressWrap.classList.add("hidden");
      return;
    }

    progressWrap.classList.remove("hidden");

    if (stepKey === "unsupported") {
      backBtn.classList.remove("hidden");
      stepLabel.textContent = "Hudud tekshiruvi";
      progressFill.style.width = "50%";
      return;
    }

    const num = Number(stepKey);
    backBtn.classList.toggle("hidden", num <= 1);
    stepLabel.textContent = `Savol ${num} / 6`;
    progressFill.style.width = `${(num / 6) * 100}%`;

    if (num === 5) {
      setTimeout(() => document.getElementById("leadNameInput")?.focus(), 140);
    }
  }

  function renderSelectionSummary() {
    const box = document.getElementById("selectionSummary");
    const items = [quizState.product, quizState.objectType, quizState.district, quizState.timeline].filter(Boolean);
    box.innerHTML = items.map((t) => `<span class="sel-pill">${escapeHtml(t)}</span>`).join("");
  }

  function renderSuccessScreen() {
    const title = document.getElementById("successTitle");
    const box = document.getElementById("successSummaryBox");
    title.textContent = `Arizangiz qabul qilindi, ${quizState.name}!`;

    const rows = [
      ["Mahsulot", quizState.product],
      ["Obyekt turi", quizState.objectType],
      ["Tuman", quizState.district],
      ["Muddat", quizState.timeline],
      ["Telefon", quizState.phone]
    ];

    box.innerHTML = rows
      .map(
        ([k, v]) =>
          `<div class="sum-row"><span>${escapeHtml(k)}:</span><strong>${escapeHtml(v)}</strong></div>`
      )
      .join("");
  }

  async function dispatchLead(payload) {
    // Save locally so leads are inspectable even without backend
    try {
      const existing = JSON.parse(localStorage.getItem("quulay_leads") || "[]");
      existing.unshift(payload);
      localStorage.setItem("quulay_leads", JSON.stringify(existing.slice(0, 50)));
    } catch (_) {}

    // Optional Telegram Bot dispatch if owner fills config.js
    if (CFG.telegramBotToken && CFG.telegramChatId) {
      const text = [
        "🔥 <b>YANGI BEPUL ZAMER ARIZASI — Quulay</b>",
        "",
        `👤 <b>Ism:</b> ${payload.name}`,
        `📞 <b>Telefon:</b> ${payload.phone}`,
        `🪟 <b>Nima o'rnatadi:</b> ${payload.product}`,
        `🏠 <b>Obyekt turi:</b> ${payload.objectType}`,
        `📍 <b>Tuman:</b> ${payload.district}`,
        `🗓 <b>Muddat:</b> ${payload.timeline}`
      ].join("\n");

      try {
        await fetch(`https://api.telegram.org/bot${CFG.telegramBotToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CFG.telegramChatId,
            text,
            parse_mode: "HTML"
          })
        });
      } catch (err) {
        console.warn("Telegram dispatch failed:", err);
      }
    }
  }

  /* ==================== 4. 3D MATERIALS LAYERS EXPLORER ==================== */
  const LAYERS_DATA = [
    {
      num: "01",
      title: "5 kamerali Ekopen PVX profili",
      spec: "70 mm qalinlik • UV quyoshdan himoya",
      desc: "Ko'p kamerali issiqlik izolyatsiyasi qishda sovuqni, yozda jaziramani ichkariga o'tkazmaydi. O'zbekiston iqlimiga mos — quyoshda sarg'aymaydi va shakli o'zgarmaydi."
    },
    {
      num: "02",
      title: "Galvanizatsiyalangan po'lat armatura",
      spec: "1.5 mm metall karkas • Zanglamaydi",
      desc: "Profil ichiga o'rnatilgan mustahkam po'lat karkas katta panorama oynalar va og'ir eshiklarning yillar davomida egilmasligini va osilib qolmasligini ta'minlaydi."
    },
    {
      num: "03",
      title: "2 qavatli kalyonniy (toblangan) steklopaket",
      spec: "Zarbaga chidamli • Seriy / shaffof oyna",
      desc: "Ikki qavatli germetik steklopaket ko'cha shovqinini 42 dB gacha kamaytiradi, isitish va konditsioner xarajatlarini sezilarli tejaydi. Eshiklar uchun 6 mm qalin oyna qo'yiladi."
    },
    {
      num: "04",
      title: "Ikki konturli EPDM zichlagich rezina",
      spec: "-40°C dan +60°C gacha elastik",
      desc: "Sifatli EPDM rezina konturlari rom yopilganda to'liq germetiklik beradi: shamol hushtagi, chang va yomg'ir suvi uy ichiga umuman kirmaydi."
    },
    {
      num: "05",
      title: "Ko'p nuqtali sifatli furnitura va mexanizm",
      spec: "30 000+ ochilib-yopilish sikli",
      desc: "Yumshoq aylanuvchi tutqich, qishki/yozgi rejimda aniq regulyovka va ko'p nuqtali qulflash tizimi eshik va derazalardan uzoq yillar muammosiz foydalanishni kafolatlaydi."
    }
  ];

  function initMaterialsLayers() {
    const hotspots = document.querySelectorAll(".hotspot");
    const chips = document.querySelectorAll(".layer-chip");
    const numEl = document.getElementById("layerNumBadge");
    const titleEl = document.getElementById("layerDetailTitle");
    const specEl = document.getElementById("layerDetailSpec");
    const descEl = document.getElementById("layerDetailDesc");

    const modeTabs = document.querySelectorAll(".mode-tab");
    const photoView = document.getElementById("layerPhotoView");
    const interactiveView = document.getElementById("layerInteractiveView");
    const explodeRange = document.getElementById("explodeRange");
    const explodePercent = document.getElementById("explodePercent");
    const exLayers = Array.from(document.querySelectorAll(".ex-layer"));

    function selectLayer(idx) {
      const data = LAYERS_DATA[idx] || LAYERS_DATA[0];
      numEl.textContent = data.num;
      titleEl.textContent = data.title;
      specEl.textContent = data.spec;
      descEl.textContent = data.desc;

      hotspots.forEach((h) => h.classList.toggle("active", Number(h.dataset.layer) === idx));
      chips.forEach((c) => c.classList.toggle("active", Number(c.dataset.layer) === idx));
      exLayers.forEach((el) => el.classList.toggle("highlighted", Number(el.dataset.layer) === idx));
    }

    hotspots.forEach((h) => h.addEventListener("click", () => selectLayer(Number(h.dataset.layer))));
    chips.forEach((c) => c.addEventListener("click", () => selectLayer(Number(c.dataset.layer))));
    exLayers.forEach((el) => el.addEventListener("click", () => selectLayer(Number(el.dataset.layer))));

    modeTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const mode = tab.dataset.layerMode;
        modeTabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle("active", active);
          t.setAttribute("aria-selected", String(active));
        });
        photoView.classList.toggle("hidden", mode !== "photo");
        interactiveView.classList.toggle("hidden", mode !== "interactive");
      });
    });

    function updateExplode(val) {
      explodePercent.textContent = `${val}%`;
      const factor = val / 100;
      const baseSpacing = 38; // crisp Z-separation per layer in px
      const center = (exLayers.length - 1) / 2;

      exLayers.forEach((layer, i) => {
        const z = (i - center) * baseSpacing * factor;
        layer.style.transform = `translateZ(${z}px)`;
      });
    }

    explodeRange.addEventListener("input", (e) => updateExplode(Number(e.target.value)));
    updateExplode(Number(explodeRange.value));
    selectLayer(0);
  }

  /* ==================== 5. 3D WORKS FILTER + LIGHTBOX / VIDEO MODAL ==================== */
  function initWorksAndModal() {
    const filterBtns = document.querySelectorAll(".wf-btn");
    const cards = document.querySelectorAll(".work-card");

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const f = btn.dataset.filter;
        filterBtns.forEach((b) => b.classList.toggle("active", b === btn));
        cards.forEach((card) => {
          const cats = (card.dataset.category || "").split(" ");
          const show = f === "all" || cats.includes(f);
          card.classList.toggle("hidden", !show);
        });
      });
    });

    const modal = document.getElementById("mediaModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalContent = document.getElementById("modalContent");
    const closeBtn = document.getElementById("modalCloseBtn");

    function openModal(title, html) {
      modalTitle.textContent = title;
      modalContent.innerHTML = html;
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modal.classList.add("hidden");
      modalContent.innerHTML = "";
      document.body.style.overflow = "";
    }

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
    });

    // Zoom 3D renders
    document.querySelectorAll("[data-zoom-img]").forEach((media) => {
      media.addEventListener("click", () => {
        const src = media.dataset.zoomImg;
        const title = media.dataset.zoomTitle || "3D Vizualizatsiya";
        openModal(title, `<img src="${src}" alt="${escapeHtml(title)}" />`);
      });
    });

    // Play real installation video on demand (lazy loaded!)
    document.querySelectorAll("[data-video]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const src = btn.dataset.video;
        const title = btn.dataset.videoTitle || "Jonli montaj videosi";
        openModal(
          title,
          `<video controls autoplay playsinline preload="metadata"><source src="${src}" type="video/mp4" />Brauzeringiz videoni qo'llab-quvvatlamaydi.</video>`
        );
      });
    });
  }

  /* ==================== 6. PROFILE COLOR SWATCHES ==================== */
  const COLOR_PROFILES = {
    anthracite: {
      theme: "theme-anthracite",
      tag: "Eng ko'p tanlanadigan",
      name: "Seriy / Antratsit",
      desc: "Zamonaviy hi-tech hovli va kvartiralar uchun. Seriy tonirovkali kalyonniy oyna bilan mukammal moslashadi."
    },
    white: {
      theme: "theme-white",
      tag: "Klassik yechim",
      name: "Oq klassik Ekopen",
      desc: "Xonalarni yanada yorug' va keng ko'rsatadi. Pimaş oq podokonnik va barcha interyer uslublariga mos tushadi."
    },
    walnut: {
      theme: "theme-walnut",
      tag: "Hashamatli laminatsiya",
      name: "Jigarrang / Yong'oq",
      desc: "Tabiiy yog'och ko'rinishi, lekin PVX chidamliligi bilan — namlikdan shishmaydi, rangini yo'qotmaydi."
    }
  };

  function initColorStudio() {
    const btns = document.querySelectorAll(".swatch-btn");
    const frame = document.getElementById("colorSampleFrame");
    const tag = document.getElementById("colorTag");
    const name = document.getElementById("colorName");
    const desc = document.getElementById("colorDesc");

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.color;
        const data = COLOR_PROFILES[key];
        if (!data) return;

        btns.forEach((b) => {
          const active = b === btn;
          b.classList.toggle("active", active);
          b.setAttribute("aria-checked", String(active));
        });

        frame.className = `color-sample-frame ${data.theme}`;
        tag.textContent = data.tag;
        name.textContent = data.name;
        desc.textContent = data.desc;
      });
    });
  }

  /* ==================== 7. STICKY MOBILE DOCK ==================== */
  function initStickyDock() {
    const dock = document.getElementById("stickyDock");
    const quizSection = document.getElementById("quizSection");
    const dockCtaBtn = document.getElementById("dockCtaBtn");

    function onScroll() {
      const rect = quizSection.getBoundingClientRect();
      // Show dock once user scrolls past the quiz section
      const show = rect.bottom < 80;
      dock.classList.toggle("visible", show);
      dock.setAttribute("aria-hidden", String(!show));
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    dockCtaBtn.addEventListener("click", () => {
      quizSection.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ==================== HELPER ==================== */
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ==================== 1B. DUAL-DESIGN THEME SWITCHER ==================== */
  function initThemeSwitcher() {
    const btns = Array.from(document.querySelectorAll("[data-set-theme]"));
    const metaTheme = document.querySelector('meta[name="theme-color"]');

    function applyTheme(themeName, persist) {
      const valid = themeName === "brand" ? "brand" : "orange";
      document.documentElement.setAttribute("data-theme", valid);
      if (metaTheme) {
        metaTheme.setAttribute("content", valid === "brand" ? "#030a10" : "#060606");
      }
      btns.forEach((btn) => {
        const active = btn.dataset.setTheme === valid;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-pressed", String(active));
      });
      if (persist) {
        try {
          localStorage.setItem("quulay_theme", valid);
        } catch (_) {}
      }
    }

    // Priority: URL ?theme=brand|orange -> saved localStorage -> config defaultTheme
    let initial = CFG.defaultTheme || "orange";
    try {
      const param = new URLSearchParams(window.location.search).get("theme");
      const saved = localStorage.getItem("quulay_theme");
      if (param === "brand" || param === "orange") {
        initial = param;
      } else if (saved === "brand" || saved === "orange") {
        initial = saved;
      }
    } catch (_) {}

    applyTheme(initial, false);

    btns.forEach((btn) => {
      btn.addEventListener("click", () => applyTheme(btn.dataset.setTheme, true));
    });
  }

  /* ==================== BOOT ==================== */
  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    initThemeSwitcher();
    initHero3D();
    initQuiz();
    initMaterialsLayers();
    initWorksAndModal();
    initColorStudio();
    initStickyDock();
  });
})();
