const state = {
  data: null,
  activeFilter: "all",
  testimonialIndex: 0,
  testimonialTimer: null,
  revealObserver: null
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
  eventType: document.getElementById("eventType"),
  instagramHandleLink: document.getElementById("instagramHandleLink"),
  footerDescription: document.getElementById("footerDescription"),
  footerPhone: document.getElementById("footerPhone"),
  footerEmail: document.getElementById("footerEmail"),
  footerLocation: document.getElementById("footerLocation"),
  footerFacebook: document.getElementById("footerFacebook"),
  footerTwitter: document.getElementById("footerTwitter"),
  footerInstagram: document.getElementById("footerInstagram"),
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

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    cache: "no-store",
    ...options
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

function showToast(message, isError = false) {
  elements.siteToast.textContent = message;
  elements.siteToast.style.borderColor = isError
    ? "rgba(255, 107, 107, 0.25)"
    : "rgba(212, 175, 55, 0.22)";
  elements.siteToast.classList.add("visible");

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    elements.siteToast.classList.remove("visible");
  }, 3000);
}

function hideLoader() {
  window.setTimeout(() => {
    elements.loader.classList.add("hidden");
  }, 600);
}

function updateNavScrollState() {
  if (window.scrollY > 40) {
    elements.navbar.classList.add("scrolled");
  } else {
    elements.navbar.classList.remove("scrolled");
  }
}

function setupNavigation() {
  elements.mobileToggle.addEventListener("click", () => {
    elements.navMenu.classList.toggle("open");
  });

  elements.navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      elements.navMenu.classList.remove("open");
    });
  });

  window.addEventListener("scroll", updateNavScrollState);
  updateNavScrollState();
}

function openLightbox(imageUrl) {
  elements.lightboxImage.src = imageUrl;
  elements.lightbox.classList.add("open");
  document.body.classList.add("no-scroll");
}

function closeLightbox() {
  elements.lightbox.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

function setupLightbox() {
  elements.closeLightbox.addEventListener("click", closeLightbox);
  elements.lightbox.addEventListener("click", (event) => {
    if (event.target === elements.lightbox) {
      closeLightbox();
    }
  });
}

function refreshRevealObserver() {
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

function renderHero(content) {
  const hero = content.hero || {};

  elements.heroBackground.src = hero.backgroundImage || "";
  elements.heroEyebrow.textContent = hero.eyebrow || "";
  elements.heroTitleLineOne.textContent = hero.titleLineOne || "";
  elements.heroTitleAccent.textContent = hero.titleAccent || "";
  elements.heroDescription.textContent = hero.description || "";
  elements.heroPrimaryCta.textContent = hero.primaryCta || "View Portfolio";
  elements.heroSecondaryCta.textContent = hero.secondaryCta || "Let's Talk";
}

function renderFilters(categories) {
  const filters = [{ label: "All", slug: "all" }, ...categories];

  if (!filters.some((item) => item.slug === state.activeFilter)) {
    state.activeFilter = "all";
  }

  elements.categoryFilters.innerHTML = filters
    .map(
      (item) => `
        <button type="button" class="filter-btn ${item.slug === state.activeFilter ? "active" : ""}" data-filter="${escapeHtml(item.slug)}">
            ${escapeHtml(item.label || item.name)}
        </button>
      `
    )
    .join("");

  elements.categoryFilters.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeFilter = button.dataset.filter;
      renderFilters(categories);
      renderPortfolio(state.data.portfolioItems || []);
    });
  });
}

function renderPortfolio(items) {
  const filteredItems =
    state.activeFilter === "all"
      ? items
      : items.filter((item) => item.category && item.category.slug === state.activeFilter);

  if (filteredItems.length === 0) {
    elements.portfolioGrid.innerHTML = `
      <div class="panel-empty">
        <p class="muted-text">No portfolio work is published in this category yet.</p>
      </div>
    `;
    return;
  }

  elements.portfolioGrid.innerHTML = filteredItems
    .map(
      (item) => `
        <article class="portfolio-card reveal" data-lightbox="${escapeHtml(item.imageUrl)}">
            <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}">
            <div class="portfolio-meta">
                <p>${escapeHtml(item.category ? item.category.name : "Portfolio")}</p>
                <h3>${escapeHtml(item.title)}</h3>
            </div>
        </article>
      `
    )
    .join("");

  elements.portfolioGrid.querySelectorAll(".portfolio-card").forEach((card) => {
    card.addEventListener("click", () => {
      openLightbox(card.dataset.lightbox);
    });
  });
}

function renderAbout(content) {
  const about = content.about || {};
  const stats = Array.isArray(about.stats) ? about.stats : [];

  elements.aboutImage.src = about.image || "";
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

function renderPricing(content) {
  const pricing = content.pricing || {};
  const packages = Array.isArray(pricing.packages) ? pricing.packages : [];

  elements.pricingEyebrow.textContent = pricing.eyebrow || "";
  elements.pricingTitle.textContent = pricing.title || "";
  elements.pricingGrid.innerHTML = packages
    .map(
      (item) => `
        <article class="price-card ${item.featured ? "featured" : ""} reveal">
            <h3>${escapeHtml(item.name)}</h3>
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
            <a href="#contact" class="${item.featured ? "primary-btn" : "ghost-btn"} full-width">
                ${escapeHtml(item.buttonLabel || "Choose Plan")}
            </a>
        </article>
      `
    )
    .join("");
}

function restartTestimonials(testimonials) {
  window.clearInterval(state.testimonialTimer);
  state.testimonialIndex = 0;

  if (testimonials.length <= 1) {
    elements.testimonialSlider.style.transform = "translateX(0)";
    return;
  }

  state.testimonialTimer = window.setInterval(() => {
    state.testimonialIndex = (state.testimonialIndex + 1) % testimonials.length;
    elements.testimonialSlider.style.transform = `translateX(-${state.testimonialIndex * 100}%)`;
  }, 5000);
}

function renderTestimonials(testimonials) {
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
  elements.eventType.innerHTML = categories
    .map((category) => `<option value="${escapeHtml(category.name)}">${escapeHtml(category.name)}</option>`)
    .join("");
}

function setLink(anchor, href, text) {
  anchor.href = href;
  if (typeof text === "string") {
    anchor.textContent = text;
  }
}

function renderContact(content, settings, categories) {
  const contact = content.contact || {};
  const info = settings.contact || {};

  elements.contactEyebrow.textContent = contact.eyebrow || "";
  elements.contactTitle.textContent = contact.title || "";
  elements.contactDescription.textContent = contact.description || "";
  elements.contactPhone.textContent = info.phone || "";
  elements.contactEmail.textContent = info.email || "";
  elements.contactLocation.textContent = info.location || "";

  setLink(elements.footerPhone, "#contact", info.phone || "");
  setLink(elements.footerEmail, "#contact", info.email || "");
  setLink(elements.footerLocation, "#contact", info.location || "");

  renderEventOptions(categories);
}

function renderFooter(settings) {
  const brand = settings.brand || {};
  const social = settings.social || {};
  const info = settings.contact || {};
  const digits = String(info.whatsapp || "").replace(/\D/g, "");

  elements.instagramHandleLink.textContent = brand.instagramHandle || "@ChaudhariClicks";
  elements.instagramHandleLink.href = social.instagram || "#";

  elements.footerDescription.textContent = brand.description || "";
  setLink(elements.footerFacebook, social.facebook || "#");
  setLink(elements.footerTwitter, social.twitter || "#");
  setLink(elements.footerInstagram, social.instagram || "#");
  setLink(elements.whatsappLink, digits ? `https://wa.me/${digits}` : "#");

  elements.footerYear.textContent = `${new Date().getFullYear()} Chaudhari Clicks. Crafted with passion.`
   <br>Designed by Vedteix Technologies.;
}

function rerenderIconsAndEffects() {
  lucide.createIcons();
  refreshRevealObserver();
}

async function loadSiteData() {
  const data = await fetchJson("/api/site");
  state.data = data;

  renderHero(data.content || {});
  renderFilters(data.categories || []);
  renderPortfolio(data.portfolioItems || []);
  renderAbout(data.content || {});
  renderPricing(data.content || {});
  renderTestimonials(data.testimonials || []);
  renderContact(data.content || {}, data.settings || {}, data.categories || []);
  renderFooter(data.settings || {});
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

  try {
    await fetchJson("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    elements.bookingForm.reset();
    renderEventOptions((state.data && state.data.categories) || []);
    showToast(`Thank you, ${payload.name}. Your inquiry has been sent.`);
  } catch (error) {
    showToast(error.message, true);
  }
}

function startPolling() {
  window.setInterval(async () => {
    try {
      await loadSiteData();
    } catch (error) {
      console.error(error);
    }
  }, 30000);
}

async function initializeSite() {
  setupNavigation();
  setupLightbox();
  elements.bookingForm.addEventListener("submit", handleLeadSubmit);

  try {
    await loadSiteData();
  } catch (error) {
    console.error(error);
    showToast("Unable to load website content right now.", true);
  } finally {
    hideLoader();
  }

  startPolling();
}

window.addEventListener("load", initializeSite);
