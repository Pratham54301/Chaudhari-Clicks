const SYNC_EVENT_KEY = "chaudhri-clicks-sync";
const SITE_REFRESH_INTERVAL = 20000;

const state = {
  data: null,
  pricingPlans: [],
  activeFilter: "all",
  testimonialIndex: 0,
  testimonialTimer: null,
  revealObserver: null,
  refreshTimer: null
};

const elements = {
  loader: document.getElementById("loader"),
  navbar: document.getElementById("navbar"),
  mobileToggle: document.getElementById("mobileToggle"),
  navMenu: document.getElementById("navMenu"),
  heroBackground: document.getElementById("heroBackground"),
  heroEyebrow: document.getElementById("heroEyebrow"),
  heroTitleLineOne: document.getElementById("heroTitleLineOne"),
  heroTitleAccent: document.getElementById("heroTitleAccent"),
  heroDescription: document.getElementById("heroDescription"),
  heroPrimaryCta: document.getElementById("heroPrimaryCta"),
  heroSecondaryCta: document.getElementById("heroSecondaryCta"),
  categoryFilters: document.getElementById("categoryFilters"),
  portfolioGrid: document.getElementById("portfolioGrid"),
  aboutImage: document.getElementById("aboutImage"),
  aboutEyebrow: document.getElementById("aboutEyebrow"),
  aboutTitle: document.getElementById("aboutTitle"),
  aboutDescriptionOne: document.getElementById("aboutDescriptionOne"),
  aboutDescriptionTwo: document.getElementById("aboutDescriptionTwo"),
  aboutStats: document.getElementById("aboutStats"),
  aboutCta: document.getElementById("aboutCta"),
  pricingEyebrow: document.getElementById("pricingEyebrow"),
  pricingTitle: document.getElementById("pricingTitle"),
  pricingGrid: document.getElementById("pricingGrid"),
  testimonialSlider: document.getElementById("testimonialSlider"),
  contactEyebrow: document.getElementById("contactEyebrow"),
  contactTitle: document.getElementById("contactTitle"),
  contactDescription: document.getElementById("contactDescription"),
  contactPhone: document.getElementById("contactPhone"),
  contactEmail: document.getElementById("contactEmail"),
  contactLocation: document.getElementById("contactLocation"),
  bookingForm: document.getElementById("bookingForm"),
  bookingSubmit: document.getElementById("bookingSubmit"),
  eventType: document.getElementById("eventType"),
  instagramHandleLink: document.getElementById("instagramHandleLink"),
  footerDescription: document.getElementById("footerDescription"),
  footerPhone: document.getElementById("footerPhone"),
  footerEmail: document.getElementById("footerEmail"),
  footerLocation: document.getElementById("footerLocation"),
  footerFacebook: document.getElementById("footerFacebook"),
  footerInstagram: document.getElementById("footerInstagram"),
  footerWhatsapp: document.getElementById("footerWhatsapp"),
  footerYear: document.getElementById("footerYear"),
  lightbox: document.getElementById("lightbox"),
  lightboxImage: document.getElementById("lightboxImage"),
  closeLightbox: document.getElementById("closeLightbox"),
  whatsappLink: document.getElementById("whatsappLink"),
  siteToast: document.getElementById("siteToast")
};

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeJsonParse(text) {
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch (_error) {
    return {};
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const text = await response.text();
  const data = safeJsonParse(text);

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}.`);
  }

  return data;
}

function showToast(message, isError = false) {
  elements.siteToast.textContent = message;
  elements.siteToast.classList.toggle("error", isError);
  elements.siteToast.classList.add("visible");

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    elements.siteToast.classList.remove("visible");
  }, 3200);
}

function setButtonState(button, isBusy, busyLabel, idleLabel) {
  if (!button) return;
  button.disabled = isBusy;
  button.classList.toggle("is-busy", isBusy);
  button.textContent = isBusy ? busyLabel : idleLabel;
}

function hideLoader() {
  window.setTimeout(() => {
    elements.loader.classList.add("hidden");
  }, 500);
}

function updateNavScrollState() {
  if (!elements.navbar) return;
  elements.navbar.classList.toggle("scrolled", window.scrollY > 40);
}

function setupNavigation() {
  if (!elements.mobileToggle || !elements.navMenu) return;

  elements.mobileToggle.addEventListener("click", () => {
    elements.navMenu.classList.toggle("open");
  });

  elements.navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      elements.navMenu.classList.remove("open");
    });
  });

  window.addEventListener("scroll", updateNavScrollState, { passive: true });
  updateNavScrollState();
}

function openLightbox(imageUrl) {
  elements.lightboxImage.src = imageUrl;
  elements.lightbox.classList.add("open");
  document.body.classList.add("no-scroll");
}

function closeLightbox() {
  elements.lightbox.classList.remove("open");
  elements.lightboxImage.src = "";
  document.body.classList.remove("no-scroll");
}

function setupLightbox() {
  elements.closeLightbox.addEventListener("click", closeLightbox);
  elements.lightbox.addEventListener("click", (event) => {
    if (event.target === elements.lightbox) {
      closeLightbox();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
}

function refreshRevealObserver() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((element) => element.classList.add("active"));
    return;
  }

  if (state.revealObserver) {
    state.revealObserver.disconnect();
  }

  state.revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    state.revealObserver.observe(element);
  });
}

function rerenderIconsAndEffects() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
  refreshRevealObserver();
}

function normalizeHref(value) {
  return String(value || "").trim();
}

function setLink(anchor, href, text) {
  if (!anchor) return;

  const normalizedHref = normalizeHref(href);
  anchor.href = normalizedHref || "#";

  if (typeof text === "string") {
    anchor.textContent = text;
  }

  const isActive = Boolean(normalizedHref);
  anchor.classList.toggle("is-disabled", !isActive);
  anchor.hidden = false;

  if (isActive) {
    anchor.removeAttribute("aria-disabled");
    anchor.removeAttribute("tabindex");
  } else {
    anchor.setAttribute("aria-disabled", "true");
    anchor.setAttribute("tabindex", "-1");
  }
}

function setSocialLink(anchor, href) {
  if (!anchor) return;
  const normalizedHref = normalizeHref(href);

  if (!normalizedHref) {
    anchor.hidden = true;
    anchor.setAttribute("aria-hidden", "true");
    return;
  }

  anchor.hidden = false;
  anchor.removeAttribute("aria-hidden");
  anchor.href = normalizedHref;
}

function renderHero(content) {
  const hero = content.hero || {};

  elements.heroBackground.src = hero.backgroundImage || "";
  elements.heroBackground.alt = hero.titleLineOne
    ? `${hero.titleLineOne} hero image`
    : "Photography hero background";
  elements.heroEyebrow.textContent = hero.eyebrow || "";
  elements.heroTitleLineOne.textContent = hero.titleLineOne || "";
  elements.heroTitleAccent.textContent = hero.titleAccent || "";
  elements.heroDescription.textContent = hero.description || "";
  elements.heroPrimaryCta.textContent = hero.primaryCta || "View Portfolio";
  elements.heroSecondaryCta.textContent = hero.secondaryCta || "Let's Talk";
}

function renderFilters(categories) {
  const filters = [{ name: "All", slug: "all" }, ...categories];

  if (!filters.some((item) => item.slug === state.activeFilter)) {
    state.activeFilter = "all";
  }

  elements.categoryFilters.innerHTML = filters
    .map(
      (item) => `
        <button
          type="button"
          class="filter-btn ${item.slug === state.activeFilter ? "active" : ""}"
          data-filter="${escapeHtml(item.slug)}"
        >
          ${escapeHtml(item.name || item.label)}
        </button>
      `
    )
    .join("");

  elements.categoryFilters.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      if (button.dataset.filter === state.activeFilter) return;
      state.activeFilter = button.dataset.filter;
      renderFilters(categories);
      renderPortfolio(state.data?.portfolioItems || [], true);
    });
  });
}

function buildPortfolioMarkup(items) {
  if (!items.length) {
    return `
      <div class="panel-empty">
        <p class="muted-text">No portfolio work is published in this category yet.</p>
      </div>
    `;
  }

  return items
    .map(
      (item, index) => `
        <article class="portfolio-card reveal" data-lightbox="${escapeHtml(item.imageUrl)}">
          <img
            src="${escapeHtml(item.imageUrl)}"
            alt="${escapeHtml(item.title)}"
            loading="${index < 2 ? "eager" : "lazy"}"
            decoding="async"
          >
          <div class="portfolio-meta">
            <p>${escapeHtml(item.category ? item.category.name : "Portfolio")}</p>
            <h3>${escapeHtml(item.title)}</h3>
          </div>
        </article>
      `
    )
    .join("");
}

function renderPortfolio(items, animate = false) {
  const filteredItems =
    state.activeFilter === "all"
      ? items
      : items.filter((item) => item.category && item.category.slug === state.activeFilter);

  const updateGrid = () => {
    elements.portfolioGrid.innerHTML = buildPortfolioMarkup(filteredItems);

    elements.portfolioGrid.querySelectorAll(".portfolio-card").forEach((card) => {
      card.addEventListener("click", () => {
        openLightbox(card.dataset.lightbox);
      });
    });

    rerenderIconsAndEffects();
  };

  if (!animate) {
    updateGrid();
    return;
  }

  elements.portfolioGrid.classList.add("is-switching");
  window.setTimeout(() => {
    updateGrid();
    elements.portfolioGrid.classList.remove("is-switching");
  }, 160);
}

function renderAbout(content) {
  const about = content.about || {};
  const stats = Array.isArray(about.stats) ? about.stats : [];

  elements.aboutImage.src = about.image || "";
  elements.aboutImage.loading = "lazy";
  elements.aboutImage.decoding = "async";
  elements.aboutEyebrow.textContent = about.eyebrow || "";
  elements.aboutTitle.textContent = about.title || "";
  elements.aboutDescriptionOne.textContent = about.descriptionOne || "";
  elements.aboutDescriptionTwo.textContent = about.descriptionTwo || "";
  elements.aboutCta.textContent = about.ctaLabel || "Read Full Story";

  elements.aboutStats.innerHTML = stats
    .map(
      (stat) => `
        <div class="about-stat">
          <strong>${escapeHtml(stat.value)}</strong>
          <span>${escapeHtml(stat.label)}</span>
        </div>
      `
    )
    .join("");
}

function renderPricing(content, pricingPlans) {
  const pricingContent = content.pricing || {};
  const plans = Array.isArray(pricingPlans) ? [...pricingPlans] : [];
  const hasFeaturedPlan = plans.some((plan) => plan.featured);

  elements.pricingEyebrow.textContent = pricingContent.eyebrow || "Investment";
  elements.pricingTitle.textContent = pricingContent.title || "Photography Packages";

  if (!plans.length) {
    elements.pricingGrid.innerHTML = `
      <div class="panel-empty">
        <p class="muted-text">Pricing plans will appear here as soon as they are published from the admin panel.</p>
      </div>
    `;
    return;
  }

  elements.pricingGrid.innerHTML = plans
    .map((item, index) => {
      const isFeatured = hasFeaturedPlan ? item.featured : index === Math.floor(plans.length / 2);

      return `
        <article class="price-card ${isFeatured ? "featured" : ""} reveal">
          <h3>${escapeHtml(item.title)}</h3>
          <span class="amount">${escapeHtml(item.price)}</span>
          <ul>
            ${(Array.isArray(item.features) ? item.features : [])
              .map(
                (feature) => `
                  <li>
                    <i data-lucide="check"></i>
                    <span>${escapeHtml(feature)}</span>
                  </li>
                `
              )
              .join("")}
          </ul>
          <a href="#contact" class="${isFeatured ? "primary-btn" : "ghost-btn"} full-width">
            ${escapeHtml(item.buttonLabel || "Choose Plan")}
          </a>
        </article>
      `;
    })
    .join("");
}

function restartTestimonials(testimonials) {
  window.clearInterval(state.testimonialTimer);
  state.testimonialIndex = 0;
  elements.testimonialSlider.style.transform = "translateX(0)";

  if (testimonials.length <= 1) {
    return;
  }

  state.testimonialTimer = window.setInterval(() => {
    state.testimonialIndex = (state.testimonialIndex + 1) % testimonials.length;
    elements.testimonialSlider.style.transform = `translateX(-${state.testimonialIndex * 100}%)`;
  }, 5000);
}

function renderTestimonials(testimonials) {
  if (!Array.isArray(testimonials) || !testimonials.length) {
    elements.testimonialSlider.innerHTML = `
      <article class="testimonial-card">
        <blockquote>"Client stories will appear here soon."</blockquote>
        <p>Chaudhri Clicks</p>
      </article>
    `;
    restartTestimonials([]);
    return;
  }

  elements.testimonialSlider.innerHTML = testimonials
    .map(
      (item) => `
        <article class="testimonial-card">
          <blockquote>"${escapeHtml(item.quote)}"</blockquote>
          <p>${escapeHtml(item.author)}${item.role ? ` - ${escapeHtml(item.role)}` : ""}</p>
        </article>
      `
    )
    .join("");

  restartTestimonials(testimonials);
}

function renderEventOptions(categories) {
  const selectedValue = elements.eventType.value;
  const nextCategories = Array.isArray(categories) && categories.length
    ? categories
    : [{ name: "General Inquiry" }];

  elements.eventType.innerHTML = nextCategories
    .map((category) => `<option value="${escapeHtml(category.name)}">${escapeHtml(category.name)}</option>`)
    .join("");

  if (selectedValue && nextCategories.some((category) => category.name === selectedValue)) {
    elements.eventType.value = selectedValue;
  }
}

function renderContact(content, settings, categories) {
  const contact = content.contact || {};
  const info = settings.contact || {};
  const whatsappDigits = String(info.whatsapp || "").replace(/\D/g, "");

  elements.contactEyebrow.textContent = contact.eyebrow || "";
  elements.contactTitle.textContent = contact.title || "";
  elements.contactDescription.textContent = contact.description || "";
  setLink(elements.contactPhone, info.phone ? `tel:${String(info.phone).replace(/\s+/g, "")}` : "", info.phone || "");
  setLink(elements.contactEmail, info.email ? `mailto:${info.email}` : "", info.email || "");
  elements.contactLocation.textContent = info.location || "";

  setLink(elements.footerPhone, info.phone ? `tel:${String(info.phone).replace(/\s+/g, "")}` : "", info.phone || "");
  setLink(elements.footerEmail, info.email ? `mailto:${info.email}` : "", info.email || "");
  setLink(elements.footerLocation, "#contact", info.location || "");
  setLink(elements.whatsappLink, whatsappDigits ? `https://wa.me/${whatsappDigits}` : "");
  elements.whatsappLink.hidden = !whatsappDigits;

  renderEventOptions(categories);
}

function renderFooter(settings) {
  const brand = settings.brand || {};
  const social = settings.social || {};
  const info = settings.contact || {};
  const whatsappDigits = String(info.whatsapp || "").replace(/\D/g, "");

  elements.instagramHandleLink.textContent = brand.instagramHandle || "@chaudhari_clicks";
  setLink(elements.instagramHandleLink, social.instagram || "", brand.instagramHandle || "@chaudhari_clicks");
  elements.footerDescription.textContent = brand.description || "";

  setSocialLink(elements.footerFacebook, social.facebook || "");
  setSocialLink(elements.footerInstagram, social.instagram || "");
  setSocialLink(elements.footerWhatsapp, whatsappDigits ? `https://wa.me/${whatsappDigits}` : "");

  elements.footerYear.textContent = `${new Date().getFullYear()} Chaudhri Clicks. Crafted with passion.`;
}

async function loadSiteData() {
  const siteData = await fetchJson("/api/site");
  let pricingPlans = Array.isArray(siteData.pricingPlans) ? siteData.pricingPlans : [];

  try {
    const pricingResponse = await fetchJson("/api/pricing");
    pricingPlans = Array.isArray(pricingResponse) ? pricingResponse : pricingPlans;
  } catch (_error) {
    // Fall back to bootstrap pricing data if the dedicated endpoint is unavailable.
  }

  state.data = siteData;
  state.pricingPlans = pricingPlans;

  renderHero(siteData.content || {});
  renderFilters(siteData.categories || []);
  renderPortfolio(siteData.portfolioItems || []);
  renderAbout(siteData.content || {});
  renderPricing(siteData.content || {}, state.pricingPlans);
  renderTestimonials(siteData.testimonials || []);
  renderContact(siteData.content || {}, siteData.settings || {}, siteData.categories || []);
  renderFooter(siteData.settings || {});
  rerenderIconsAndEffects();
}

async function handleLeadSubmit(event) {
  event.preventDefault();

  const formData = new FormData(elements.bookingForm);
  const payload = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    eventType: formData.get("eventType"),
    eventDate: formData.get("eventDate"),
    message: formData.get("message")
  };

  setButtonState(elements.bookingSubmit, true, "Sending...", "Send Inquiry");

  try {
    await fetchJson("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    elements.bookingForm.reset();
    renderEventOptions(state.data?.categories || []);
    showToast(`Thank you, ${payload.name}. Your inquiry has been sent.`);
  } catch (error) {
    showToast(error.message, true);
  } finally {
    setButtonState(elements.bookingSubmit, false, "Sending...", "Send Inquiry");
  }
}

function broadcastRefreshListeners() {
  window.addEventListener("storage", async (event) => {
    if (event.key !== SYNC_EVENT_KEY) return;

    try {
      await loadSiteData();
    } catch (_error) {
      showToast("Website content is being updated. Please refresh again in a moment.", true);
    }
  });

  window.addEventListener("focus", async () => {
    try {
      await loadSiteData();
    } catch (_error) {
      // Intentionally silent on focus refresh failures.
    }
  });

  document.addEventListener("visibilitychange", async () => {
    if (document.visibilityState !== "visible") return;

    try {
      await loadSiteData();
    } catch (_error) {
      // Intentionally silent on visibility refresh failures.
    }
  });
}

function startPolling() {
  window.clearInterval(state.refreshTimer);
  state.refreshTimer = window.setInterval(async () => {
    try {
      await loadSiteData();
    } catch (_error) {
      // Intentionally silent during background refresh.
    }
  }, SITE_REFRESH_INTERVAL);
}

async function initializeSite() {
  setupNavigation();
  setupLightbox();
  broadcastRefreshListeners();
  elements.bookingForm.addEventListener("submit", handleLeadSubmit);

  try {
    await loadSiteData();
  } catch (_error) {
    showToast("Unable to load website content right now.", true);
  } finally {
    hideLoader();
  }

  startPolling();
}

window.addEventListener("load", initializeSite);
